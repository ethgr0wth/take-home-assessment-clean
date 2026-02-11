import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

function truncateAddress(address) {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Transactions({ walletAddress }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchTransactions() {
      setLoading(true);
      setError(null);
      try {
        const url = walletAddress
          ? `${API_BASE}/wallets/${walletAddress}/transactions`
          : `${API_BASE}/transactions`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load transactions: ${res.status}`);
        const json = await res.json();
        if (!cancelled && json.data) setTransactions(json.data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to fetch transactions');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTransactions();
    return () => { cancelled = true; };
  }, [walletAddress]);

  if (loading) {
    return (
      <section className="transactions-section">
        <h2>Transactions</h2>
        <div className="loading-spinner-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading transactions...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="transactions-section">
        <h2>Transactions</h2>
        <p className="error-message">{error}</p>
      </section>
    );
  }

  return (
    <section className="transactions-section">
      <div className="section-header">
        <h2>Transactions</h2>
        {walletAddress && (
          <span className="filter-badge">
            Filtered by {truncateAddress(walletAddress)}
          </span>
        )}
        <span className="count-badge">{transactions.length} total</span>
      </div>
      {transactions.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found{walletAddress ? ' for this wallet' : ''}.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
                <th>Token</th>
                <th>Chain</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <span className="method-badge">{tx.method}</span>
                  </td>
                  <td>
                    <span className={`address ${walletAddress && tx.from.toLowerCase() === walletAddress.toLowerCase() ? 'address--highlight' : ''}`} title={tx.from}>
                      {truncateAddress(tx.from)}
                    </span>
                  </td>
                  <td>
                    <span className={`address ${walletAddress && tx.to.toLowerCase() === walletAddress.toLowerCase() ? 'address--highlight' : ''}`} title={tx.to}>
                      {truncateAddress(tx.to)}
                    </span>
                  </td>
                  <td className="value-cell">{tx.value}</td>
                  <td>
                    <span className="token-badge">{tx.token}</span>
                  </td>
                  <td className="chain-cell">{tx.chainId}</td>
                  <td>
                    <span className={`status-dot status-dot--${tx.status}`} />
                    {tx.status}
                  </td>
                  <td className="date-cell">{formatTimestamp(tx.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Transactions;
