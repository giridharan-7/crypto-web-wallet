import React from 'react';
import { Navigate } from 'react-router-dom';
import Wallet from './Wallet';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';
import Login from './Login';

const Home = () => {
  const { isAuthenticated, loading,hasAccount } = useAuth();
  console.log(isAuthenticated)

  if (loading) {
    return (
    <div className="min-h-screen bg-[#1a1b23] flex flex-col items-center justify-center space-y-4">
      {/* <Loader size="small" color="purple" /> */}
      <Loader size="medium" color="white" />
      {/* <Loader size="large" color="gray" /> */}
    </div>
    )
  }

  return (hasAccount ? isAuthenticated ? <Wallet /> : <Navigate to="/login"/> : <Navigate to="/signup"/>);
};

export default Home;
