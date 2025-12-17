const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { placeOrder, myOrders } = require("../controllers/order.controller");
const { createOrderValidator } = require("../validators/order.validators");

router.use(requireAuth, requireRole("customer"));

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Place an order (uses body items or user's cart)
 */
router.post("/", createOrderValidator, validate, placeOrder);

/**
 * @openapi
 * /orders/my-orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get current user's orders
 */
router.get("/my-orders", myOrders);

module.exports = router;
