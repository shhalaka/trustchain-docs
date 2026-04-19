# 🔗 TrustChain Docs

Tamper-proof document verification system built on the **XDC Apothem blockchain**

---

## 📌 Overview

TrustChain Docs is a full-stack Web3 application that allows institutions to **issue documents on the blockchain** and lets anyone **verify their authenticity** in seconds — without relying on any central authority.

Every document's SHA-256 hash is stored on the XDC Apothem blockchain. If a document is tampered with — even a single character change — the verification fails instantly.

**Built for:** TC No. 24 — Blockchain Technology for Logistics & Documentation

---

## ✨ Features

|        Feature       |                         Description                           |
|----------------------|---------------------------------------------------------------|
| 📄 Issue Document    | Upload a file + issuer name → stored on XDC blockchain        |
| 🔍 Verify Document   | Upload file + document ID → instantly validated against chain |
| 🔗 On-chain Proof    | Every transaction visible on XDC Apothem Explorer             |
| 📋 Copy Utilities    | One-click copy for Document ID and transaction hash           | 
| 🌗 Dark / Light Mode | Full theme support                                            | 
| 📱 Responsive UI      | Works on desktop and mobile                                   |

---

## 🧱 Tech Stack

### Frontend
- **React** (Vite) — fast, modern UI
- Custom drag-and-drop file upload
- Light/Dark theme toggle

### Backend
- **Node.js + Express** — REST API server
- **Multer** — file upload handling
- **ethers.js** — XDC blockchain interaction

### Database
- **MongoDB Atlas** — stores document metadata off-chain

### Blockchain
- **XDC Apothem Testnet** — stores document hashes on-chain
- **Solidity Smart Contract** — `issueCert()` and `verifyCert()` functions
- **SHA-256 Hashing** — tamper detection

---

## 🏗️ System Architecture

```
┌─────────────────────┐
│   React Frontend    │  ← Issue / Verify 
└────────┬────────────┘
         │ HTTP
┌────────▼────────────┐
│  Node.js + Express  │  ← /issue  /verify  
└────────┬────────────┘
         │
    ┌────┴────────────────────┐
    │                         │
┌───▼──────────┐   ┌──────────▼──────────┐
│  MongoDB     │   │   XDC Apothem       │
│  (metadata)  │   │   Smart Contract    │
│  fileName    │   │   docHash on-chain  │
│  issuer      │   │   txHash proof      │
│  timestamp   │   └─────────────────────┘
└──────────────┘
```

---

## 🚀 Demo 

1. **Issue** — Upload `certificate.pdf` with issuer name → stored on XDC blockchain
2. **Verify (original)** → ✅ `Document is authentic`
3. **Tamper** — Open the PDF, change one word, save it
4. **Verify (modified)** → ❌ `Document has been tampered`

> The blockchain caught the change — no central server, no trust required.

**Live transaction proof:** [explorer.apothem.network](https://explorer.apothem.network)

---

## 📁 Project Structure

```
trustchain-docs/
├── contracts/              ← Solidity smart contract
│   └── TrustChain.sol
├── server/                 ← Express backend
│   ├── index.js
│   ├── routes/
│   └── models/
├── src/                    ← React frontend
│   ├── pages/
│   │   ├── Issue.jsx
│   │   └── Verify.jsx
│   ├── App.jsx
│   └── App.css
├── .env                    ← Environment variables (not committed)
└── package.json
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- MetaMask with XDC Apothem configured
- Test XDC from [faucet.apothem.network](https://faucet.apothem.network)

---

### 1. Clone the repository

```bash
git clone https://github.com/shhalaka/trustchain-docs
cd TrustChain-Docs
```

---

### 2. Deploy the smart contract

Open [remix.ethereum.org](https://remix.ethereum.org), paste `contracts/TrustChain.sol`, and deploy to XDC Apothem:

- **RPC URL:** `https://rpc.apothem.network`
- **Chain ID:** `51`

Copy the deployed contract address — you'll need it in `.env`.

---

### 3. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=your_mongodb_connection_string
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=your_deployed_contract_address
```

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

Start the server:

```bash
node index.js
```

Server runs at `http://localhost:3000`

---

### 4. Frontend setup

```bash
cd src
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🔗 API Reference

### `POST /issue`
Issues a document on the blockchain.

|  Field   |         Type          |          Description          |
|----------|-----------------------|-------------------------------|
| `file`   | `multipart/form-data` | The document file             |
| `issuer` | `string`              | Name of the issuing authority |

**Response:**
```json
{
  "documentId": "TC-1776588540293",
  "txHash": "0x4f2a...",
  "fileHash": "sha256:a3b2c1...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### `POST /verify`
Verifies a document against the blockchain record.

| Field        |         Type          |         Description           |
|--------------|-----------------------|-------------------------------|
| `file`       | `multipart/form-data` | The document to verify        |
| `documentId` | `string`              | The TC-xxxx ID issued earlier |

**Response:**
```json
{
  "valid": true,
  "issuer": "TechVarsha Institute of Technology",
  "txHash": "0x4f2a...",
  "issuedAt": "2024-01-15T10:30:00Z"
}
```

---

## 🌐 Blockchain Details

| Property |                           Value                              |
|----------|--------------------------------------------------------------|
| Network  | XDC Apothem Testnet                                          |
| Chain ID | 51                                                           |
| RPC URL  | `https://rpc.apothem.network`                                |
| Explorer | [explorer.apothem.network](https://explorer.apothem.network) |
| Faucet   | [faucet.apothem.network](https://faucet.apothem.network)     |

---

## 🚧 Upcoming Features
- [ ] History Dashboard
- [ ] Document history dashboard with search & filter
- [ ] QR code generation for certificates
- [ ] Analytics dashboard (documents issued, verified, flagged)
- [ ] Bulk document issuance
