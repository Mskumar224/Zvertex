const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/register', async (req, res) => {
  const { email, password, subscriptionType } = req.body;
  try {
    let user = await User.findOne({ email });

    // If user exists and has paid, block registration
    if (user && user.paid) {
      return res.status(400).json({ msg: 'User already exists and is subscribed. Please log in.' });
    }

    // If user exists but hasn’t paid, overwrite as a new user
    if (user && !user.paid) {
      await User.deleteOne({ email }); // Remove the unpaid user
    }

    // Create a new user (either fresh or overwriting unpaid)
    user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      subscriptionType,
      paid: false, // Initially unpaid until payment is verified
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, subscriptionType: user.subscriptionType });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.paid) return res.status(400).json({ msg: 'User not found or not subscribed. Please register and complete payment.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, subscriptionType: user.subscriptionType });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.paid) return res.status(400).json({ msg: 'User not found or not subscribed' });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    user.resetToken = resetToken;
    await user.save();
    res.json({ msg: 'Reset token generated (check console in dev)', resetToken });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.resetToken !== token || !user.paid) return res.status(400).json({ msg: 'Invalid or expired token, or user not subscribed' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    await user.save();
    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.post('/upload-resume', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.paid) return res.status(404).json({ msg: 'User not found or not subscribed' });

    user.resume = req.file.path;
    await user.save({ validateModifiedOnly: true });
    res.json({ msg: 'Resume uploaded', path: req.file.path });
  } catch (err) {
    console.error('Upload Resume Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;