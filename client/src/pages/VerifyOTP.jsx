import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { verifyOtp, sendOtp } from '../api/auth.api';

const VerifyOTP = () => {
  const { state } = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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
    <div className="max-w-xl w-full animate-fade-in mx-auto">
      <div className={`glass-card ${shake ? 'shake' : ''}`}>
        <div className="mb-10">
          <StepIndicator currentStep={3} />
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2">Verify <span className="glow-text">OTP</span></h1>
        <p className="text-muted mb-8 italic text-center">We've sent a 6-digit code to <br/><span className="text-indigo-300 font-bold">{email}</span></p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2 md:gap-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                className="input-field !p-0 w-full h-14 md:h-16 text-center text-2xl font-bold rounded-2xl"
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
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

          <button type="submit" className="btn-primary w-full py-4 mt-4" disabled={loading || timeLeft === 0 || otp.join('').length < 6}>
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Verify Code'}
          </button>

          <div className="text-center pt-4">
            <button 
              type="button" 
              className={`text-xs font-black uppercase tracking-widest transition-colors ${timeLeft === 0 ? 'text-indigo-400 hover:text-indigo-300' : 'text-muted cursor-not-allowed opacity-50'}`}
              onClick={handleResend}
              disabled={timeLeft > 0}
            >
              {timeLeft > 0 ? `Resend available in ${formatTime()}` : 'Resend Verification Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
