# DecryptCode Web3 Assessment

Assessment project for the Senior Web3 & Blockchain Engineer position.

## Quick Start

```bash
npm run install:all
npm start
```

- **Backend:** http://localhost:3001 (mock data loads on start)
- **Frontend:** http://localhost:3000

## Project Structure

```
decryptcode/
├── ASSESSMENT.md      # Task instructions (read this first!)
├── backend/           # Node.js + Express API
│   ├── config/        # Mock data store (loads on npm start)
│   └── routes/        # API routes
├── frontend/          # React app
└── contracts/         # Solidity smart contract
```

## API Endpoints (Pre-built)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/projects | List projects |
| GET | /api/transactions | List transactions |
| GET | /api/wallets | List wallets |

See **ASSESSMENT.md** for required and optional tasks.
