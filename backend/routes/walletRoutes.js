const express = require('express');
const walletController = require('../controllers/walletController');
const walletTransactionController = require('../controllers/walletTransactionController');

const router = express.Router();

router.get('/', walletController.listWallets);
router.get('/:address/transactions', walletTransactionController.getTransactionsByWallet);

module.exports = router;
