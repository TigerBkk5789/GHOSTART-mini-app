# GHOSTART Backend API

Node.js/Express backend API for GHOSTART NFT Management System.

## Features

- ✅ NFT Minting (pending admin approval)
- ✅ NFT Listing on Marketplace
- ✅ Admin-only: Approve/Edit/Remove NFTs
- ✅ Marketplace Statistics
- ✅ Password-protected admin routes
- ✅ World Chain address validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
ADMIN_PASSWORD=GHOSTART2024
PORT=3001
```

3. Start the server:
```bash
npm start        # Production
npm run dev      # Development (with nodemon)
```

## API Endpoints

### Public Routes

- `GET /api/nfts` - Get all approved NFTs
- `GET /api/nfts/:id` - Get single NFT details
- `GET /api/nfts/owner/:address` - Get NFTs owned by address
- `POST /api/nfts/mint` - Mint new NFT
- `POST /api/nfts/list` - List NFT on marketplace
- `GET /api/stats` - Get marketplace statistics

### Admin Routes (Requires Authorization Header)

- `GET /api/admin/pending` - Get pending NFTs
- `POST /api/admin/approve/:id` - Approve NFT
- `DELETE /api/admin/nfts/:id` - Remove NFT
- `PUT /api/admin/nfts/:id` - Edit NFT
- `GET /api/admin/approvals` - Get all pending approvals

### Admin Authentication

Include admin password in Authorization header:
```
Authorization: Bearer GHOSTART2024
```

## Configuration

- **CREATOR_WALLET**: `0x32f1e35291967c07ec02aa81394dbf87d1d25e52`
- **CREATOR_ROYALTY**: `10%`
- **ADMIN_PASSWORD**: Set via environment variable (default: `GHOSTART2024`)

## Deployment

Deploy to Vercel, Heroku, AWS Lambda, or Railway.

For Vercel, create `vercel.json` in server directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

