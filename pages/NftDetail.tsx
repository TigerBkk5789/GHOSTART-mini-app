import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Nft } from '../types';

// In a real app, this data would be fetched from an API or shared context
// Fix: Added the missing 'approved' property to each mock NFT object to match the Nft type.
const mockNfts: Nft[] = [
  { id: 1, name: 'Ghost Rider #1', creator: 'GHOSTART', image: 'https://picsum.photos/seed/nft1/300', wldPrice: 2.5, rarity: 'Rare', traits: ['Red Eyes', 'Fire Chain'], owner: null, approved: true },
  { id: 2, name: 'Flaming Skull #42', creator: 'GHOSTART', image: 'https://picsum.photos/seed/nft2/300', wldPrice: 5.0, rarity: 'Epic', traits: ['Glowing', 'Ancient'], owner: null, approved: true },
  { id: 3, name: 'Alien Punk #88', creator: 'GHOSTART', image: 'https://picsum.photos/seed/nft3/300', wldPrice: 10.0, rarity: 'Legendary', traits: ['Holographic', 'Rare'], owner: null, approved: true },
  { id: 4, name: 'Glitch Spirit #7', creator: 'GHOSTART', image: 'https://picsum.photos/seed/nft4/300', wldPrice: 3.2, rarity: 'Rare', traits: ['Shimmer', 'Ethereal'], owner: null, approved: true },
  { id: 5, name: 'Spectral Steed', creator: 'GHOSTART', image: 'https://picsum.photos/seed/nft5/300', wldPrice: 1.8, rarity: 'Common', traits: ['Transparent', 'Fast'], owner: null, approved: true },
  { id: 6, name: 'Cosmic Ghoul', creator: 'GHOSTART', image: 'https://picsum.photos/seed/nft6/300', wldPrice: 7.5, rarity: 'Epic', traits: ['Nebula Skin', 'Star Eyes'], owner: null, approved: true },
  { id: 7, name: 'Cyber Phantom', creator: 'UserGen', image: 'https://picsum.photos/seed/nft7/300', wldPrice: 4.1, rarity: 'Rare', traits: ['Neon', 'Circuitry'], owner: null, approved: true },
  { id: 8, name: 'Void Walker', creator: 'GHOSTART', image: 'https://picsum.photos/seed/nft8/300', wldPrice: 15.0, rarity: 'Legendary', traits: ['Abyssal', 'Timeless'], owner: null, approved: true },
];

const RarityBadge: React.FC<{ rarity: Nft['rarity'] }> = ({ rarity }) => {
    const rarityClasses = {
      Common: 'bg-gray-500 text-white',
      Rare: 'bg-blue-500 text-white',
      Epic: 'bg-purple-600 text-white',
      Legendary: 'bg-amber-500 text-white',
    };
    return (
      <span className={`text-sm font-bold px-3 py-1 rounded-full ${rarityClasses[rarity]}`}>
        {rarity}
      </span>
    );
  };

const NftDetail: React.FC = () => {
    const { nftId } = useParams<{ nftId: string }>();
    const nft = mockNfts.find(n => n.id === Number(nftId));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleBuyClick = () => {
        setPurchaseStatus('idle');
        setIsPurchasing(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmPurchase = async () => {
        setIsPurchasing(true);
        await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate transaction time
        
        const isSuccess = Math.random() > 0.2; // 80% success rate
        setPurchaseStatus(isSuccess ? 'success' : 'error');
        setIsPurchasing(false);
    };

    if (!nft) {
        return (
            <div className="p-4 text-center min-h-screen flex flex-col justify-center">
                <h1 className="text-2xl font-bold">NFT not found</h1>
                <Link to="/marketplace" className="text-brand-blue hover:underline mt-4 inline-block">
                    &larr; Back to Marketplace
                </Link>
            </div>
        );
    }

    const ghoStartPrice = (nft.wldPrice / 0.000009).toLocaleString('en-US', { maximumFractionDigits: 0 });

    return (
        <>
            <div className="p-4">
                <Link to="/marketplace" className="text-gray-400 hover:text-white transition-colors mb-4 inline-block">
                    &larr; Back to Marketplace
                </Link>
                <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                        <img src={nft.image.replace('/300', '/600')} alt={nft.name} className="w-full h-auto object-cover rounded-2xl shadow-lg border border-gray-700" />
                    </div>
                    <div className="mt-6 md:mt-0">
                        <div className="flex justify-between items-start">
                            <h1 className="text-4xl font-bold">{nft.name}</h1>
                            <RarityBadge rarity={nft.rarity} />
                        </div>
                        <p className="text-lg text-gray-400 mt-1">by {nft.creator}</p>
                        
                        <div className="bg-gray-800 rounded-lg p-4 my-6 border border-gray-700">
                            <p className="text-sm text-brand-blue">Current Price</p>
                            <p className="text-3xl font-bold">{nft.wldPrice} WLD</p>
                            <p className="text-md text-gray-500">~ {ghoStartPrice} GHOSTART</p>
                        </div>

                        <button onClick={handleBuyClick} className="w-full bg-brand-purple hover:bg-brand-pink text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg">
                            Buy Now
                        </button>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-3">Traits</h2>
                            <div className="flex flex-wrap gap-2">
                                {nft.traits.map(trait => (
                                    <div key={trait} className="bg-gray-700 text-gray-200 text-sm font-medium px-3 py-1.5 rounded-lg">
                                        {trait}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-3">Transaction History</h2>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                               <p className="text-gray-500 text-center">No transaction history available.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm text-center shadow-lg border border-gray-700">
                        {isPurchasing ? (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Processing...</h2>
                                <div className="flex justify-center items-center my-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                                </div>
                                <p className="text-gray-300">Confirming transaction on World Chain.</p>
                            </div>
                        ) : purchaseStatus === 'success' ? (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-green-400">Success!</h2>
                                <p className="text-gray-300 mb-4">{nft.name} has been added to your wallet.</p>
                                <button onClick={handleCloseModal} className="w-full px-6 py-2 rounded-lg bg-brand-purple hover:bg-brand-pink transition-colors">Close</button>
                            </div>
                        ) : purchaseStatus === 'error' ? (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-red-400">Error</h2>
                                <p className="text-gray-300 mb-4">The transaction failed. Please try again.</p>
                                <button onClick={handleCloseModal} className="w-full px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">Close</button>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Confirm Purchase</h2>
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

export default NftDetail;