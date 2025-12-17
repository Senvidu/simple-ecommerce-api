const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const { ApiError } = require("../middleware/error");

async function getCart(req, res, next) {
  try {
    const user = await User.findById(req.user.id).populate("cart.product").lean();
    if (!user) throw new ApiError(404, "User not found");

    const items = (user.cart || []).map((ci) => ({
      product: ci.product,
      quantity: ci.quantity,
      lineTotal: ci.product ? ci.quantity * ci.product.price : 0,
    }));

    const total = items.reduce((sum, i) => sum + i.lineTotal, 0);

    res.json({ items, total });
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId).lean();
    if (!product) throw new ApiError(404, "Product not found");

    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");

    const idx = user.cart.findIndex((i) => i.product.toString() === productId);
    if (idx >= 0) {
      user.cart[idx].quantity += quantity;
    } else {
      user.cart.push({ product: new mongoose.Types.ObjectId(productId), quantity });
    }
    await user.save();

    res.status(201).json({ message: "Added to cart" });
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");

    const idx = user.cart.findIndex((i) => i.product.toString() === productId);
    if (idx < 0) throw new ApiError(404, "Item not in cart");

    user.cart[idx].quantity = quantity;
    await user.save();

    res.json({ message: "Updated cart item" });
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");

    const before = user.cart.length;
    user.cart = user.cart.filter((i) => i.product.toString() !== productId);
    if (user.cart.length === before) throw new ApiError(404, "Item not in cart");

    await user.save();
    res.json({ message: "Removed from cart" });
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
