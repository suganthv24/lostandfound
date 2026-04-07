import { sendOTPEmail } from './utils/mailer.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    console.log('Sending test email to surya.p2024cse@sece.ac.in...');
    await sendOTPEmail('surya.p2024cse@sece.ac.in', '123456');
    console.log('Email sent successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Email test failed:', err);
    process.exit(1);
  }
}

test();
