// Vercel Serverless Function wrapper for GHOSTART Backend API
// This file routes all /api/* requests to the Express server

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============ Configuration ============

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'GHOSTART2024';
const ADMIN_PASSWORD_HASH = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest('hex');
const CREATOR_WALLET = '0x32f1e35291967c07ec02aa81394dbf87d1d25e52';
const CREATOR_ROYALTY = 10;

// In-memory database (use MongoDB/Firebase for production)
let nfts = [
  {
    id: 1,
    name: 'Ghost Rider #1',
    creator: 'GHOSTART',
    image: '👻',
    wldPrice: 2.5,
    rarity: 'Rare',
    traits: ['Red Eyes', 'Fire Chain'],
    approved: true,
    listed: true,
    owner: null,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'Flaming Skull #42',
    creator: 'GHOSTART',
    image: '💀',
    wldPrice: 5.0,
    rarity: 'Epic',
    traits: ['Glowing', 'Ancient'],
    approved: true,
    listed: true,
    owner: null,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: 'Alien Punk #88',
    creator: 'GHOSTART',
    image: '👽',
    wldPrice: 10.0,
    rarity: 'Legendary',
    traits: ['Holographic', 'Rare'],
    approved: true,
    listed: true,
    owner: null,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: 'Glitch Spirit #7',
    creator: 'GHOSTART',
    image: '✨',
    wldPrice: 3.2,
    rarity: 'Rare',
    traits: ['Shimmer', 'Ethereal'],
    approved: true,
    listed: true,
    owner: null,
    createdAt: new Date(),
  },
];

let nextId = 5;
let pendingApprovals = [];

// ============ Middleware ============

const verifyAdmin = (req, res, next) => {
  const password = req.headers.authorization?.split(' ')[1];
  if (!password) {
    return res.status(401).json({ error: 'Missing admin password' });
  }
  
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  if (hash !== ADMIN_PASSWORD_HASH) {
    return res.status(403).json({ error: 'Invalid admin password' });
  }
  
  next();
};

const validateWalletAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// ============ Public Routes ============

app.get('/api/nfts', (req, res) => {
  try {
    const approvedNFTs = nfts.filter(nft => nft.approved && nft.listed);
    res.json({
      success: true,
      data: approvedNFTs,
      count: approvedNFTs.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/nfts/:id', (req, res) => {
  try {
    const nft = nfts.find(n => n.id === parseInt(req.params.id));
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }
    res.json({
      success: true,
      data: nft,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/nfts/owner/:address', (req, res) => {
  try {
    if (!validateWalletAddress(req.params.address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const ownerNFTs = nfts.filter(
      nft => nft.owner && nft.owner.toLowerCase() === req.params.address.toLowerCase()
    );
    
    res.json({
      success: true,
      data: ownerNFTs,
      count: ownerNFTs.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/nfts/list', (req, res) => {
  try {
    const { nftId, owner, wldPrice } = req.body;

    if (!nftId || !owner || !wldPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validateWalletAddress(owner)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    if (wldPrice <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    const nft = nfts.find(n => n.id === parseInt(nftId));
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    if (nft.owner && nft.owner.toLowerCase() !== owner.toLowerCase()) {
      return res.status(403).json({ error: 'You do not own this NFT' });
    }

    nft.owner = owner;
    nft.wldPrice = parseFloat(wldPrice);
    nft.listed = true;
    nft.approved = false;
    pendingApprovals.push({ nftId, owner, timestamp: new Date() });

    res.json({
      success: true,
      message: 'NFT listed for marketplace approval',
      data: nft,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/nfts/mint', (req, res) => {
  try {
    const {
      name,
      image,
      wldPrice,
      rarity,
      traits,
      owner,
      creator,
    } = req.body;

    if (!name || !image || !wldPrice || !owner) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validateWalletAddress(owner)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const newNFT = {
      id: nextId++,
      name,
      creator: creator || 'User',
      image,
      wldPrice: parseFloat(wldPrice),
      rarity: rarity || 'Common',
      traits: traits || [],
      owner,
      approved: false,
      listed: false,
      createdAt: new Date(),
      contractAddress: CREATOR_WALLET,
      royalty: CREATOR_ROYALTY,
    };

    nfts.push(newNFT);
    pendingApprovals.push({ nftId: newNFT.id, action: 'mint', timestamp: new Date() });

    res.status(201).json({
      success: true,
      message: 'NFT minted successfully, pending admin approval',
      data: newNFT,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const totalNFTs = nfts.length;
    const approvedNFTs = nfts.filter(n => n.approved).length;
    const listedNFTs = nfts.filter(n => n.listed && n.approved).length;
    const pendingCount = pendingApprovals.length;
    const totalValue = nfts
      .filter(n => n.approved)
      .reduce((sum, n) => sum + n.wldPrice, 0);

    res.json({
      success: true,
      data: {
        totalNFTs,
        approvedNFTs,
        listedNFTs,
        pendingApprovals: pendingCount,
        totalMarketValue: totalValue.toFixed(2),
        creatorAddress: CREATOR_WALLET,
        creatorRoyalty: `${CREATOR_ROYALTY}%`,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Admin Routes ============

app.get('/api/admin/pending', verifyAdmin, (req, res) => {
  try {
    const pending = nfts.filter(n => !n.approved);
    res.json({
      success: true,
      data: pending,
      count: pending.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/approve/:id', verifyAdmin, (req, res) => {
  try {
    const nft = nfts.find(n => n.id === parseInt(req.params.id));
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    nft.approved = true;
    nft.listed = true;
    pendingApprovals = pendingApprovals.filter(p => p.nftId !== nft.id);

    res.json({
      success: true,
      message: `NFT "${nft.name}" approved for marketplace`,
      data: nft,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/nfts/:id', verifyAdmin, (req, res) => {
  try {
    const index = nfts.findIndex(n => n.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    const removed = nfts.splice(index, 1)[0];
    pendingApprovals = pendingApprovals.filter(p => p.nftId !== removed.id);

    res.json({
      success: true,
      message: `NFT "${removed.name}" removed`,
      data: removed,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/nfts/:id', verifyAdmin, (req, res) => {
  try {
    const nft = nfts.find(n => n.id === parseInt(req.params.id));
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    const { name, wldPrice, rarity, traits } = req.body;
    if (name) nft.name = name;
    if (wldPrice) nft.wldPrice = parseFloat(wldPrice);
    if (rarity) nft.rarity = rarity;
    if (traits) nft.traits = traits;

    res.json({
      success: true,
      message: 'NFT updated successfully',
      data: nft,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/approvals', verifyAdmin, (req, res) => {
  try {
    res.json({
      success: true,
      data: pendingApprovals,
      count: pendingApprovals.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Health Check ============

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ============ Error Handler ============

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel serverless
module.exports = app;

