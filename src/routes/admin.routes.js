const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const { listAllOrders } = require("../controllers/admin.controller");

router.use(requireAuth, requireRole("admin"));

/**
 * @openapi
 * /admin/orders:
 *   get:
 *     tags: [Admin]
 *     summary: Admin list all orders
 */
router.get("/orders", listAllOrders);

module.exports = router;
