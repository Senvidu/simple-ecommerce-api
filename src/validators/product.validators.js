const { body, param, query } = require("express-validator");

const listProductsValidator = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("sort").optional().isIn(["price", "-price"]),
  query("category").optional().isString().trim().isLength({ min: 1, max: 80 }),
];

const createProductValidator = [
  body("name").isString().trim().isLength({ min: 2, max: 120 }),
  body("price").isFloat({ gt: 0 }).toFloat(),
  body("description").optional().isString().isLength({ max: 2000 }),
  body("category").optional().isString().trim().isLength({ min: 1, max: 80 }),
  body("stockQuantity").isInt({ min: 0 }).toInt(),
];

const updateProductValidator = [
  param("id").isMongoId(),
  body("name").optional().isString().trim().isLength({ min: 2, max: 120 }),
  body("price").optional().isFloat({ gt: 0 }).toFloat(),
  body("description").optional().isString().isLength({ max: 2000 }),
  body("category").optional().isString().trim().isLength({ min: 1, max: 80 }),
  body("stockQuantity").optional().isInt({ min: 0 }).toInt(),
];

const deleteProductValidator = [param("id").isMongoId()];

module.exports = {
  listProductsValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
