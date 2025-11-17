// Wallet connection utilities for GHOSTART
// Prioritizes World ID Wallet, then falls back to MetaMask

import { ethers } from 'ethers';
import { WORLD_CHAIN_ID, WORLD_CHAIN_ID_HEX, WORLD_CHAIN_RPC } from './constants';

export interface WalletConnection {
  address: string;
  provider: ethers.BrowserProvider | null;
  isWorldWallet: boolean;
}

/**
 * Check if running in World App (MiniKit environment)
 */
export const isWorldApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if MiniKit is installed and available
  if (typeof window.MiniKit !== 'undefined' && window.MiniKit.isInstalled) {
    try {
      return window.MiniKit.isInstalled();
    } catch (e) {
      // Fallback checks
    }
  }
  
  // Fallback detection methods
  return window.location.href.includes('worldapp://') || 
         typeof window.MiniKit !== 'undefined' ||
         navigator.userAgent.includes('WorldApp') ||
         navigator.userAgent.includes('MiniKit');
};

/**
 * Connect to World ID Wallet (MiniKit)
 */
export const connectWorldWallet = async (): Promise<WalletConnection> => {
  try {
    // Check if MiniKit is available and installed
    if (typeof window.MiniKit !== 'undefined') {
      // Check if MiniKit is installed (only true in World App)
      const isInstalled = window.MiniKit.isInstalled ? window.MiniKit.isInstalled() : false;
      
      if (isInstalled && window.MiniKit.actions) {
        // Try to get existing address first
        let address = await window.MiniKit.actions.getAddress();
        
        // If no address, try to connect
        if (!address) {
          const result = await window.MiniKit.actions.connect();
          address = result?.address || null;
        }
        
        if (address) {
          // Create provider for World Chain
          const provider = new ethers.JsonRpcProvider(WORLD_CHAIN_RPC);
          return {
            address,
            provider: null, // World Wallet uses RPC provider, not BrowserProvider
            isWorldWallet: true,
          };
        }
      }
    }
    
    // If not in World App, throw error to fallback to MetaMask
    throw new Error('World Wallet is only available in World App. Please use MetaMask or open this app in World App.');
  } catch (error: any) {
    console.error('World Wallet connection error:', error);
    throw error;
  }
};

/**
 * Connect to MetaMask
 */
export const connectMetaMask = async (): Promise<WalletConnection> => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  try {
    // Convert window.ethereum to Eip1193Provider for ethers
    const eipProvider = window.ethereum as ethers.Eip1193Provider;
    const provider = new ethers.BrowserProvider(eipProvider);
    
    // Request account access
    const accounts = await provider.send('eth_requestAccounts', []);
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Check and switch to World Chain if needed
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== WORLD_CHAIN_ID) {
      await switchToWorldChain();
      // Reload provider after chain switch
      const newProvider = new ethers.BrowserProvider(eipProvider);
      return {
        address: accounts[0],
        provider: newProvider,
        isWorldWallet: false,
      };
    }

    return {
      address: accounts[0],
      provider,
      isWorldWallet: false,
    };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected the connection request');
    }
    throw new Error(error.message || 'Failed to connect to MetaMask');
  }
};

/**
 * Switch to World Chain
 */
export const switchToWorldChain = async (): Promise<boolean> => {
  if (typeof window.ethereum === 'undefined') return false;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: WORLD_CHAIN_ID_HEX }],
    });
    return true;
  } catch (switchError: any) {
    // Chain doesn't exist, need to add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum!.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: WORLD_CHAIN_ID_HEX,
            chainName: 'World Chain',
            nativeCurrency: {
              name: 'WLD',
              symbol: 'WLD',
              decimals: 18,
            },
            rpcUrls: [WORLD_CHAIN_RPC],
            blockExplorerUrls: ['https://worldscan.org'],
          }],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add World Chain:', addError);
        throw new Error('Failed to add World Chain to wallet');
      }
    }
    throw switchError;
  }
};

/**
 * Smart wallet connection - tries World Wallet first, then MetaMask
 */
export const connectWallet = async (): Promise<WalletConnection> => {
  // First, try World ID Wallet
  if (isWorldApp()) {
    try {
      return await connectWorldWallet();
    } catch (error) {
      console.log('World Wallet not available, trying MetaMask...');
    }
  }

  // Fallback to MetaMask
  try {
    return await connectMetaMask();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect wallet');
  }
};

/**
 * Get current connected wallet address
 */
export const getCurrentWallet = async (): Promise<string | null> => {
  // Try World Wallet first
  if (isWorldApp() && typeof window.MiniKit !== 'undefined' && window.MiniKit.actions) {
    try {
      const address = await window.MiniKit.actions.getAddress();
      if (address) return address;
    } catch (error) {
      console.log('World Wallet not connected');
    }
  }

  // Try MetaMask
  if (typeof window.ethereum !== 'undefined') {
    try {
      const eipProvider = window.ethereum as ethers.Eip1193Provider;
      const provider = new ethers.BrowserProvider(eipProvider);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        return accounts[0].address;
      }
    } catch (error) {
      console.log('MetaMask not connected');
    }
  }

  return null;
};

/**
 * Disconnect wallet
 */
export const disconnectWallet = (): void => {
  // Clear any stored wallet state
  // Note: Actual disconnection depends on wallet implementation
  if (typeof window !== 'undefined') {
    // Clear local storage if needed
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletType');
  }
};

