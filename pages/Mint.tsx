import React, { useState, useCallback } from 'react';
import { useAppContext } from '../State';

const Mint: React.FC = () => {
    const { mintNft } = useAppContext();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [nftName, setNftName] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [royalty, setRoyalty] = useState(10);
    const [isMinting, setIsMinting] = useState(false);
    const [mintStatus, setMintStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleMint = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imagePreview || !nftName) {
            alert("Please fill at least NFT Name and select an image.");
            return;
        }
        setIsMinting(true);
        setMintStatus('idle');
        
        try {
            await mintNft({
                name: nftName,
                image: imagePreview,
                rarity: 'Common',
                traits: collectionName ? [collectionName] : ['User Minted'],
                creator: 'UserGen',
            });
            setMintStatus('success');
            // Reset form
            setNftName('');
            setCollectionName('');
            setImagePreview(null);
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if(fileInput) fileInput.value = '';

        } catch (err: any) {
            console.error(err);
            setMintStatus('error');
            alert(err.message || 'Minting failed. Please try again.');
        }

        setIsMinting(false);
    }, [imagePreview, nftName, collectionName, mintNft]);

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="text-center mb-6">
                <img src="/ghostart-icon.png" alt="GHOSTART icon" className="w-20 h-20 mx-auto mb-3 rounded-2xl shadow-lg shadow-brand-purple/40" />
                <h1 className="text-3xl font-bold">Create Your NFT</h1>
            </div>

            <form onSubmit={handleMint}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">NFT Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="NFT Preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
                                ) : (
                                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8a4 4 0 01-4 4H28m0-18v8h8m-8-8l-8 8-4-4-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                <div className="flex text-sm text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-brand-blue hover:text-brand-pink focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-brand-purple px-1">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="nftName" className="block text-sm font-medium text-gray-300">NFT Name</label>
                        <input type="text" id="nftName" value={nftName} onChange={(e) => setNftName(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-white p-2" />
                    </div>

                    <div>
                        <label htmlFor="collectionName" className="block text-sm font-medium text-gray-300">Collection Name (Optional)</label>
                        <input type="text" id="collectionName" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-white p-2" />
                    </div>
                    
                    <div>
                        <label htmlFor="creatorName" className="block text-sm font-medium text-gray-300">Creator Name (You)</label>
                        <input type="text" id="creatorName" placeholder="UserGen" disabled className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-400 p-2 cursor-not-allowed" />
                    </div>

                    <div>
                        <label htmlFor="royalty" className="block text-sm font-medium text-gray-300">Creator Royalty ({royalty}%)</label>
                        <input type="range" id="royalty" min="0" max="10" step="1" value={royalty} onChange={(e) => setRoyalty(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-purple mt-2" />
                    </div>
                </div>

                <div className="mt-8">
                    <button type="submit" disabled={isMinting || !imagePreview || !nftName} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-purple disabled:bg-gray-600 disabled:cursor-not-allowed">
                        {isMinting ? 'Minting on World Chain...' : 'Mint & Submit for Listing'}
                    </button>
                </div>
                
                {mintStatus === 'success' && <p className="mt-4 text-center text-green-400">NFT minted successfully! It is now pending approval for the marketplace.</p>}
                {mintStatus === 'error' && <p className="mt-4 text-center text-red-400">Minting failed. Please try again later.</p>}
            </form>
        </div>
    );
};

export default Mint;