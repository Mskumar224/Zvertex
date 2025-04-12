const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ msg: 'Invalid email format.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ msg: 'Password must be at least 8 characters long.' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists.' });

    user = new User({ email, password: await bcrypt.hash(password, 10), subscriptionType: 'Free', paid: false, appliedJobs: [] });
    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, email: user.email, subscriptionType: user.subscriptionType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during registration.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, email: user.email, subscriptionType: user.subscriptionType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during login.' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found.' });
    res.json({ email: user.email, subscriptionType: user.subscriptionType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error fetching user data.' });
  }
});

router.post('/resume', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found.' });

    if (!req.files || !req.files.resume) {
      return res.status(400).json({ msg: 'No resume file uploaded.' });
    }

    const resume = req.files.resume;
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resume.mimetype)) {
      return res.status(400).json({ msg: 'Invalid file type. Only PDF, DOC, or DOCX allowed.' });
    }
    if (resume.size > 5 * 1024 * 1024) {
      return res.status(400).json({ msg: 'File size exceeds 5MB limit.' });
    }

    const uploadPath = path.join(__dirname, '..', 'uploads', 'resumes');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fileName = `${req.user.id}-${Date.now()}-${resume.name}`;
    const filePath = path.join(uploadPath, fileName);
    await resume.mv(filePath);

    user.resume = `/uploads/resumes/${fileName}`;
    await user.save();

    res.json({ msg: 'Resume uploaded successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error uploading resume.' });
  }
});

module.exports = router;