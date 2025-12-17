const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { ApiError } = require("../middleware/error");

// Atomic decrement for race-condition safety:
// findOneAndUpdate({ _id, stockQuantity: { $gte: qty } }, { $inc: { stockQuantity: -qty } })
async function placeOrder(req, res, next) {
  try {
    const userId = req.user.id;

    // If items provided in request body, use them; otherwise use user's cart.
    let requestedItems = req.body.items;

    if (!requestedItems || requestedItems.length === 0) {
      const user = await User.findById(userId).lean();
      if (!user) throw new ApiError(404, "User not found");
      if (!user.cart || user.cart.length === 0) throw new ApiError(400, "No items provided and cart is empty");

      requestedItems = user.cart.map((i) => ({ productId: i.product.toString(), quantity: i.quantity }));
    }

    // Normalize + aggregate duplicates
    const qtyByProduct = new Map();
    for (const it of requestedItems) {
      const pid = it.productId;
      const qty = Number(it.quantity);
      if (!mongoose.Types.ObjectId.isValid(pid) || !Number.isFinite(qty) || qty < 1) {
        throw new ApiError(400, "Invalid items payload");
      }
      qtyByProduct.set(pid, (qtyByProduct.get(pid) || 0) + qty);
    }

    const productIds = Array.from(qtyByProduct.keys()).map((id) => new mongoose.Types.ObjectId(id));
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    if (products.length !== productIds.length) {
      throw new ApiError(404, "One or more products not found");
    }

    const decremented = []; // { productId, qty }
    try {
      // Decrement stock atomically per product
      for (const p of products) {
        const qty = qtyByProduct.get(p._id.toString());
        const updated = await Product.findOneAndUpdate(
          { _id: p._id, stockQuantity: { $gte: qty } },
          { $inc: { stockQuantity: -qty } },
          { new: true }
        ).lean();

        if (!updated) {
          throw new ApiError(400, `Insufficient stock for product: ${p.name}`);
        }
        decremented.push({ productId: p._id, qty });
      }

      // Create order snapshot (name/price captured)
      const items = products.map((p) => {
        const qty = qtyByProduct.get(p._id.toString());
        const lineTotal = qty * p.price;
        return { product: p._id, name: p.name, price: p.price, quantity: qty, lineTotal };
      });

      const totalAmount = items.reduce((sum, i) => sum + i.lineTotal, 0);
      const order = await Order.create({ user: userId, items, totalAmount });

      // Clear cart after successful order
      await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

      return res.status(201).json(order);
    } catch (err) {
      // Roll back any decrements
      for (const d of decremented) {
        await Product.updateOne({ _id: d.productId }, { $inc: { stockQuantity: d.qty } });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ items: orders });
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, myOrders };
