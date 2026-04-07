// src/api/auth.api.js
import api from './api.js';

export const getColleges = () => api.get('/auth/colleges');
export const validateEmail = (email, collegeId) => api.post('/auth/validate-email', { email, collegeId });
export const sendOtp = (email) => api.post('/auth/send-otp', { email });
export const verifyOtp = (email, otp) => api.post('/auth/verify-otp', { email, otp });
export const register = (data) => api.post('/auth/register', data);
export const login = (email) => api.post('/auth/login', { email });
export const loginVerify = (email, otp) => api.post('/auth/login/verify', { email, otp });
