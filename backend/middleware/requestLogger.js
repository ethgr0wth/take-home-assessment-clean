/**
 * Request logger middleware.
 * Logs method, path, and response time for each request.
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    console.log(log);
  });

  next();
}

module.exports = requestLogger;
