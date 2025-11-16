
import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../State';
import { Nft } from '../types';
import { ethers } from 'ethers';
import { isOwnerAddress } from '../src/utils/constants';

const TabButton: React.FC<{
    tabName: string;
    label: string;
    isActive: boolean;
    onClick: (tabName: string) => void;
}> = ({ tabName, label, isActive, onClick }) => (
    <button
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${tabName}`}
        id={`tab-${tabName}`}
        onClick={() => onClick(tabName)}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-purple ${
            isActive ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
);


const Wallet: React.FC = () => {
    const { nfts, listNft, walletAddress: contextWalletAddress, refreshNFTs } = useAppContext();
    const [walletAddress, setWalletAddress] = useState<string | null>(contextWalletAddress || null);
    const [wldBalance, setWldBalance] = useState(0);
    const [ghoBalance, setGhoBalance] = useState(0);
    const [stakedAmount, setStakedAmount] = useState(0);
    const [stakeInput, setStakeInput] = useState('');
    const [activeTab, setActiveTab] = useState('nfts');

    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [listingNft, setListingNft] = useState<Nft | null>(null);
    const [listingPrice, setListingPrice] = useState('');

    const myNfts = useMemo(() => {
        if (!walletAddress) return [];
        return nfts.filter(nft => nft.owner && nft.owner.toLowerCase() === walletAddress.toLowerCase());
    }, [nfts, walletAddress]);

    useEffect(() => {
        if (walletAddress) {
            refreshNFTs();
        }
    }, [walletAddress, refreshNFTs]);

    useEffect(() => {
        const connectAndLoad = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                // Prompt connect if needed
                const accounts = await provider.send("eth_requestAccounts", []);
                setWalletAddress(accounts[0]);
                // Fetch GHOSTART balance
                const ghoContract = new ethers.Contract(
                    '0x4df029e25EA0043fCb7A7f15f2b25F62C9BDb990',
                    ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"],
                    provider
                );
                const rawGho = await ghoContract.balanceOf(accounts[0]);
                const decimals = await ghoContract.decimals();
                setGhoBalance(Number(ethers.formatUnits(rawGho, decimals)));
                // Fetch WLD balance (replace 0x163f8C24... with correct WLD address)
                const wldContract = new ethers.Contract(
                    '0x163f8C2467924be0ae7B5347228CABF260318753',
                    ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"],
                    provider
                );
                const rawWld = await wldContract.balanceOf(accounts[0]);
                const wldDecimals = await wldContract.decimals();
                setWldBalance(Number(ethers.formatUnits(rawWld, wldDecimals)));
            }
        };
        connectAndLoad();
        // Listen for account/network changes
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", connectAndLoad);
            window.ethereum.on("chainChanged", () => window.location.reload());
            return () => {
                window.ethereum.removeListener("accountsChanged", connectAndLoad);
            };
        }
    }, []);

    const handleStake = () => {
        const amount = parseFloat(stakeInput);
        if (isNaN(amount) || amount <= 0 || amount > ghoBalance) {
            alert("Invalid stake amount.");
            return;
        }
        // setGhoBalance(prev => prev - amount); // This line is removed as per new_code
        // setStakedAmount(prev => prev + amount); // This line is removed as per new_code
        setStakeInput('');
        alert(`${amount.toLocaleString()} GHOSTART staked successfully!`);
    };

    const handleOpenListModal = (nft: Nft) => {
        setListingNft(nft);
        setListingPrice(nft.wldPrice.toString());
        setIsListModalOpen(true);
    };

    const handleCloseListModal = () => {
        setIsListModalOpen(false);
        setListingNft(null);
        setListingPrice('');
    };

    const handleConfirmListing = async () => {
        if (!listingNft || !listingPrice || !walletAddress) return;
        const price = parseFloat(listingPrice);
        if (isNaN(price) || price <= 0) {
            alert('Please enter a valid price.');
            return;
        }
        try {
            await listNft(listingNft.id, price, walletAddress);
            handleCloseListModal();
            alert(`${listingNft.name} has been listed on the marketplace!`);
        } catch (error: any) {
            alert(error.message || 'Failed to list NFT');
        }
    };

    if (!walletAddress) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 text-center">
                <div className="text-center mb-6">
                    <img src="1.png" alt="GHOSTART icon" className="w-24 h-24 mx-auto mb-4 rounded-2xl shadow-lg shadow-brand-purple/40" />
                    <h1 className="text-3xl font-bold">Connect Wallet</h1>
                </div>
                <p className="text-gray-400 mb-8 max-w-sm">
                    Choose your preferred wallet to manage your NFTs and $GHOSTART tokens.
                </p>

                <div className="w-full max-w-xs space-y-4">
                    <button
                        onClick={() => {
                            if (window.ethereum) {
                                window.ethereum.request({ method: "eth_requestAccounts" }).then(accounts => {
                                    setWalletAddress(accounts[0]);
                                }).catch(err => {
                                    console.error("User denied account access or error occurred", err);
                                });
                            } else {
                                alert("MetaMask is not installed. Please install it.");
                            }
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Connect World App</span>
                    </button>
                    <button
                        onClick={() => {
                            if (window.ethereum) {
                                window.ethereum.request({ method: "eth_requestAccounts" }).then(accounts => {
                                    setWalletAddress(accounts[0]);
                                }).catch(err => {
                                    console.error("User denied account access or error occurred", err);
                                });
                            } else {
                                alert("MetaMask is not installed. Please install it.");
                            }
                        }}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Connect MetaMask</span>
                    </button>
                </div>
            </div>
        );
    }
    
    const yearlyReward = stakedAmount * 0.18;

    return (
        <>
            <div className="p-4 space-y-6">
                <div className="flex items-center gap-4">
                    <img src="1.png" alt="GHOSTART icon" className="w-12 h-12 rounded-lg shadow-md shadow-brand-pink/30" />
                    <div>
                        <h1 className="text-3xl font-bold">My Wallet {isOwnerAddress(walletAddress) && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-yellow-500 text-black align-super">ADMIN</span>}</h1>
                        <p className="text-gray-400 text-xs font-mono break-all">{walletAddress}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div role="tablist" aria-label="Wallet sections" className="flex space-x-2 bg-gray-900 p-1 rounded-lg border border-gray-700">
                    <TabButton tabName="tokens" label="Tokens" isActive={activeTab === 'tokens'} onClick={setActiveTab} />
                    <TabButton tabName="staking" label="Staking" isActive={activeTab === 'staking'} onClick={setActiveTab} />
                    <TabButton tabName="nfts" label={`My NFTs (${myNfts.length})`} isActive={activeTab === 'nfts'} onClick={setActiveTab} />
                </div>
                
                <div className="mt-4">
                    <div id="tabpanel-tokens" role="tabpanel" aria-labelledby="tab-tokens" hidden={activeTab !== 'tokens'}>
                        <div className="grid grid-cols-2 gap-4 animate-fade-in">
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <p className="text-sm text-gray-400">WLD Balance</p>
                                <p className="text-2xl font-bold">{wldBalance.toFixed(4)}</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <p className="text-sm text-gray-400">$GHOSTART Balance</p>
                                <p className="text-2xl font-bold">{ghoBalance.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="tabpanel-staking" role="tabpanel" aria-labelledby="tab-staking" hidden={activeTab !== 'staking'}>
                         <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 animate-fade-in">
                            <h2 className="text-xl font-bold mb-4">Stake $GHOSTART</h2>
                            <div className="text-center bg-gray-900 p-4 rounded-lg mb-4">
                                <p className="text-sm text-gray-400">Currently Staked</p>
                                <p className="text-3xl font-bold text-brand-blue">{stakedAmount.toLocaleString()}</p>
                                <p className="text-sm text-green-400">~{yearlyReward.toLocaleString()} yearly reward (18% APY)</p>
                                <p className="text-xs text-gray-500 mt-1">Locked for 180 days</p>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <input 
                                        type="number"
                                        placeholder="Amount to stake"
                                        value={stakeInput}
                                        onChange={(e) => setStakeInput(e.target.value)}
                                        className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white placeholder-gray-400"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Available: {ghoBalance.toLocaleString()} GHOSTART</p>
                                </div>
                                <button onClick={handleStake} className="w-full bg-brand-purple hover:bg-brand-pink text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                                    Stake Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {activeTab === 'nfts' && (
                        <div id="tabpanel-nfts" role="tabpanel" aria-labelledby="tab-nfts" hidden={activeTab !== 'nfts'}>
                            <div className="animate-fade-in">
                                {myNfts.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {myNfts.map(nft => (
                                            <div key={nft.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col">
                                                <img src={nft.image} alt={nft.name} className="w-full h-32 object-cover" />
                                                <div className="p-2 flex-grow flex flex-col">
                                                    <p className="text-sm font-semibold p-1 truncate flex-grow">{nft.name}</p>
                                                    {isOwnerAddress(walletAddress) && (
                                                        <button 
                                                            onClick={() => handleOpenListModal(nft)}
                                                            className="mt-2 w-full bg-brand-blue hover:bg-brand-pink text-white font-bold py-1 px-2 rounded-md text-xs transition-colors"
                                                        >
                                                            List NFT
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
                                        <p className="text-gray-400">You don't own any NFTs yet.</p>
                                        <p className="text-sm text-gray-500 mt-2">Go to the marketplace to start your collection!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isListModalOpen && listingNft && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm text-center shadow-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4">List NFT for Sale</h2>
                        <img src={listingNft.image} alt={listingNft.name} className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"/>
                        <p className="font-semibold text-lg mb-4 text-white">{listingNft.name}</p>

                        <div className="mb-6">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 text-left mb-1">Set Price (WLD)</label>
                            <input
                                type="number"
                                id="price"
                                value={listingPrice}
                                onChange={(e) => setListingPrice(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-white p-2"
                                placeholder="e.g., 5.0"
                            />
                        </div>

                        <div className="flex justify-around gap-4">
                            <button onClick={handleCloseListModal} className="w-full px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
                            <button onClick={handleConfirmListing} className="w-full px-6 py-2 rounded-lg bg-brand-purple hover:bg-brand-pink transition-colors">Confirm Listing</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Wallet;
