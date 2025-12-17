const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { getCart, addItem, updateItem, removeItem, clearCart } = require("../controllers/cart.controller");
const { addCartItemValidator, updateCartItemValidator, removeCartItemValidator } = require("../validators/cart.validators");

/**
 * Cart is for customers only.
 */
router.use(requireAuth, requireRole("customer"));

router.get("/", getCart);
router.post("/items", addCartItemValidator, validate, addItem);
router.put("/items/:productId", updateCartItemValidator, validate, updateItem);
router.delete("/items/:productId", removeCartItemValidator, validate, removeItem);
router.delete("/clear", clearCart);

module.exports = router;
