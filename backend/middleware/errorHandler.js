/**
 * Global error handler middleware.
 * Catches errors from routes/controllers and returns consistent JSON responses.
 */
function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
