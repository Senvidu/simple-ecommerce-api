const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");
const { registerValidator, loginValidator } = require("../validators/auth.validators");
const { validate } = require("../middleware/validate");

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a user (customer by default; admin requires adminSecret)
 */
router.post("/register", registerValidator, validate, register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and receive JWT
 */
router.post("/login", loginValidator, validate, login);

module.exports = router;
