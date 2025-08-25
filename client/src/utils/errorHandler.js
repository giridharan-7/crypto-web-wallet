import { toast } from 'react-toastify';

export const handleApiError = (error, customMessage = null) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'Server error occurred';
    toast.error(customMessage || message);
  } else if (error.request) {
    // Network error
    toast.error(customMessage || 'Network error. Please check your connection.');
  } else {
    // Other error
    toast.error(customMessage || 'An unexpected error occurred');
  }
};

export const handleWalletError = (error, operation = 'operation') => {
  console.error(`Wallet ${operation} error:`, error);
  
  if (error.message?.includes('insufficient funds')) {
    toast.error('Insufficient funds for this transaction');
  } else if (error.message?.includes('invalid address')) {
    toast.error('Invalid wallet address provided');
  } else if (error.message?.includes('network')) {
    toast.error('Network error. Please try again');
  } else {
    toast.error(`Failed to ${operation}. Please try again`);
  }
};

export const validateAddress = (address, type = 'unknown') => {
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  if (type === 'solana') {
    // Basic Solana address validation (base58, 32-44 chars)
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  } else if (type === 'ethereum') {
    // Basic Ethereum address validation (0x + 40 hex chars)
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  
  return true; // Generic validation
};
