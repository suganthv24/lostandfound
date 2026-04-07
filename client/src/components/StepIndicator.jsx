import React from 'react';

const StepIndicator = ({ currentStep }) => {
  const totalSteps = 4;
  
  return (
    <div className="step-indicator">
      <div className="step-text">Step {currentStep} of {totalSteps}</div>
      <div className="progress-bar">
        <div 
          className="progress-fill glass-glow" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepIndicator;
