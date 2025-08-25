import React from 'react';
import { LogOut, Wallet as WalletIcon, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ accountCount = 0 }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav className="border-b border-gray-800 bg-[#2a2b35]">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <WalletIcon className="w-8 h-8 text-purple-500" />
              <h1 className="text-2xl font-bold text-white">Crypto Wallet</h1>
            </div>
            <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {accountCount} account{accountCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/settings')}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-700"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
