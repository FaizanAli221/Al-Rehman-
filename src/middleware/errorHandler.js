/**
 * 404 handler — must be mounted after all valid routes.
 */
function notFound(req, res, _next) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Centralized error handler. Understands Zod validation errors
 * as well as manually-thrown errors carrying a `.status`.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  if (err.name === "ZodError") {
    const message = err.errors
      .map((e) => `${e.path.join(".") || "body"}: ${e.message}`)
      .join("; ");
    return res.status(400).json({ success: false, error: message });
  }

  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 ? "Internal server error" : err.message || "Bad request";

  if (status === 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({ success: false, error: message });
}

module.exports = { notFound, errorHandler };
