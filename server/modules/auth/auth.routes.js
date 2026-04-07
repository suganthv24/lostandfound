import express from 'express';
import { body } from 'express-validator';
import {
  getColleges,
  validateEmail,
  sendOtp,
  verifyOtp,
  register,
  login,
  loginVerify
} from './auth.controller.js';

const router = express.Router();

router.get('/colleges', getColleges);

router.post('/validate-email', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('collegeId').notEmpty().withMessage('College ID is required')
], validateEmail);

router.post('/send-otp', [
  body('email').isEmail().withMessage('Valid email is required')
], sendOtp);

router.post('/verify-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], verifyOtp);

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('collegeId').notEmpty().withMessage('College ID is required'),
  body('role').isIn(['student', 'faculty']).withMessage('Invalid role')
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required')
], login);

router.post('/login/verify', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], loginVerify);

export default router;
