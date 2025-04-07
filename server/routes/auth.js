const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const TEST_EMAIL = 'test@zvertexai.com';
const TEST_PASSWORD = 'test123';

router.post('/register', async (req, res) => {
  const { email, password, subscriptionType } = req.body;
  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
    let user = await User.findOne({ email });
    if (email === TEST_EMAIL) {
      if (user) {
        user.subscriptionType = subscriptionType;
        user.password = await bcrypt.hash(password || TEST_PASSWORD, 10);
        user.paid = true;
      } else {
        user = new User({
          email,
          password: await bcrypt.hash(password || TEST_PASSWORD, 10),
          subscriptionType,
          paid: true,
        });
      }
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, subscriptionType: user.subscriptionType });
    }
    if (user && user.paid) return res.status(400).json({ msg: 'User already exists and is subscribed.' });
    if (user && !user.paid) await User.deleteOne({ email });
    user = new User({ email, password: await bcrypt.hash(password, 10), subscriptionType, paid: false });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, subscriptionType: user.subscriptionType });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Get User Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/update-details', authMiddleware, async (req, res) => {
  const { phone, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.phone = phone;
    user.email = email || user.email;
    await user.save();
    res.json({ msg: 'Details updated' });
  } catch (err) {
    console.error('Update Details Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/upload-resume', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    const user = await User.findById(req.user.id);
    if (!user || (!user.paid && user.email !== TEST_EMAIL)) return res.status(404).json({ msg: 'User not found or not subscribed' });

    let text = '';
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      text = result.value;
    }

    const techKeywords = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes'];
    const detectedTech = techKeywords.find((tech) => text.toLowerCase().includes(tech.toLowerCase()));
    user.resume = req.file.path;
    await user.save();
    res.json({ msg: 'Resume uploaded', path: req.file.path, technology: detectedTech });
  } catch (err) {
    console.error('Upload Resume Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (email === TEST_EMAIL) {
      if (!user) {
        const newUser = new User({
          email,
          password: await bcrypt.hash(TEST_PASSWORD, 10),
          subscriptionType: 'STUDENT',
          paid: true,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, subscriptionType: newUser.subscriptionType });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, subscriptionType: user.subscriptionType });
    }
    if (!user || !user.paid) return res.status(400).json({ msg: 'User not found or not subscribed.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, subscriptionType: user.subscriptionType });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;