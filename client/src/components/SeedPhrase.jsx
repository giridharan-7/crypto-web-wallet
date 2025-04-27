import React, { useState } from 'react';
import { EyeIcon, CopyIcon, CheckIcon } from 'lucide-react';
import useDecryptMnemonic from '../hooks/useDecryptMnemonic';
import NoSeedPhraseError from './NoSeedPhraseError';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';


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
    setTimeout(navigate('/wallet'), 2000);
  }
  const handleCopy = () => {
    if (seedPhrase) {
      navigator.clipboard.writeText(seedPhrase.join(' ')).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  if (loading) {
    return(
    <div className="min-h-screen bg-[#1a1b23] flex flex-col items-center justify-center space-y-4">
      {/* <Loader size="small" color="purple" /> */}
      <Loader size="medium" color="white" />
      {/* <Loader size="large" color="gray" /> */}
    </div>
    )
  }

  if (!seedPhrase) {
    return <NoSeedPhraseError/>
  }

  return (
    <div className="min-h-screen bg-[#1a1b23] flex flex-col items-center justify-center px-4 text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Your Secret Recovery Phrase</h2>
          <p className="mt-2 text-sm text-gray-400">
            Write down these 12 words in order and keep them safe.
          </p>
        </div>

        <div 
          className="relative mt-8 bg-[#2a2b35] rounded-lg p-4 transition-all duration-300 ease-in-out"
          onMouseEnter={() => setIsRevealed(true)}
          onMouseLeave={() => setIsRevealed(false)}
        >
          <div className={`grid grid-cols-3 gap-4 transition-all duration-300 ${isRevealed ? '' : 'blur-sm'}`}>
            {seedPhrase.map((word, index) => (
              <div key={index} className="bg-[#3a3b45] rounded p-2 text-center">
                <span className="text-gray-500 mr-2">{index + 1}.</span>
                {word}
              </div>
            ))}
          </div>

          {!isRevealed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <EyeIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}

          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-full bg-[#3a3b45] hover:bg-[#4a4b55] transition-colors duration-200"
            aria-label="Copy seed phrase"
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-500" />
            ) : (
              <CopyIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        <div className="text-center text-sm text-gray-400">
          <p>Hover over the box to reveal your seed phrase.</p>
          <p className="mt-2">Never share your secret recovery phrase with anyone.</p>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            I've Saved My Secret Recovery Phrase
          </button>
        </div>
      </div>
    </div>
  );
}
