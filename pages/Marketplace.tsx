import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NftCard from '../components/NftCard';
import { useAppContext } from '../State';
import { isOwnerAddress } from '../src/utils/constants';

const Marketplace: React.FC = () => {
    const { nfts, approveNft, pendingNFTs, refreshPendingNFTs, walletAddress } = useAppContext();
    const [filter, setFilter] = useState<'all' | 'GHOSTART' | 'UserGen'>('all');
    const [sort, setSort] = useState<'price_asc' | 'price_desc'>('price_desc');
    const [airdropClaimed, setAirdropClaimed] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.hash.split('?')[1]);
        if (queryParams.get('admin') === 'true') {
            setIsAdmin(true);
        }
        // Check if wallet is admin
        if (isOwnerAddress(walletAddress)) {
            setIsAdmin(true);
        }
    }, [walletAddress]);

    useEffect(() => {
        if (isAdmin && adminPassword) {
            refreshPendingNFTs(adminPassword);
        }
    }, [isAdmin, adminPassword]);

    const handleClaimAirdrop = () => {
        alert("Congratulations! You've claimed a special 'Genesis Ghost' NFT. It has been added to your wallet.");
        setAirdropClaimed(true);
    };

    const handleApprove = async (nftId: number) => {
        if (!adminPassword) {
            const password = prompt('Enter admin password:');
            if (!password) return;
            setAdminPassword(password);
            await approveNft(nftId, password);
        } else {
            await approveNft(nftId, adminPassword);
        }
    };
    
    const marketplaceNfts = useMemo(() => {
        return nfts.filter(nft => nft.approved && nft.listed && nft.owner === null);
    }, [nfts]);

    const filteredAndSortedNfts = useMemo(() => {
        let nftsToDisplay = [...marketplaceNfts];

        if (filter !== 'all') {
            nftsToDisplay = nftsToDisplay.filter(nft => nft.creator === filter);
        }

        nftsToDisplay.sort((a, b) => {
            if (sort === 'price_asc') {
                return a.wldPrice - b.wldPrice;
            }
            return b.wldPrice - a.wldPrice;
        });

        return nftsToDisplay;
    }, [filter, sort, marketplaceNfts]);


  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <img src="/ghostart-icon.png" alt="GHOSTART icon" className="w-12 h-12 rounded-lg shadow-md shadow-brand-pink/30" />
          <h1 className="text-3xl font-bold">Marketplace</h1>
        </div>
        <button
          onClick={handleClaimAirdrop}
          disabled={airdropClaimed}
          className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {airdropClaimed ? 'Airdrop Claimed' : 'Claim Airdrop'}
        </button>
      </header>
      
      {isAdmin && (
            <div className="my-8 p-4 bg-gray-800 rounded-lg border border-yellow-500">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">Admin Panel - Pending Approvals</h2>
                {!adminPassword && (
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Enter admin password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="bg-gray-700 text-white px-3 py-2 rounded-md w-full mb-2"
                        />
                        <button
                            onClick={() => refreshPendingNFTs(adminPassword)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md text-sm"
                        >
                            Load Pending
                        </button>
                    </div>
                )}
                {pendingNFTs.length > 0 ? (
                    <div className="space-y-3">
                        {pendingNFTs.map(nft => (
                            <div key={nft.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                                <div className="flex items-center gap-4">
                                    <img src={nft.image} alt={nft.name} className="w-10 h-10 rounded-md object-cover" />
                                    <div>
                                        <p className="font-semibold">{nft.name}</p>
                                        <p className="text-xs text-gray-400">by {nft.creator}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleApprove(nft.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-sm"
                                >
                                    Approve
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">No NFTs pending approval.</p>
                )}
            </div>
        )}

      <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div>
              <label className="text-xs text-gray-400">Filter by Creator</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md p-2 w-full text-white">
                  <option value="all">All</option>
                  <option value="GHOSTART">GHOSTART</option>
                  <option value="UserGen">User Creations</option>
              </select>
          </div>
          <div>
              <label className="text-xs text-gray-400">Sort by Price</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="bg-gray-800 border border-gray-700 rounded-md p-2 w-full text-white">
                  <option value="price_desc">Highest</option>
                  <option value="price_asc">Lowest</option>
              </select>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredAndSortedNfts.map(nft => (
          <div key={nft.id} className="block">
            <NftCard nft={nft} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;