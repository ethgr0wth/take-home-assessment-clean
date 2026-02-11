import React, { useState } from 'react';
import './App.css';
import Projects from './components/Projects';
import Transactions from './components/Transactions';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-area">
          <h1>DecryptCode</h1>
          <span className="subtitle">Web3 Assessment Dashboard</span>
        </div>
      </header>
      <main className="App-main">
        <Projects onWalletConnect={setWalletAddress} walletAddress={walletAddress} />
        <Transactions walletAddress={walletAddress} />
      </main>
    </div>
  );
}

export default App;
