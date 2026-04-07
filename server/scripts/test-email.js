import 'dotenv/config';
import sendEmail from '../utils/email.js';

async function runTest() {
  try {
    console.log('Testing Nodemailer setup using account:', process.env.EMAIL_USERNAME);
    
    await sendEmail({
      email: process.env.EMAIL_USERNAME, // Sending an email to whoever the sender is, to verify
      subject: '✅ Success! Nodemailer is Working!',
      message: 'Hello! This is an automated test from your local development environment. If you are reading this, your Gmail App Passwords and Nodemailer configuration are fully set up!'
    });
    
    console.log('✅ Test Passed! Check the inbox of:', process.env.EMAIL_USERNAME);
    console.log();
    console.log('Now you can start the API by running: npm run dev or node index.js');
  } catch (err) {
    console.log('❌ Test Failed. Please verify your .env file credentials.');
    console.error('Error:', err.message);
  }
}

runTest();
