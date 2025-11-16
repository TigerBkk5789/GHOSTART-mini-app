
export interface Nft {
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
}

// Transaction type for transfers/swaps (stub)
export interface Transaction {
  id: number;
  type: 'swap' | 'send' | 'stake';
  from?: string;
  to?: string;
  token?: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
  hash: string;
}

// Wallet context type (stub)
export interface WalletContext {
  address: string;
  connected: boolean;
  chainId: number | null;
}
