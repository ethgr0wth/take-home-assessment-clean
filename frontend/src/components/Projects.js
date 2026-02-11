import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

function truncateAddress(address) {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function Projects({ onWalletConnect, walletAddress }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletError, setWalletError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        const url = statusFilter
          ? `${API_BASE}/projects?status=${statusFilter}`
          : `${API_BASE}/projects`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load projects: ${res.status}`);
        const json = await res.json();
        if (!cancelled && json.data) setProjects(json.data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to fetch projects');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProjects();
    return () => { cancelled = true; };
  }, [statusFilter]);

  async function connectWallet() {
    setWalletError(null);
    if (!window.ethereum) {
      setWalletError('MetaMask (or another Web3 wallet) is not installed.');
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts && accounts[0]) {
        onWalletConnect(accounts[0]);
      }
    } catch (err) {
      setWalletError(err.message || 'Failed to connect wallet');
    }
  }

  return (
    <section className="projects-section">
      <div className="section-header">
        <h2>Projects</h2>
        <div className="header-actions">
          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="in-progress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
          <div className="wallet-row">
            {walletAddress ? (
              <span className="wallet-address" title={walletAddress}>
                {truncateAddress(walletAddress)}
              </span>
            ) : (
              <button type="button" className="connect-wallet-btn" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        {walletError && <p className="wallet-error">{walletError}</p>}
      </div>

      {loading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner" />
          <p className="loading-text">Loading projects...</p>
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="projects-grid">
          {projects.map((p) => (
            <div key={p.id} className="project-card">
              <div className="project-card-header">
                <h3 className="project-name">{p.name}</h3>
                <span className={`project-status project-status--${(p.status || '').replace(/\s+/g, '-')}`}>
                  {p.status}
                </span>
              </div>
              <p className="project-description">
                {p.description && p.description.length > 120
                  ? p.description.slice(0, 120) + '...'
                  : p.description}
              </p>
              <div className="project-card-footer">
                <span className="project-chain">{p.chain}</span>
                {p.tvlUsd && p.tvlUsd !== '0' && (
                  <span className="project-tvl">
                    TVL: ${Number(p.tvlUsd).toLocaleString()}
                  </span>
                )}
              </div>
              {p.technologies && p.technologies.length > 0 && (
                <div className="project-tech">
                  {p.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                  {p.technologies.length > 3 && (
                    <span className="tech-badge tech-badge--more">+{p.technologies.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Projects;
