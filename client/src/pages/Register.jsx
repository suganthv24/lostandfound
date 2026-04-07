import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { register } from '../api/auth.api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { state } = useLocation();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const email = state?.email;
  const collegeId = state?.collegeId;

  const [formData, setFormData] = useState({ name: '', phone: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!email || !collegeId) {
    navigate('/signup');
    return null;
  }

  const validate = () => {
    const newErrs = {};
    if (!formData.name.trim()) newErrs.name = 'Full Name is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrs.phone = 'Enter valid 10-digit phone number';
    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { ...formData, email, collegeId };
      const { data } = await register(payload);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <StepIndicator currentStep={4} />
      <h1>Complete Profile</h1>
      <p className="subtitle">Just a few more details</p>

      {errors.global && <div className="error-text mb-4">{errors.global}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} disabled style={{ opacity: 0.6 }} />
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="text" 
            placeholder="9876543210"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
          />
          {errors.phone && <div className="error-text">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        <button type="submit" className="btn mt-4" disabled={loading}>
          {loading ? <div className="spinner" /> : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default Register;
