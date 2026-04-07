import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-500 font-medium tracking-wide animate-pulse">Loading amazing things...</p>
    </div>
  );
};

export default Loader;
