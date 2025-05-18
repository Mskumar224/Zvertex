const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendActivityEmail = async (email, subject, action, details) => {
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: #1a2a44; padding: 10px; text-align: center;">
        <h1 style="color: white; margin: 0;">ZvertexAI</h1>
      </div>
      <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 10px;">
        <h2 style="color: #1a2a44;">${subject}</h2>
        <p>Dear ${email},</p>
        <p>Your account has performed the following action: <strong>${action}</strong></p>
        <p>Details: ${details}</p>
        <p>If this was not you, please contact support immediately.</p>
        <p>Best regards,<br>ZvertexAI Team</p>
      </div>
      <div style="text-align: center; color: #757575; margin-top: 10px;">
        <p>© 2025 ZvertexAI. All rights reserved.</p>
      </div>
    </div>
  `;
  await sendEmail(email, `ZvertexAI: ${subject}`, emailTemplate);
};

router.post('/signup', async (req, res) => {
  const { email, phone, password } = req.body;
  if (!email || !phone || !password) {
    return res.status(400).json({ message: 'Email, phone, and password are required' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) {
      if (!user.isVerified) {
        await User.deleteOne({ email });
      } else {
        return res.status(400).json({ message: 'User already exists and is verified' });
      }
    }

    const otp = generateOTP();
    user = new User({ email, phone, password, otp });
    await user.save();

    await sendEmail(
      'zvertex.247@gmail.com',
      'New User OTP Request',
      `A new user signed up with email: ${email}, phone: ${phone}. OTP: ${otp}. Please provide this OTP to the user upon request.`
    );
    await sendActivityEmail(email, 'Account Signup', 'Signup Initiated', `You have started the signup process. Please verify your OTP.`);

    res.status(201).json({ message: 'User created. Please request OTP from ZvertexAI team to verify your account.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendActivityEmail(email, 'Account Verification', 'OTP Verified', `Your account has been successfully verified.`);
    res.json({ token, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found. Please sign up.' });
    if (!user.isVerified) return res.status(400).json({ message: 'Account not verified. Please sign up again to receive a new OTP.' });
    if (user.password !== password) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendActivityEmail(email, 'Account Login', 'Successful Login', `You have logged into your ZvertexAI account.`);
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(400).json({ message: 'Account not verified' });

    const resetOtp = generateOTP();
    user.resetOtp = resetOtp;
    await user.save();

    await sendEmail(
      'zvertex.247@gmail.com',
      'Password Reset OTP Request',
      `A password reset was requested for email: ${email}. Reset OTP: ${resetOtp}. Please provide this OTP to the user upon request.`
    );
    await sendActivityEmail(email, 'Password Reset Request', 'OTP Sent', `A password reset OTP has been requested for your account.`);

    res.json({ message: 'Password reset OTP sent to ZvertexAI team. Please request the OTP to proceed.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Forgot password failed', error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(400).json({ message: 'Account not verified' });
    if (user.resetOtp !== otp) return res.status(400).json({ message: 'Invalid reset OTP' });

    user.password = newPassword;
    user.resetOtp = null;
    await user.save();

    await sendActivityEmail(email, 'Password Reset', 'Password Changed', `Your account password has been successfully reset.`);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      await sendActivityEmail(user.email, 'Account Logout', 'Successful Logout', `You have logged out of your ZvertexAI account.`);
    }
    res.json({ message: 'Logout successful. Token should be cleared on client side.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
});

module.exports = router;