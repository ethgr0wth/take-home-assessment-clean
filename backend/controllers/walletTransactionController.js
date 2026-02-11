const { getTransactions } = require('../config/store');

const ETH_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

function getTransactionsByWallet(req, res, next) {
  try {
    const { address } = req.params;

    if (!ETH_ADDRESS_REGEX.test(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format. Expected 0x followed by 40 hex characters.',
      });
    }

    const allTransactions = getTransactions();
    const addr = address.toLowerCase();

    const filtered = allTransactions.filter(
      (t) => t.from.toLowerCase() === addr || t.to.toLowerCase() === addr
    );

    res.json({ success: true, data: filtered, count: filtered.length });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTransactionsByWallet,
};
