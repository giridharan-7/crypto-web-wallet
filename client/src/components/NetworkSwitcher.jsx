import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle, Shield, TestTube, X } from 'lucide-react';
import { toast } from 'react-toastify';

const NetworkSwitcher = () => {
  const [currentNetwork, setCurrentNetwork] = useState('testnet');
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showMainnetWarning, setShowMainnetWarning] = useState(false);

  useEffect(() => {
    // Load network preference from localStorage
    const savedNetwork = localStorage.getItem('network') || 'testnet';
    setCurrentNetwork(savedNetwork);
  }, []);

  const handleNetworkSwitch = (network) => {
    if (network === 'mainnet') {
      setShowMainnetWarning(true);
      setShowSwitcher(false);
    } else {
      switchNetwork(network);
    }
  };

  const switchNetwork = (network) => {
    setCurrentNetwork(network);
    localStorage.setItem('network', network);
    toast.success(`Switched to ${network === 'testnet' ? 'Testnet' : 'Mainnet'} mode`);
    setShowSwitcher(false);
    setShowMainnetWarning(false);
    
    // Reload the page to apply network changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const confirmMainnetSwitch = () => {
    switchNetwork('mainnet');
  };

  const getNetworkInfo = () => {
    if (currentNetwork === 'testnet') {
      return {
        name: 'Testnet',
        description: 'Safe for testing',
        color: 'from-amber-500 to-orange-500',
        textColor: 'text-amber-200',
        bgColor: 'bg-amber-900/20',
        borderColor: 'border-amber-700/30',
        icon: TestTube,
        networks: ['Solana Devnet', 'Ethereum Sepolia']
      };
    } else {
      return {
        name: 'Mainnet',
        description: 'Real cryptocurrency',
        color: 'from-red-500 to-red-600',
        textColor: 'text-red-200',
        bgColor: 'bg-red-900/20',
        borderColor: 'border-red-700/30',
        icon: Shield,
        networks: ['Solana Mainnet', 'Ethereum Mainnet']
      };
    }
  };

  const networkInfo = getNetworkInfo();
  const Icon = networkInfo.icon;

  return (
    <>
      {/* Network Badge */}
      <button
        onClick={() => setShowSwitcher(true)}
        className={`bg-gradient-to-r ${networkInfo.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 hover:opacity-80 transition-opacity`}
      >
        <Icon className="w-3 h-3" />
        <span>{networkInfo.name.toUpperCase()}</span>
      </button>

      {/* Network Switcher Modal */}
      {showSwitcher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2b35] rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Network Settings</span>
              </h2>
              <button
                onClick={() => setShowSwitcher(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Testnet Option */}
              <button
                onClick={() => handleNetworkSwitch('testnet')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  currentNetwork === 'testnet'
                    ? 'border-amber-500 bg-amber-900/20'
                    : 'border-gray-600 bg-gray-800/50 hover:border-amber-400'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                    <TestTube className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-semibold">Testnet Mode</h3>
                    <p className="text-gray-400 text-sm">Safe for development and testing</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="bg-amber-900/30 text-amber-300 text-xs px-2 py-1 rounded">
                        Solana Devnet
                      </span>
                      <span className="bg-amber-900/30 text-amber-300 text-xs px-2 py-1 rounded">
                        Ethereum Sepolia
                      </span>
                    </div>
                  </div>
                  {currentNetwork === 'testnet' && (
                    <div className="text-amber-400">✓</div>
                  )}
                </div>
              </button>

              {/* Mainnet Option */}
              <button
                onClick={() => handleNetworkSwitch('mainnet')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  currentNetwork === 'mainnet'
                    ? 'border-red-500 bg-red-900/20'
                    : 'border-gray-600 bg-gray-800/50 hover:border-red-400'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-semibold">Mainnet Mode</h3>
                    <p className="text-gray-400 text-sm">Real cryptocurrency transactions</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded">
                        Solana Mainnet
                      </span>
                      <span className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded">
                        Ethereum Mainnet
                      </span>
                    </div>
                  </div>
                  {currentNetwork === 'mainnet' && (
                    <div className="text-red-400">✓</div>
                  )}
                </div>
              </button>
            </div>

            <div className="mt-6 p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-200">
                  <p className="font-medium">Network Switch</p>
                  <p>Changing networks will reload the application. Make sure to save any ongoing work.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mainnet Warning Modal */}
      {showMainnetWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2b35] rounded-xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Switch to Mainnet?
              </h2>
              <p className="text-gray-300 mb-6">
                You're about to switch to mainnet mode where you'll be using <strong>real cryptocurrency</strong>. 
                All transactions will cost real money and cannot be undone.
              </p>

              <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 mb-6">
                <div className="text-left space-y-2 text-sm text-red-200">
                  <p>⚠️ Real money will be used for transactions</p>
                  <p>⚠️ Gas fees will be charged in real ETH/SOL</p>
                  <p>⚠️ Mistakes cannot be reversed</p>
                  <p>⚠️ Airdrop features will be disabled</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowMainnetWarning(false)}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMainnetSwitch}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-semibold"
                >
                  Switch to Mainnet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NetworkSwitcher;
