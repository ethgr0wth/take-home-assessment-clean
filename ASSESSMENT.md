# DecryptCode Senior Web3 & Blockchain Engineer Assessment

Welcome! This assessment evaluates your ability to work across smart contracts, backend services, and frontend dApps—typical of a senior Web3 engineer role.

**Time estimate:** 40–60 minutes for required tasks. Nice-to-haves add 15–30 min if time permits.

---

## Setup

1. Run `npm run install:all` from the project root
2. Run `npm start` to launch both backend and frontend
3. Backend loads mock data on start; API is at `http://localhost:3001/api`
4. Frontend runs at `http://localhost:3000`

---

## Required Tasks (Complete All 3 — ~40–60 min total)

### Task 1: Backend Query Filter (~10 min)

**Objective:** Quick API extension.

- Add a **`?status=`** query parameter to `GET /api/projects` to filter by status (e.g., `?status=active`, `?status=in-progress`)
- When provided, return only projects matching that status
- The endpoint and store already exist; add filtering in the project controller

**Deliverable:** `GET /api/projects?status=active` returns filtered results.

---

### Task 2: Backend — Wallet Transactions Endpoint (~20–25 min)

**Objective:** Add a dedicated API for transactions by wallet address.

- Add **`GET /api/wallets/:address/transactions`** that returns all transactions where the given address is either sender or receiver
- Use the existing transactions data/store; filter in a new controller or extend the transaction controller
- Return `404` with a clear message if the address has no transactions; return `200` with an empty array if the address is valid but has no matches
- Optionally validate address format (e.g. 0x + 40 hex chars) and return `400` for invalid addresses

**Deliverable:** `GET /api/wallets/:address/transactions` returns filtered transactions; invalid or unknown address handled with appropriate status codes.

---

### Task 3: Smart Contract Security Review (~15–20 min)

**Objective:** Demonstrate Solidity and security awareness.

- Review `contracts/SimpleToken.sol`
- Create **`SECURITY_REVIEW.md`** documenting **2–3 findings** with:
  - Brief description
  - Severity (Low / Medium / High)
  - Recommended fix (1–2 sentences each)
- Focus on: approval race, access control, zero-address checks, or other issues you spot
- **No code changes required** — documentation only

**Deliverable:** `SECURITY_REVIEW.md` with 2–3 documented findings.

---

## Nice-to-Have Tasks (If Time Permits — 15–30 min each)

### Task 4: Transaction List by Wallet

- Add a transactions list from `GET /api/transactions`
- When a wallet is connected, filter to show only transactions where the address is sender or receiver
- Simple table or list; truncate addresses

---

### Task 5: UI Polish

- Add a loading spinner while fetching projects
- Improve basic styling (cards, spacing)

---

## Tech Stack Reference

- **Backend:** Node.js, Express
- **Frontend:** React 18
- **Contracts:** Solidity ^0.8.x, EVM-compatible
- **Web3:** ethers.js, wagmi, or web3.js (your choice)

Good luck! We value clean code, security awareness, and thoughtful design as much as feature completeness.
