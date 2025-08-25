import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Shield, Key, ArrowRight } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b23] via-[#2a2b35] to-[#1a1b23] flex flex-col items-center justify-center px-4 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl shadow-2xl">
            <Wallet className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Welcome to Crypto Wallet
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Your gateway to the decentralized world. Secure, simple, and powerful.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 my-8">
          <div className="flex items-center space-x-3 bg-[#2a2b35] p-4 rounded-lg border border-gray-700">
            <Shield className="w-6 h-6 text-green-400" />
            <span className="text-gray-200">Bank-level security</span>
          </div>
          <div className="flex items-center space-x-3 bg-[#2a2b35] p-4 rounded-lg border border-gray-700">
            <Key className="w-6 h-6 text-blue-400" />
            <span className="text-gray-200">You own your keys</span>
          </div>
          <div className="flex items-center space-x-3 bg-[#2a2b35] p-4 rounded-lg border border-gray-700">
            <Wallet className="w-6 h-6 text-purple-400" />
            <span className="text-gray-200">Multi-chain support</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
          >
            <span>Create New Wallet</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-transparent border-2 border-purple-500 hover:bg-purple-500/10 text-purple-300 hover:text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200"
          >
            I already have a wallet
          </button>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <p className="text-sm text-gray-400">
            By continuing, you agree to our{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
