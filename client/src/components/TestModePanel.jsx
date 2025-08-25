import React, { useState } from 'react';
import { Zap, AlertTriangle, Coins, TestTube, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { airdropSol, requestSepoliaFaucet } from '../hooks/useWalletActions';

const TestModePanel = ({ walletAddress, type, onBalanceUpdate, getSolanaBalance, getEthBalance }) => {
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropAmount, setAirdropAmount] = useState('1');

  const handleAirdrop = async () => {
    setIsAirdropping(true);
    
    try {
      if (type === 'Solana') {
        await airdropSol(walletAddress, parseFloat(airdropAmount));
        toast.success(`Successfully requested ${airdropAmount} SOL from devnet faucet!`);
        
        // Update balance after airdrop
        setTimeout(async () => {
          const newBalance = await getSolanaBalance(walletAddress);
          onBalanceUpdate(newBalance, 'Solana');
        }, 2000);
        
      } else if (type === 'Ethereum') {
        await requestSepoliaFaucet(walletAddress);
        toast.success('Successfully requested ETH from Sepolia testnet faucet!');
        
        // Update balance after airdrop
        setTimeout(async () => {
          const newBalance = await getEthBalance(walletAddress);
          onBalanceUpdate(newBalance, 'Ethereum');
        }, 3000);
      }
    } catch (error) {
      console.error('Airdrop failed:', error);
      toast.error(`Airdrop failed: ${error.message || 'Please try again later'}`);
    } finally {
      setIsAirdropping(false);
    }
  };

  const getFaucetInfo = () => {
    if (type === 'Solana') {
      return {
        network: 'Solana Devnet',
        amount: `${airdropAmount} SOL`,
        description: 'Get test SOL tokens for development',
        color: 'from-green-500 to-emerald-600'
      };
    } else {
      return {
        network: 'Ethereum Sepolia',
        amount: '0.1 ETH',
        description: 'Get test ETH tokens for development',
        color: 'from-blue-500 to-indigo-600'
      };
    }
  };

  const faucetInfo = getFaucetInfo();

  return (
    <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-700/30 rounded-xl p-4 mb-4">
      <div className="flex items-start space-x-3 mb-4">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
          <TestTube className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-amber-200 font-semibold">Test Mode</h3>
            <div className="bg-amber-500 text-amber-900 text-xs font-medium px-2 py-0.5 rounded-full">
              {faucetInfo.network}
            </div>
          </div>
          <p className="text-amber-100/80 text-sm">
            {faucetInfo.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount Selector (only for Solana) */}
        {type === 'Solana' && (
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">
              Airdrop Amount
            </label>
            <select
              value={airdropAmount}
              onChange={(e) => setAirdropAmount(e.target.value)}
              className="w-full bg-amber-900/30 border border-amber-600 rounded-lg px-3 py-2 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="0.5">0.5 SOL</option>
              <option value="1">1 SOL</option>
              <option value="2">2 SOL</option>
              <option value="5">5 SOL</option>
            </select>
          </div>
        )}

        {/* Airdrop Button */}
        <div className={type === 'Ethereum' ? 'md:col-span-2' : ''}>
          <label className="block text-sm font-medium text-amber-200 mb-2">
            Get Test Tokens
          </label>
          <button
            onClick={handleAirdrop}
            disabled={isAirdropping}
            className={`w-full bg-gradient-to-r ${faucetInfo.color} hover:from-opacity-80 hover:to-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2`}
          >
            {isAirdropping ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Requesting...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Get {faucetInfo.amount}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start space-x-2 mt-4 p-3 bg-amber-900/20 rounded-lg border border-amber-800/30">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-200/80">
          <p className="font-medium mb-1">Testnet Only</p>
          <p>These are test tokens with no real value. Use for development and testing only.</p>
        </div>
      </div>
    </div>
  );
};

export default TestModePanel;
