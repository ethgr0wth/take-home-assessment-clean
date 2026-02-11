const { getTransactions, getTransactionById } = require('../config/store');

/**
 * List all transactions.
 * Query params: address (filter by from/to), chainId, limit
 */
function listTransactions(req, res, next) {
  try {
    let transactions = getTransactions();
    const { address, chainId, limit } = req.query;

    if (address) {
      const addr = address.toLowerCase();
      transactions = transactions.filter(
        (t) => t.from.toLowerCase() === addr || t.to.toLowerCase() === addr
      );
    }

    if (chainId) {
      transactions = transactions.filter((t) => String(t.chainId) === String(chainId));
    }

    const maxLimit = Math.min(parseInt(limit, 10) || transactions.length, 100);
    transactions = transactions.slice(0, maxLimit);

    res.json({ success: true, data: transactions, count: transactions.length });
  } catch (err) {
    next(err);
  }
}

/**
 * Get a single transaction by ID.
 */
function getTransaction(req, res, next) {
  try {
    const transaction = getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
        id: req.params.id,
      });
    }
    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listTransactions,
  getTransaction,
};
