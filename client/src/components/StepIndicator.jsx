import React from 'react';

const StepIndicator = ({ currentStep }) => {
  const totalSteps = 4;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Registration Progress</div>
        <div className="text-sm font-black text-indigo-400">
          Step <span className="text-2xl">{currentStep}</span> <span className="text-muted/40 font-normal mx-1">/</span> {totalSteps}
        </div>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-700 ease-out relative" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
