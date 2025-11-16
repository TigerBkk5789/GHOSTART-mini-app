# GHOSTART Mini App

<div align="center">
<img width="1200" height="475" alt="GHOSTART Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 🎨 GHOSTART NFTs & Meme Token Trading Wallet

A World Chain mini app that merges NFT collectibles, meme token trading, and wallet utilities powered by $GHOSTART and WLD.

## ✨ Features

- 🎨 **NFT Marketplace** - Browse, mint, and trade GHOSTART NFTs
- 💰 **Token Trading** - Swap between WLD and GHOSTART tokens
- 🔐 **Wallet Integration** - MetaMask and World App support
- 📊 **Staking** - Stake GHOSTART tokens with 18% APY (180 days lock)
- 👑 **Admin Panel** - Owner-only NFT approval and management
- 📱 **Mobile-First** - Optimized for mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or World App wallet

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tigerbkk5789/ghostart-mini-app.git
   cd ghostart-mini-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Set up environment variables:**
   
   Create `server/.env`:
   ```env
   ADMIN_PASSWORD=GHOSTART2024
   PORT=3001
   ```
   
   Create `.env` (optional):
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. **Run development servers:**
   ```bash
   # Run both frontend and backend
   npm run dev:all
   
   # Or separately:
   npm run dev          # Frontend (port 3000)
   npm run server:dev   # Backend (port 3001)
   ```

## 📦 Project Structure

```
├── api/                 # Vercel serverless functions
├── components/         # React components
├── pages/              # Page components
├── server/             # Express backend API
├── src/
│   ├── utils/          # API utilities & constants
│   └── types/          # TypeScript type definitions
├── vercel.json         # Vercel configuration
└── package.json        # Frontend dependencies
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel Dashboard:**
   - `ADMIN_PASSWORD` = `GHOSTART2024`

See [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) for detailed deployment instructions.

## 🔧 Configuration

### Owner Wallet Address

The owner/admin wallet address is configured in `src/utils/constants.ts`:
- **Owner Address**: `0x32f1e35291967c07ec02aa81394dbf87d1d25e52`
- Only this address can approve/edit/remove NFTs

### Token Addresses (World Chain)

- **GHOSTART Token**: `0x4df029e25EA0043fCb7A7f15f2b25F62C9BDb990`
- **WLD Token**: `0x163f8C2467924be0ae7B5347228CABF260318753`
- **Staking Address**: `0x32f1e35291967c07ec02aa81394dbf87d1d25e52`

## 📚 API Endpoints

### Public Routes
- `GET /api/nfts` - Get all approved NFTs
- `GET /api/nfts/:id` - Get NFT details
- `POST /api/nfts/mint` - Mint new NFT
- `POST /api/nfts/list` - List NFT on marketplace
- `GET /api/stats` - Get marketplace statistics

### Admin Routes (Password Protected)
- `GET /api/admin/pending` - Get pending NFTs
- `POST /api/admin/approve/:id` - Approve NFT
- `DELETE /api/admin/nfts/:id` - Remove NFT
- `PUT /api/admin/nfts/:id` - Edit NFT

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express
- **Blockchain**: ethers.js, World Chain
- **Deployment**: Vercel
- **Styling**: Tailwind CSS (via styles.css)

## 📝 License

This project is private and proprietary.

## 👥 Contributors

- **Owner**: tigerbkk5789
- **World Chain Address**: 0x32f1e35291967c07ec02aa81394dbf87d1d25e52

## 🔗 Links

- **View in AI Studio**: https://ai.studio/apps/drive/19CKOF9EubzDO1nyoO2rHVfAU3wfonoFD
- **GitHub Repository**: https://github.com/tigerbkk5789/ghostart-mini-app

---

Built with ❤️ for the World Chain community
