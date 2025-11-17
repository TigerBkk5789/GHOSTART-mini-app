// Type declarations for window.ethereum and MiniKit

interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    send?: (method: string, params?: any[]) => Promise<any>;
  };
  MiniKit?: {
    isInstalled: () => boolean;
    actions: {
      connect: () => Promise<{ address: string }>;
      getAddress: () => Promise<string | null>;
    };
    user?: {
      username?: string;
      profilePictureUrl?: string;
    };
  };
}

