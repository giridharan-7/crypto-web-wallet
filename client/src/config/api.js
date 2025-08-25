// Get current network from localStorage
const getCurrentNetwork = () => {
  return localStorage.getItem('network') || 'testnet';
};

// API Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  INFURA_PROJECT_ID: import.meta.env.VITE_INFURA_PROJECT_ID || 'f1eacd24f5a44535a14fc93a91e380a8',
  SEPOLIA_FAUCET_URL: import.meta.env.VITE_SEPOLIA_FAUCET_URL || 'https://faucet.sepolia.dev/',
};

// Network configurations
export const NETWORK_CONFIG = {
  testnet: {
    solana: {
      cluster: 'devnet',
      name: 'Solana Devnet'
    },
    ethereum: {
      rpc: `https://sepolia.infura.io/v3/${API_CONFIG.INFURA_PROJECT_ID}`,
      name: 'Ethereum Sepolia',
      chainId: 11155111
    }
  },
  mainnet: {
    solana: {
      cluster: 'mainnet-beta',
      name: 'Solana Mainnet'
    },
    ethereum: {
      rpc: `https://mainnet.infura.io/v3/${API_CONFIG.INFURA_PROJECT_ID}`,
      name: 'Ethereum Mainnet',
      chainId: 1
    }
  }
};

// Dynamic API endpoints based on current network
export const getEndpoints = () => {
  const network = getCurrentNetwork();
  const config = NETWORK_CONFIG[network];
  
  return {
    AUTH: {
      LOGIN: `${API_CONFIG.BASE_URL}/api/auth/login`,
      REGISTER: `${API_CONFIG.BASE_URL}/api/auth/register`,
    },
    DASHBOARD: `${API_CONFIG.BASE_URL}/api/dashboard`,
    ETHEREUM_RPC: config.ethereum.rpc,
    SEPOLIA_FAUCET: API_CONFIG.SEPOLIA_FAUCET_URL,
    SOLANA_CLUSTER: config.solana.cluster,
  };
};

// Static endpoints for backward compatibility
export const ENDPOINTS = getEndpoints();

export { getCurrentNetwork };
export default API_CONFIG;
