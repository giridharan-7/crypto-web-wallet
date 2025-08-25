import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink, ArrowUpRight, ArrowDownLeft, Copy, CheckIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const TransactionItem = ({ transaction, type }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getExplorerUrl = (hash, type) => {
    if (type === 'solana') {
      return `https://explorer.solana.com/tx/${hash}?cluster=devnet`;
    } else {
      return `https://sepolia.etherscan.io/tx/${hash}`;
    }
  };

  return (
    <div className="bg-[#2a2b35] rounded-lg p-4 mb-3 hover:bg-[#323344] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {transaction.type === 'sent' ? (
            <ArrowUpRight className="w-4 h-4 text-red-400" />
          ) : (
            <ArrowDownLeft className="w-4 h-4 text-green-400" />
          )}
          <span className="text-white font-medium">
            {transaction.type === 'sent' ? 'Sent' : 'Received'}
          </span>
          <span className="text-gray-400 text-sm">
            {transaction.amount} {type === 'solana' ? 'SOL' : 'ETH'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs ${
            transaction.status === 'confirmed' 
              ? 'bg-green-900 text-green-300' 
              : 'bg-yellow-900 text-yellow-300'
          }`}>
            {transaction.status}
          </span>
        </div>
      </div>
      
      <div className="space-y-1 text-sm text-gray-400">
        <div className="flex items-center justify-between">
          <span>Hash:</span>
          <div className="flex items-center space-x-1">
            <span className="font-mono">{transaction.hash.slice(0, 8)}...{transaction.hash.slice(-8)}</span>
            <button
              onClick={() => handleCopy(transaction.hash)}
              className="p-1 hover:bg-[#3a3b45] rounded"
            >
              {copied ? <CheckIcon className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
            <a
              href={getExplorerUrl(transaction.hash, type)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-[#3a3b45] rounded"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span>{transaction.type === 'sent' ? 'To:' : 'From:'}</span>
          <span className="font-mono">
            {transaction.address.slice(0, 6)}...{transaction.address.slice(-6)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Time:</span>
          <span>{new Date(transaction.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const TransactionHistory = ({ walletAddress, type }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [walletAddress, type]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This is a mock implementation - in a real app, you'd fetch from the blockchain
      const mockTransactions = [
        {
          hash: "5VfYd7aHkdf8hQGYd8LKj9kSd7f8hQGYd8LKj9kSd7f8hQGYd8LKj9kSd7f8hQGYd8LKj9k",
          type: "received",
          amount: "0.1",
          address: "7dHbWXmci3dT8UFYWYZZr6ok6RrfinhbGPPsQlNnLS8V",
          status: "confirmed",
          timestamp: Date.now() - 3600000
        },
        {
          hash: "3dT8UFYWYZZr6ok6RrfinhbGPPsQlNnLS8V7dHbWXmci3dT8UFYWYZZr6ok6RrfinhbGPPs",
          type: "sent",
          amount: "0.05",
          address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
          status: "confirmed",
          timestamp: Date.now() - 7200000
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (err) {
      setError('Failed to fetch transaction history');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#2a2b35] rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-600 rounded"></div>
            <div className="h-16 bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#2a2b35] rounded-lg p-6">
        <div className="text-center text-red-400">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-2 text-purple-400 hover:text-purple-300"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1b23] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Transaction History
        </h3>
        <button
          onClick={fetchTransactions}
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          Refresh
        </button>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction, index) => (
            <TransactionItem
              key={index}
              transaction={transaction}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
