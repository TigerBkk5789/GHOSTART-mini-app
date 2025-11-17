
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { AppProvider } from './State';
import Explore from './pages/Explore';
import Mint from './pages/Mint';
import Marketplace from './pages/Marketplace';
import Wallet from './pages/Wallet';
import FooterNav from './components/FooterNav';
import NftDetail from './pages/NftDetail';

const App: React.FC = () => {
  return (
    <MiniKitProvider>
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col h-screen font-sans">
          <main className="flex-grow overflow-y-auto pb-20 bg-black">
            <Routes>
              <Route path="/explore" element={<Explore />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/:nftId" element={<NftDetail />} />
              <Route path="/mint" element={<Mint />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="*" element={<Navigate to="/explore" replace />} />
            </Routes>
          </main>
          <FooterNav />
        </div>
      </HashRouter>
    </AppProvider>
    </MiniKitProvider>
  );
};

export default App;
