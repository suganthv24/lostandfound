import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import College from './college.model.js';
import OTP from './otp.model.js';
import User from './user.model.js';
import { sendOTPEmail } from '../../utils/mailer.js';

const verifiedEmails = new Set();

const PERSONAL_DOMAINS = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com'];

export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find({}, '_id name domains');
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const validateEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

  const { email, collegeId } = req.body;

  try {
    const isPersonal = PERSONAL_DOMAINS.some(domain => email.toLowerCase().endsWith(domain));
    if (isPersonal) {
      return res.status(400).json({ valid: false, message: 'Personal emails are not allowed' });
    }

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    const isValidDomain = college.domains.some(domain => email.toLowerCase().endsWith(domain.toLowerCase()));
    
    if (!isValidDomain) {
      return res.status(400).json({ valid: false, message: 'Invalid college email' });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const sendOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

  const { email } = req.body;

  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt, used: false },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp);

    return res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error detailed:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
  }
};

export const verifyOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }
    if (otpRecord.used) {
      return res.status(400).json({ success: false, message: 'OTP already used' });
    }
    if (Date.now() > otpRecord.expiresAt.getTime()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    otpRecord.used = true;
    await otpRecord.save();

    verifiedEmails.add(email);

    return res.status(200).json({ verified: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

  const { name, email, phone, collegeId, role } = req.body;

  try {
    if (!verifiedEmails.has(email)) {
      return res.status(403).json({ success: false, message: 'Email not verified' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      phone,
      collegeId,
      role,
      isVerified: true
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, collegeId: user.collegeId.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    verifiedEmails.delete(email);
    await OTP.deleteOne({ email });

    return res.status(200).json({
      success: true,
      token,
      user: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId.toString()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Trigger OTP send
    req.body.email = email;
    return await sendOtp(req, res);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const loginVerify = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }
    if (otpRecord.used) {
      return res.status(400).json({ success: false, message: 'OTP already used' });
    }
    if (Date.now() > otpRecord.expiresAt.getTime()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    otpRecord.used = true;
    await otpRecord.save();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, collegeId: user.collegeId.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await OTP.deleteOne({ email });

    return res.status(200).json({
      success: true,
      token,
      user: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId.toString()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
