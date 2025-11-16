// GHOSTART Constants
// Owner/Admin Configuration

/**
 * Owner World Chain Wallet Address
 * This address has admin privileges for approving NFTs, editing, and removing them
 */
export const OWNER_WALLET_ADDRESS = '0x32f1e35291967c07ec02aa81394dbf87d1d25e52';

/**
 * Creator Wallet Address (for royalties)
 */
export const CREATOR_WALLET = '0x32f1e35291967c07ec02aa81394dbf87d1d25e52';

/**
 * Creator Royalty Percentage
 */
export const CREATOR_ROYALTY = 10;

/**
 * Token Contract Addresses (World Chain)
 */
export const GHOSTART_TOKEN_ADDRESS = '0x4df029e25EA0043fCb7A7f15f2b25F62C9BDb990';
export const WLD_TOKEN_ADDRESS = '0x163f8C2467924be0ae7B5347228CABF260318753';

/**
 * Staking Contract Address
 */
export const STAKING_ADDRESS = '0x32f1e35291967c07ec02aa81394dbf87d1d25e52';

/**
 * World Chain Configuration
 */
export const WORLD_CHAIN_ID = 480;
export const WORLD_CHAIN_ID_HEX = '0x1e0';
export const WORLD_CHAIN_RPC = 'https://worldchain-mainnet.g.alchemy.com/public';

/**
 * Token Exchange Rate
 */
export const WLD_TO_GHOSTART_RATE = 0.000009; // 1 WLD = 0.000009 GHOSTART

/**
 * Staking Configuration
 */
export const STAKING_APY = 18; // 18% APY
export const STAKING_LOCK_PERIOD_DAYS = 180; // 180 days lock period

/**
 * Check if an address is the owner/admin address
 */
export const isOwnerAddress = (address: string | null | undefined): boolean => {
  if (!address) return false;
  return address.toLowerCase() === OWNER_WALLET_ADDRESS.toLowerCase();
};

