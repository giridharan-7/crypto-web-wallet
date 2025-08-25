import React, { useState } from 'react';
import { EyeIcon, CopyIcon, CheckIcon, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import useDecryptMnemonic from '../hooks/useDecryptMnemonic';
import NoSeedPhraseError from './NoSeedPhraseError';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function SeedPhrase() {
  const hashedPassword = localStorage.getItem('hashedPassword');
  console.log(hashedPassword)
  const { loading, decryptedData, error } = useDecryptMnemonic(hashedPassword);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();
   console.log(decryptedData)
  console.log("Error from decryptic mnemonic")
   console.log(error)
  const seedPhrase=decryptedData.decryptedMnemonic;

  const handleSubmit = () => {
    toast.success('Recovery phrase secured! Redirecting to wallet...');
    setTimeout(() => navigate('/wallet'), 1500);
  }
  
  const handleCopy = () => {
    if (seedPhrase) {
      navigator.clipboard.writeText(seedPhrase.join(' ')).then(() => {
        setIsCopied(true);
        toast.success('Recovery phrase copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1b23] via-[#2a2b35] to-[#1a1b23] flex flex-col items-center justify-center space-y-4">
        <Loader size="medium" color="white" />
        <p className="text-gray-400 text-sm">Generating your recovery phrase...</p>
      </div>
    )
  }

  if (!seedPhrase) {
    return <NoSeedPhraseError/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b23] via-[#2a2b35] to-[#1a1b23] flex flex-col px-4 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <button
          onClick={() => navigate('/signup')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-lg w-full space-y-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-2xl shadow-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Your Secret Recovery Phrase
            </h2>
            <p className="mt-3 text-gray-300 leading-relaxed">
              This phrase is the only way to recover your wallet. Store it safely and never share it with anyone.
            </p>
          </div>

          <div className="bg-[#2a2b35] rounded-2xl p-6 border border-gray-700 shadow-2xl">
            {/* Warning */}
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-800/30 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-red-300 font-medium">Important Security Notice</p>
                  <p className="text-red-200/80 mt-1">Never share this phrase. Anyone with these words can access your wallet.</p>
                </div>
              </div>
            </div>

            {/* Seed Phrase Grid */}
            <div 
              className="relative"
              onMouseEnter={() => setIsRevealed(true)}
              onMouseLeave={() => setIsRevealed(false)}
            >
              <div className={`grid grid-cols-3 gap-3 transition-all duration-300 ${isRevealed ? '' : 'blur-sm'}`}>
                {seedPhrase.map((word, index) => (
                  <div key={index} className="bg-[#1a1b23] border border-gray-600 rounded-lg p-3 text-center hover:border-purple-500 transition-colors">
                    <span className="text-purple-400 text-xs font-medium">{index + 1}</span>
                    <p className="text-white font-mono text-sm mt-1">{word}</p>
                  </div>
                ))}
              </div>

              {!isRevealed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#2a2b35]/50 rounded-xl">
                  <EyeIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-400 text-sm">Hover to reveal phrase</p>
                </div>
              )}

              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 rounded-lg bg-[#3a3b45] hover:bg-[#4a4b55] transition-colors duration-200 border border-gray-600"
                aria-label="Copy seed phrase"
              >
                {isCopied ? (
                  <CheckIcon className="h-4 w-4 text-green-400" />
                ) : (
                  <CopyIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Write down these words in order and store them safely</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Keep multiple copies in different secure locations</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Never share or store digitally</span>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
          >
            <span>I've Saved My Recovery Phrase</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
