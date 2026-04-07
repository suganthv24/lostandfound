import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"College Auth" <no-reply@college.edu>',
    to: toEmail,
    subject: 'Your OTP Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; 
                  padding: 32px; border: 1px solid #eee; border-radius: 8px;">
        
        <h2 style="color: #1a1a1a; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #555; margin-bottom: 24px;">
          Use the OTP below to complete your verification. 
          It expires in <strong>5 minutes</strong>.
        </p>

        <div style="background: #f4f4f4; border-radius: 8px; padding: 24px; 
                    text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: bold; 
                       letter-spacing: 12px; color: #1a1a1a;">
            ${otp}
          </span>
        </div>

        <p style="color: #999; font-size: 13px;">
          Do not share this OTP with anyone. If you did not request this, 
          ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
