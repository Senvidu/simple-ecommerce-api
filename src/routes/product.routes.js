const router = require("express").Router();
const { listProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  listProductsValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../validators/product.validators");

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List products with pagination/sort/filter
 */
router.get("/", listProductsValidator, validate, listProducts);

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create product (admin)
 */
router.post("/", requireAuth, requireRole("admin"), createProductValidator, validate, createProduct);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product (admin)
 */
router.put("/:id", requireAuth, requireRole("admin"), updateProductValidator, validate, updateProduct);

router.delete("/:id", requireAuth, requireRole("admin"), deleteProductValidator, validate, deleteProduct);

module.exports = router;
