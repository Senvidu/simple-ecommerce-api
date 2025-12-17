const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    price: { type: Number, required: true, min: 0.01 },
    description: { type: String, default: "", maxlength: 2000 },
    category: { type: String, default: "general", trim: true, maxlength: 80 },
    stockQuantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

module.exports = mongoose.model("Product", ProductSchema);
