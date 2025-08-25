import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'purple' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6', 
    large: 'w-8 h-8'
  };
  
  const colorClasses = {
    purple: 'border-purple-600',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}></div>
  );
};

export default LoadingSpinner;
