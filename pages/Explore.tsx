import React from 'react';

const Explore: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 pt-8">
      <header className="text-center mb-8 animate-fade-in-down">
        <img src="1.png" alt="GHOSTART Logo" className="w-32 h-32 mx-auto mb-4 rounded-2xl shadow-lg shadow-brand-pink/50" />
        <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue">
          GHOSTART
        </h1>
        <p className="text-gray-400 mt-2">The Phantom Realm of Digital Art & Tokens</p>
      </header>

      <div className="bg-gray-900/50 rounded-2xl p-6 mb-8 border border-gray-700 backdrop-blur-sm animate-fade-in">
        <img 
          src="https://picsum.photos/seed/ghostartbanner/600/300" 
          alt="GHOSTART Banner" 
          className="w-full h-48 object-cover rounded-lg mb-6"
        />
        <h2 className="text-2xl font-bold mb-2">Early Access Trading is Live!</h2>
        <p className="text-gray-300 mb-4">
          Be among the first to trade $GHOSTART tokens. Available for a limited time on the PUF mini app.
        </p>

        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between mb-6">
          <div className="font-mono">
            <span className="text-lg font-bold text-white">1 WLD</span>
            <span className="text-gray-400 mx-2">=</span>
            <span className="text-lg font-bold text-brand-blue">0.000009 GHOSTART</span>
          </div>
          <a
            href="https://worldcoin.org/mini-app?app_id=app_15daccf5b7d4ec9b7dbba044a8fdeab5&path=app/token/0x4df029e25EA0043fCb7A7f15f2b25F62C9BDb990"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-purple hover:bg-brand-pink text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Trade Now
          </a>
        </div>
        <p className="text-xs text-center text-gray-500">
          Token Address: <span className="font-mono break-all">0x4df0...b990</span>
        </p>
      </div>

      <div className="animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4">Featured Collections</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="aspect-square bg-gray-800 rounded-lg p-2">
            <img src="https://picsum.photos/seed/ghostrider/200" className="w-full h-full object-cover rounded-md" alt="Ghost Riders" />
            <p className="text-center text-sm mt-1 font-semibold">Ghost Riders</p>
          </div>
           <div className="aspect-square bg-gray-800 rounded-lg p-2">
            <img src="https://picsum.photos/seed/flamingskull/200" className="w-full h-full object-cover rounded-md" alt="Flaming Skulls" />
            <p className="text-center text-sm mt-1 font-semibold">Flaming Skulls</p>
          </div>
           <div className="aspect-square bg-gray-800 rounded-lg p-2">
            <img src="https://picsum.photos/seed/alienpunk/200" className="w-full h-full object-cover rounded-md" alt="Alien Punks" />
            <p className="text-center text-sm mt-1 font-semibold">Alien Punks</p>
          </div>
           <div className="aspect-square bg-gray-800 rounded-lg p-2">
            <img src="https://picsum.photos/seed/glitchspirit/200" className="w-full h-full object-cover rounded-md" alt="Glitch Spirits" />
            <p className="text-center text-sm mt-1 font-semibold">Glitch Spirits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;