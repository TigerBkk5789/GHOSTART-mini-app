// API utility functions for GHOSTART Backend

// Auto-detect API URL: use relative URLs in production, localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface NFT {
  id: number;
  name: string;
  creator: string;
  image: string;
  wldPrice: number;
  ghostartPrice?: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  traits: string[];
  owner: string | null;
  approved: boolean;
  listed?: boolean;
  createdAt?: string;
  contractAddress?: string;
  royalty?: number;
}

export interface MintNFTData {
  name: string;
  image: string;
  wldPrice: number;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  traits?: string[];
  owner: string;
  creator?: string;
}

export interface ListNFTData {
  nftId: number;
  owner: string;
  wldPrice: number;
}

// Fetch all approved NFTs
export const fetchNFTs = async (): Promise<NFT[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nfts`);
    const result: ApiResponse<NFT[]> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
};

// Fetch single NFT by ID
export const fetchNFT = async (id: number): Promise<NFT | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nfts/${id}`);
    const result: ApiResponse<NFT> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching NFT:', error);
    return null;
  }
};

// Fetch NFTs by owner address
export const fetchNFTsByOwner = async (address: string): Promise<NFT[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nfts/owner/${address}`);
    const result: ApiResponse<NFT[]> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching owner NFTs:', error);
    return [];
  }
};

// Mint a new NFT
export const mintNFT = async (data: MintNFTData): Promise<NFT | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nfts/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result: ApiResponse<NFT> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.error || 'Failed to mint NFT');
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};

// List an NFT on marketplace
export const listNFT = async (data: ListNFTData): Promise<NFT | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nfts/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result: ApiResponse<NFT> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.error || 'Failed to list NFT');
  } catch (error) {
    console.error('Error listing NFT:', error);
    throw error;
  }
};

// Get marketplace statistics
export const fetchStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};

// Admin functions
export const fetchPendingNFTs = async (adminPassword: string): Promise<NFT[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/pending`, {
      headers: {
        'Authorization': `Bearer ${adminPassword}`,
      },
    });
    const result: ApiResponse<NFT[]> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching pending NFTs:', error);
    return [];
  }
};

export const approveNFT = async (id: number, adminPassword: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/approve/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminPassword}`,
      },
    });
    const result: ApiResponse<NFT> = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('Error approving NFT:', error);
    return false;
  }
};

export const deleteNFT = async (id: number, adminPassword: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/nfts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminPassword}`,
      },
    });
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('Error deleting NFT:', error);
    return false;
  }
};

export const updateNFT = async (
  id: number,
  updates: Partial<NFT>,
  adminPassword: string
): Promise<NFT | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/nfts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminPassword}`,
      },
      body: JSON.stringify(updates),
    });
    const result: ApiResponse<NFT> = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Error updating NFT:', error);
    return null;
  }
};

