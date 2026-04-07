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
    <div className="glass-card">
      <StepIndicator currentStep={2} />
      <h1>Verify Email</h1>
      <p className="subtitle">Enter your official college email</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="student@college.edu" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <div className="error-text">{error}</div>}
        </div>

        <button type="submit" className="btn mt-4" disabled={loading}>
          {loading ? <div className="spinner" /> : 'Send OTP'}
        </button>
      </form>
    </div>
  );
};

export default ValidateEmail;
