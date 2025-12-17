const { body, param } = require("express-validator");

const addCartItemValidator = [
  body("productId").isMongoId(),
  body("quantity").isInt({ min: 1 }).toInt(),
];

const updateCartItemValidator = [
  param("productId").isMongoId(),
  body("quantity").isInt({ min: 1 }).toInt(),
];

const removeCartItemValidator = [param("productId").isMongoId()];

module.exports = { addCartItemValidator, updateCartItemValidator, removeCartItemValidator };
