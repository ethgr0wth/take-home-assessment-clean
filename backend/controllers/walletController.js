const { getWallets, getWalletsByAddress } = require('../config/store');

/**
 * List all wallet balances.
 * Query params: address (filter by address), chainId
 */
function listWallets(req, res, next) {
  try {
    let wallets = getWallets();
    const { address, chainId } = req.query;

    if (address) {
      wallets = getWalletsByAddress(address);
    }

    if (chainId) {
      wallets = wallets.filter((w) => String(w.chainId) === String(chainId));
    }

    res.json({ success: true, data: wallets, count: wallets.length });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listWallets,
};
