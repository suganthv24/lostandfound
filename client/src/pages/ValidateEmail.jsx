import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { validateEmail, sendOtp } from '../api/auth.api';

const ValidateEmail = () => {
  const { state } = useLocation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const collegeId = state?.collegeId;

  if (!collegeId) {
    navigate('/signup');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Email is required');
    setError('');
    setLoading(true);

    try {
      await validateEmail(email, collegeId);
      await sendOtp(email);
      navigate('/signup/verify-otp', { state: { email, collegeId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to validate email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full animate-fade-in mx-auto">
      <div className="glass-card">
        <div className="mb-10">
          <StepIndicator currentStep={2} />
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2">Verify <span className="glow-text">Email</span></h1>
        <p className="text-muted mb-8 italic">Enter your official college email address</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest pl-1">Email Address</label>
            <input 
              type="email" 
              placeholder="yourname@college.edu" 
              className="input-field"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            {error && <div className="text-rose-400 text-xs font-bold pl-1 animate-fadeIn">{error}</div>}
          </div>

          <button type="submit" className="btn-primary w-full py-4 mt-4" disabled={loading}>
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Send Verification OTP'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5">
          <button 
            onClick={() => navigate(-1)} 
            className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
          >
            ← Back to College Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidateEmail;
