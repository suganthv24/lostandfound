import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { getColleges } from '../api/auth.api';

const SelectCollege = () => {
  const [colleges, setColleges] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data } = await getColleges();
        setColleges(data || []);
      } catch (err) {
        setError('Failed to load colleges');
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const handleNext = () => {
    if (!selectedId) return setError('Please select a college');
    navigate('/signup/email', { state: { collegeId: selectedId } });
  };

  return (
    <div className="max-w-xl w-full animate-fade-in mx-auto">
      <div className="glass-card">
        <div className="mb-10">
          <StepIndicator currentStep={1} />
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2">Select <span className="glow-text">College</span></h1>
        <p className="text-muted mb-8 italic">Choose your institution to get started with the community</p>

        {error && (
          <div className="bg-rose-500/10 border-l-4 border-rose-500 p-4 rounded-xl mb-8 animate-shake">
            <p className="text-rose-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest pl-1">Institution</label>
            {loading ? (
              <div className="h-14 flex items-center justify-center bg-input-bg/20 rounded-2xl border border-glass-border">
                <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : (
              <select 
                className="input-field appearance-none"
                value={selectedId} 
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setError('');
                }}
              >
                <option value="" className="bg-slate-900">Select your college...</option>
                {colleges.map(c => (
                  <option key={c._id} value={c._id} className="bg-slate-900">{c.name}</option>
                ))}
              </select>
            )}
          </div>

          <button 
            className="btn-primary w-full py-4 mt-4" 
            onClick={handleNext} 
            disabled={loading || !selectedId}
          >
            Continue to Email Verification
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-muted mb-4">Already part of the community?</p>
          <button 
            onClick={() => navigate('/login')} 
            className="btn-outline w-full py-3 text-sm font-bold"
          >
            Sign In to Your Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectCollege;
