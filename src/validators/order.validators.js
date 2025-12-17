const { body } = require("express-validator");

const createOrderValidator = [
  body("items").optional().isArray({ min: 1 }),
  body("items.*.productId").optional().isMongoId(),
  body("items.*.quantity").optional().isInt({ min: 1 }).toInt(),
];

module.exports = { createOrderValidator };
