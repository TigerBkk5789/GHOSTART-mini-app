
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Nft } from './types';
import { fetchNFTs, mintNFT, listNFT, approveNFT as approveNFTApi, fetchPendingNFTs } from './src/utils/api';

interface AppContextType {
    nfts: Nft[];
    mintNft: (nftData: Omit<Nft, 'id' | 'approved' | 'owner' | 'wldPrice'>, addr?: string) => Promise<void>;
    approveNft: (nftId: number, adminPassword?: string) => Promise<void>;
    buyNft: (nftId: number, addr?: string) => void;
    listNft: (nftId: number, price: number, owner: string) => Promise<void>;
    walletAddress: string | null;
    setWalletAddress: (address: string | null) => void;
    refreshNFTs: () => Promise<void>;
    pendingNFTs: Nft[];
    refreshPendingNFTs: (adminPassword: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nfts, setNfts] = useState<Nft[]>([]);
    const [pendingNFTs, setPendingNFTs] = useState<Nft[]>([]);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const refreshNFTs = async () => {
        try {
            const fetchedNFTs = await fetchNFTs();
            setNfts(fetchedNFTs);
        } catch (error) {
            console.error('Error refreshing NFTs:', error);
        }
    };

    const refreshPendingNFTs = async (adminPassword: string) => {
        try {
            const pending = await fetchPendingNFTs(adminPassword);
            setPendingNFTs(pending);
        } catch (error) {
            console.error('Error refreshing pending NFTs:', error);
        }
    };

    useEffect(() => {
        refreshNFTs();
    }, []);

    const mintNft = async (nftData: Omit<Nft, 'id' | 'approved' | 'owner' | 'wldPrice'>, addr = walletAddress || '') => {
        if (!addr) {
            throw new Error('Wallet address required');
        }
        try {
            const wldPrice = parseFloat((Math.random() * 10 + 1).toFixed(1));
            await mintNFT({
                name: nftData.name,
                image: nftData.image,
                wldPrice,
                rarity: nftData.rarity || 'Common',
                traits: nftData.traits || [],
                owner: addr,
                creator: nftData.creator || 'User',
            });
            await refreshNFTs();
        } catch (error) {
            console.error('Error minting NFT:', error);
            throw error;
        }
    };

    const approveNft = async (nftId: number, adminPassword?: string) => {
        if (!adminPassword) {
            adminPassword = prompt('Enter admin password:');
            if (!adminPassword) return;
        }
        try {
            await approveNFTApi(nftId, adminPassword);
            await refreshNFTs();
            await refreshPendingNFTs(adminPassword);
        } catch (error) {
            console.error('Error approving NFT:', error);
            throw error;
        }
    };
    
    const buyNft = (nftId: number, addr = walletAddress || '') => {
        // This would trigger a blockchain transaction in production
        setNfts(prevNfts => prevNfts.map(nft =>
            nft.id === nftId ? { ...nft, owner: addr } : nft
        ));
    };

    const listNft = async (nftId: number, price: number, owner: string) => {
        try {
            await listNFT({ nftId, owner, wldPrice: price });
            await refreshNFTs();
        } catch (error) {
            console.error('Error listing NFT:', error);
            throw error;
        }
    };

    return (
        <AppContext.Provider value={{ 
            nfts, 
            mintNft, 
            approveNft, 
            buyNft, 
            listNft, 
            walletAddress, 
            setWalletAddress,
            refreshNFTs,
            pendingNFTs,
            refreshPendingNFTs,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
