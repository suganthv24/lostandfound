import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-[6px] border-indigo-500/10 rounded-full"></div>
        <div className="absolute inset-0 border-[6px] border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 border-[4px] border-purple-500/20 rounded-full"></div>
        <div className="absolute inset-4 border-[4px] border-purple-400 rounded-full border-b-transparent animate-spin-reverse"></div>
      </div>
      <p className="mt-8 text-muted font-bold tracking-[0.2em] uppercase text-[10px] animate-pulse">
        Crafting your experience...
      </p>
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
