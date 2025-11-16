import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Nft } from '../types';
import { useAppContext } from '../State';

interface NftCardProps {
  nft: Nft;
}

const RarityBadge: React.FC<{ rarity: Nft['rarity'] }> = ({ rarity }) => {
  const rarityClasses = {
    Common: 'bg-gray-600 text-white',
    Rare: 'bg-blue-700 text-white',
    Epic: 'bg-purple-700 text-white',
    Legendary: 'bg-amber-500 text-black',
  };
  return (
    <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${rarityClasses[rarity]}`}>
      {rarity}
    </span>
  );
};


const NftCard: React.FC<NftCardProps> = ({ nft }) => {
    const { buyNft } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const formatGhoPrice = (wldPrice: number) => {
        const value = wldPrice / 0.000009;
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
        return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
    };
    
    const ghoStartPrice = formatGhoPrice(nft.wldPrice);

    const handleBuyClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPurchaseStatus('idle');
        setIsPurchasing(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleCloseModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen, handleCloseModal]);


    const handleConfirmPurchase = async () => {
        setIsPurchasing(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction time
        
        try {
            buyNft(nft.id);
            setPurchaseStatus('success');
        } catch (error) {
            console.error("Purchase failed:", error);
            setPurchaseStatus('error');
        }

        setIsPurchasing(false);
    };

    const handleShare = (e: React.MouseEvent, platform: 'twitter' | 'facebook') => {
        e.preventDefault();
        e.stopPropagation();

        const nftUrl = `${window.location.href.split('#')[0]}#/marketplace/${nft.id}`;
        const text = `Check out this awesome NFT, "${nft.name}", on GHOSTART! #GHOSTART #NFT`;

        let shareUrl = '';

        if (platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(nftUrl)}&text=${encodeURIComponent(text)}`;
        } else if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(nftUrl)}`;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
        }
    };

    return (
        <>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 border border-gray-700 relative group h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 <Link to={`/marketplace/${nft.id}`} aria-label={`View details for ${nft.name}`} className="block">
                    <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" loading="lazy" />
                </Link>
                <RarityBadge rarity={nft.rarity} />
                <div className="p-4 relative flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-white truncate">{nft.name}</h3>
                    <p className="text-sm text-gray-400">by {nft.creator}</p>
                    <div className="mt-4 flex-grow flex flex-col justify-end">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-brand-blue">Price</p>
                                <p className="text-md font-semibold text-white">{nft.wldPrice} WLD</p>
                                <p className="text-xs text-gray-400">~{ghoStartPrice} GHOSTART</p>
                            </div>
                            <div className="flex items-center gap-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                                <button
                                    onClick={(e) => handleShare(e, 'twitter')}
                                    className="text-gray-400 hover:text-white"
                                    aria-label="Share on Twitter"
                                    title="Share on Twitter"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                                </button>
                                <button
                                    onClick={(e) => handleShare(e, 'facebook')}
                                    className="text-gray-400 hover:text-white"
                                    aria-label="Share on Facebook"
                                    title="Share on Facebook"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                                </button>
                                <button
                                    onClick={handleBuyClick}
                                    className="bg-brand-purple hover:bg-brand-pink text-white font-bold py-1 px-3 rounded-md text-sm"
                                    aria-label={`Buy ${nft.name}`}
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
                    <div role="dialog" aria-modal="true" aria-labelledby="modal-heading" className="bg-gray-800 rounded-lg p-6 w-full max-w-sm text-center shadow-lg border border-gray-700">
                        {isPurchasing ? (
                            <div role="alert">
                                <h2 id="modal-heading" className="text-2xl font-bold mb-4">Processing...</h2>
                                <div className="flex justify-center items-center my-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                                </div>
                                <p className="text-gray-300">Confirming transaction on World Chain.</p>
                            </div>
                        ) : purchaseStatus === 'success' ? (
                            <div role="alert">
                                <h2 id="modal-heading" className="text-2xl font-bold mb-4 text-green-400">Success!</h2>
                                <p className="text-gray-300 mb-4">{nft.name} has been added to your wallet.</p>
                                <button onClick={handleCloseModal} className="w-full px-6 py-2 rounded-lg bg-brand-purple hover:bg-brand-pink transition-colors">Close</button>
                            </div>
                        ) : purchaseStatus === 'error' ? (
                            <div role="alert">
                                <h2 id="modal-heading" className="text-2xl font-bold mb-4 text-red-400">Error</h2>
                                <p className="text-gray-300 mb-4">The transaction failed. Please try again.</p>
                                <button onClick={handleCloseModal} className="w-full px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">Close</button>
                            </div>
                        ) : (
                            <div>
                                <h2 id="modal-heading" className="text-2xl font-bold mb-4">Confirm Purchase</h2>
                                <p className="text-gray-300 mb-2">You are about to purchase:</p>
                                <p className="font-semibold text-lg mb-4 text-white">{nft.name}</p>
                                <div className="bg-gray-700 p-3 rounded-lg mb-6">
                                    <p className="text-sm text-gray-400">Price</p>
                                    <p className="text-xl font-bold text-white">{nft.wldPrice} WLD</p>
                                </div>
                                <div className="flex justify-around gap-4">
                                    <button onClick={handleCloseModal} className="w-full px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
                                    <button onClick={handleConfirmPurchase} className="w-full px-6 py-2 rounded-lg bg-brand-purple hover:bg-brand-pink transition-colors">Confirm</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default NftCard;