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
      navigate('/home');
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full animate-fade-in mx-auto">
      <div className="glass-card">
        <div className="mb-10">
          <StepIndicator currentStep={4} />
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2">Complete Profile</h1>
        <p className="text-muted mb-8 italic">Just a few more details to get you started</p>

        {errors.global && (
          <div className="bg-rose-500/10 border-l-4 border-rose-500 p-4 rounded-xl mb-8 animate-shake">
            <p className="text-rose-400 text-sm font-medium">{errors.global}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest pl-1">Email Address</label>
            <input type="email" value={email} disabled className="input-field opacity-60 cursor-not-allowed" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest pl-1">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <div className="text-rose-400 text-xs font-bold pl-1">{errors.name}</div>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest pl-1">Phone Number</label>
            <input 
              type="text" 
              placeholder="9876543210"
              className="input-field"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
            />
            {errors.phone && <div className="text-rose-400 text-xs font-bold pl-1">{errors.phone}</div>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest pl-1">Role</label>
            <select 
              className="input-field"
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <button type="submit" className="btn-primary w-full py-4 mt-6" disabled={loading}>
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Create My Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
