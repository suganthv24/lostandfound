import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"College Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is: ${otp}. Valid for 5 minutes.`,
      html: `<p>Your OTP is: <b>${otp}</b>. Valid for 5 minutes.</p>`
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};
