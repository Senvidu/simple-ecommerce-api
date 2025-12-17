const { validationResult } = require("express-validator");
const { ApiError } = require("./error");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation error", errors.array()));
  }
  return next();
}

module.exports = { validate };
