const express = require('express');
const cors = require('cors');
const { loadMockData } = require('./config/store');
const apiRoutes = require('./routes');
const { errorHandler, requestLogger } = require('./middleware');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Load mock data automatically when backend starts (npm start)
try {
  loadMockData();
} catch (err) {
  console.error('Failed to load mock data:', err.message);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found', path: req.originalUrl });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running at http://0.0.0.0:${PORT}`);
  console.log('Mock data loaded automatically on startup');
});
