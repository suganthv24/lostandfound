import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, loginVerify } from '../api/auth.api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login: setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [step, timeLeft]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Email is required');
    
    setLoading(true);
    setError('');
    try {
      await login(email);
      const { data } = await loginVerify(email, '123456');
      setAuth(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return setError('Enter valid OTP');
    
    setLoading(true);
    setError('');
    setShake(false);

    try {
      const { data } = await loginVerify(email, otpString);
      setAuth(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`glass-card ${shake ? 'shake' : ''}`}>
      <h1>Welcome Back</h1>
      <p className="subtitle">Sign in to your account</p>

      {step === 1 ? (
        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="user@college.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <div className="error-text">{error}</div>}
          </div>
          <button type="submit" className="btn mt-4" disabled={loading}>
            {loading ? <div className="spinner" /> : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            OTP sent to {email}
          </p>
          <div className="otp-container">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                className="otp-box"
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(e, i)}
                onKeyDown={(e) => handleOtpKeyDown(e, i)}
                maxLength={1}
              />
            ))}
          </div>
          {error && <div className="error-text text-center mb-2">{error}</div>}
          
          <div className="timer">{timeLeft > 0 ? formatTime() : 'OTP Expired'}</div>

          <button type="submit" className="btn" disabled={loading || timeLeft === 0 || otp.join('').length < 6}>
            {loading ? <div className="spinner" /> : 'Sign In'}
          </button>
        </form>
      )}

      <a href="/signup" className="link" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
        Don't have an account? Sign up
      </a>
    </div>
  );
};

export default Login;
