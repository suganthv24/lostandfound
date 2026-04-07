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
    <div className="glass-card">
      <StepIndicator currentStep={1} />
      <h1>Select College</h1>
      <p className="subtitle">Choose your institution to get started</p>

      {error && <div className="error-text mb-4">{error}</div>}

      <div className="form-group">
        <label>Institution</label>
        {loading ? (
          <div className="spinner" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent', margin: '0 auto' }} />
        ) : (
          <select 
            value={selectedId} 
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Select a college...</option>
            {colleges.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      <button className="btn mt-4" onClick={handleNext} disabled={loading || !selectedId}>
        Continue
      </button>

      <a href="/login" className="link" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
        Already have an account? Login
      </a>
    </div>
  );
};

export default SelectCollege;
