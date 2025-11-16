# Vercel Deployment Guide for GHOSTART Mini App

## 🚀 Quick Start

### Option 1: Run Locally with Vercel Dev (Recommended for Testing)

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Run Vercel dev server (simulates production environment)
vercel dev
```

This will:
- Start the frontend on `http://localhost:3000`
- Start the API serverless functions on `/api/*` routes
- Simulate the Vercel production environment locally

### Option 2: Deploy to Vercel

```bash
# Login to Vercel (first time only)
vercel login

# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

## 📋 Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

### Required:
- `ADMIN_PASSWORD` - Admin password for NFT approvals (default: `GHOSTART2024`)

### Optional:
- `VITE_API_URL` - API base URL (auto-detected in production)

## 🔧 Configuration

### Frontend API URL

The frontend automatically detects the API URL:
- **Production**: Uses relative URLs (`/api/*`)
- **Development**: Uses `http://localhost:3001` (from `.env`)

### API Routes

All API routes are available at:
- `GET /api/nfts` - Get all approved NFTs
- `POST /api/nfts/mint` - Mint new NFT
- `POST /api/nfts/list` - List NFT
- `GET /api/admin/pending` - Get pending NFTs (admin only)
- `POST /api/admin/approve/:id` - Approve NFT (admin only)
- And more... (see `api/index.js`)

## 📁 Project Structure

```
├── api/
│   └── index.js          # Serverless API functions
├── dist/                 # Built frontend (generated)
├── vercel.json          # Vercel configuration
└── package.json         # Frontend dependencies
```

## 🎯 Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard
   - Select your project
   - Settings → Environment Variables
   - Add `ADMIN_PASSWORD`

4. **Redeploy** (if you added env vars after first deploy)

## 🔍 Testing Locally

```bash
# Run both frontend and backend
npm run dev:all

# Or use Vercel dev (recommended)
vercel dev
```

## 📝 Notes

- The API is serverless and runs on Vercel's edge network
- Frontend is statically served from `dist/` directory
- All `/api/*` routes are automatically routed to serverless functions
- The app uses in-memory storage (consider MongoDB for production)

## 🌐 Production URL

After deployment, your app will be available at:
- `https://your-project.vercel.app`

Update the `VITE_API_URL` environment variable if needed, or use relative URLs (recommended).

