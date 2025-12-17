const Product = require("../models/Product");
const { ApiError } = require("../middleware/error");

async function listProducts(req, res, next) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || "price";
    const category = req.query.category;

    const filter = {};
    if (category) filter.category = category;

    const sortObj = {};
    sortObj.price = sort === "-price" ? -1 : 1;

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, price, description, stockQuantity, category } = req.body;
    const product = await Product.create({ name, price, description, stockQuantity, category });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const update = req.body;

    const product = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!product) throw new ApiError(404, "Product not found");

    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new ApiError(404, "Product not found");
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, createProduct, updateProduct, deleteProduct };
