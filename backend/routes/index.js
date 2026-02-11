const express = require('express');
const healthController = require('../controllers/healthController');
const projectRoutes = require('./projectRoutes');
const transactionRoutes = require('./transactionRoutes');
const walletRoutes = require('./walletRoutes');

const router = express.Router();

// Health
router.get('/health', healthController.getHealth);

// Resource routes
router.use('/projects', projectRoutes);
router.use('/transactions', transactionRoutes);
router.use('/wallets', walletRoutes);

module.exports = router;
