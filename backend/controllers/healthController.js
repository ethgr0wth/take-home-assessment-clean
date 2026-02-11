/**
 * Health check controller.
 */
function getHealth(req, res) {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  getHealth,
};
