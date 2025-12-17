const { logger } = require("../config/logger");

class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const payload = {
    message: err.message || "Server error",
  };
  if (err.details) payload.details = err.details;

  if (status >= 500) {
    logger.error("Unhandled error", { message: err.message, stack: err.stack });
  }

  res.status(status).json(payload);
}

module.exports = { ApiError, notFoundHandler, errorHandler };
