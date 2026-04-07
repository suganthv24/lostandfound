import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, loginVerify } from '../api/auth.api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login: setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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
      setStep(2);
      setTimeLeft(300);
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
      navigate('/home');
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
    <div className="max-w-md w-full animate-fade-in mx-auto">
      <div className={`glass-card ${shake ? 'shake' : ''}`}>
        <h1 className="text-3xl font-extrabold mb-2">Welcome <span className="glow-text">Back</span></h1>
        <p className="text-muted mb-8 italic">Sign in to your account to continue</p>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-muted uppercase tracking-widest pl-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@college.edu" 
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <div className="text-rose-400 text-xs font-bold pl-1 animate-fadeIn">{error}</div>}
            </div>
            <button type="submit" className="btn-primary w-full py-4 mt-2" disabled={loading}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Send Verification OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-8">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted">
                OTP sent to <span className="text-indigo-300 font-bold">{email}</span>
              </p>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-[10px] uppercase tracking-widest font-black text-indigo-400 hover:text-indigo-300"
              >
                Change Email
              </button>
            </div>
            
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  className="input-field !p-0 w-12 h-14 text-center text-xl font-bold rounded-xl"
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  maxLength={1}
                />
              ))}
            </div>
            
            {error && <div className="text-rose-400 text-xs font-bold text-center animate-shake">{error}</div>}
            
            <div className="text-center">
               <div className={`inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest bg-white/5 border border-white/10 ${timeLeft < 60 ? 'text-rose-400' : 'text-indigo-400'}`}>
                {timeLeft > 0 ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    {formatTime()} remaining
                  </span>
                ) : (
                  'OTP Expired'
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-4" disabled={loading || timeLeft === 0 || otp.join('').length < 6}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Sign In Now'}
            </button>
          </form>
        )}

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-muted mb-4">Don't have an account yet?</p>
          <button 
            onClick={() => navigate('/signup')} 
            className="btn-outline w-full py-3 text-sm font-bold"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
