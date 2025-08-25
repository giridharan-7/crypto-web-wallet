import React from 'react';
import { Navigate } from 'react-router-dom';
import Wallet from './Wallet';
import Welcome from './Welcome';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';

const Home = () => {
  const { isAuthenticated, loading, hasAccount } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1b23] via-[#2a2b35] to-[#1a1b23] flex flex-col items-center justify-center space-y-4">
        <Loader size="medium" color="white" />
        <p className="text-gray-400 text-sm">Loading your wallet...</p>
      </div>
    )
  }

  // If user has account and is authenticated, show wallet
  if (hasAccount && isAuthenticated) {
    return <Wallet />;
  }
  
  // If user has account but not authenticated, redirect to login
  if (hasAccount && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If user has no account, show welcome page
  return <Welcome />;
};

export default Home;
