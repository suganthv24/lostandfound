import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { verifyOtp, sendOtp } from '../api/auth.api';

const VerifyOTP = () => {
  const { state } = useLocation();
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const email = state?.email;
  const collegeId = state?.collegeId;

  useEffect(() => {
    if (!email) navigate('/signup');
    
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, email, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return setError('Enter valid OTP');
    
    setError('');
    setLoading(true);
    setShake(false);

    try {
      await verifyOtp(email, otpString);
      navigate('/signup/register', { state: { email, collegeId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
      setShake(true);
      setTimeout(() => setShake(false), 400); // Reset shake
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp(email);
      setTimeLeft(300);
      setError('');
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`glass-card ${shake ? 'shake' : ''}`}>
      <StepIndicator currentStep={3} />
      <h1>Verify OTP</h1>
      <p className="subtitle">OTP sent to {email}</p>

      <form onSubmit={handleSubmit}>
        <div className="otp-container">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              className="otp-box"
              type="text"
              value={digit}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
            />
          ))}
        </div>
        
        {error && <div className="error-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <div className="timer">
          {timeLeft > 0 ? formatTime() : 'OTP Expired'}
        </div>

        <button type="submit" className="btn" disabled={loading || timeLeft === 0 || otp.join('').length < 6}>
          {loading ? <div className="spinner" /> : 'Verify'}
        </button>

        {timeLeft === 0 && (
          <button type="button" className="btn btn-secondary mt-4" onClick={handleResend}>
            Resend OTP
          </button>
        )}
      </form>
    </div>
  );
};

export default VerifyOTP;
