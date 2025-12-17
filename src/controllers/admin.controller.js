const Order = require("../models/Order");

async function listAllOrders(req, res, next) {
  try {
    const orders = await Order.find({})
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ items: orders });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAllOrders };
