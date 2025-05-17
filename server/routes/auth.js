const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
require('dotenv').config();

const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { email, password, phone } = req.body;

  if (!email || !password || !phone) {
    return res.status(400).json({ msg: 'Email, password, and phone are required' });
  }

  // Basic phone number validation
  const phoneRegex = /\b(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ msg: 'Invalid phone number format' });
  }

  try {
    // Check for verified user with the same email
    let user = await User.findOne({ email, isVerified: true });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Delete any unverified users with the same email
    await User.deleteMany({ email, isVerified: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user = new User({
      email,
      password: hashedPassword,
      phone,
      otp,
      otpExpires,
      isVerified: false,
    });

    await user.save();

    // Send OTP to company email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: process.env.COMPANY_EMAIL,
      from: process.env.EMAIL_USER,
      subject: `New User Registration OTP for ${email}`,
      text: `A new user has registered with the following details:\n\n
        Email: ${email}\n
        Phone: ${phone}\n
        OTP: ${otp}\n
        This OTP is valid for 10 minutes.\n\n
        Please provide this OTP to the user upon approval.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ userId: user.id, msg: 'OTP sent to company email for approval' });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ msg: 'User ID and OTP are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: 'User already verified' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      await User.deleteOne({ _id: userId }); // Delete unverified user on invalid/expired OTP
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.subscriptionStatus = 'TRIAL';
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, ...user._doc });
  } catch (err) {
    console.error('OTP verification error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, ...user._doc });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('recruiters');
    res.json(user);
  } catch (err) {
    console.error('Fetch user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscriptionStatus subscriptionType');
    res.json(user);
  } catch (err) {
    console.error('Subscription check error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/profile', auth, async (req, res) => {
  const { name, phone, email, technologies, companies, resume, additionalDetails } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.subscriptionType === 'RECRUITER' && user.profiles.length >= 5) {
      return res.status(400).json({ msg: 'Profile limit reached (5)' });
    }

    let parsedResume = {};
    if (req.files && req.files.resume) {
      const file = req.files.resume;
      let text = '';
      if (file.mimetype === 'application/pdf') {
        const pdfParse = require('pdf-parse');
        const pdf = await pdfParse(file.data);
        text = pdf.text;
      } else if (file.mimetype.includes('msword') || file.mimetype.includes('officedocument')) {
        text = 'Sample resume text from doc/docx';
      } else {
        return res.status(400).json({ msg: 'Unsupported file format' });
      }

      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
      const phoneRegex = /\b(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
      const techKeywords = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'TensorFlow'];
      const companyKeywords = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Indeed', 'LinkedIn'];

      parsedResume = {
        name: lines[0] || name || 'Unknown',
        email: lines.find(line => emailRegex.test(line))?.match(emailRegex)?.[0] || email || '',
        phone: lines.find(line => phoneRegex.test(line))?.match(phoneRegex)?.[0] || phone || '',
        technologies: lines
          .flatMap(line => techKeywords.filter(tech => line.toLowerCase().includes(tech.toLowerCase())))
          .filter((v, i, a) => a.indexOf(v) === i),
        companies: lines
          .flatMap(line => companyKeywords.filter(comp => line.toLowerCase().includes(comp.toLowerCase())))
          .filter((v, i, a) => a.indexOf(v) === i),
      };
    }

    user.profiles.push({
      name: parsedResume.name || name,
      phone: parsedResume.phone || phone,
      email: parsedResume.email || email,
      technologies: parsedResume.technologies?.length ? parsedResume.technologies : technologies?.split(',').map(t => t.trim()) || [],
      companies: parsedResume.companies?.length ? parsedResume.companies : companies?.split(',').map(c => c.trim()) || [],
      resume: resume || '',
      additionalDetails: additionalDetails || {},
    });

    await user.save();
    res.json({ profiles: user.profiles });
  } catch (err) {
    console.error('Profile creation error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/create-recruiter', auth, async (req, res) => {
  const { email, password, businessId } = req.body;

  try {
    const business = await User.findById(businessId);
    if (!business || business.subscriptionType !== 'BUSINESS') {
      return res.status(400).json({ msg: 'Invalid business account' });
    }
    if (business.recruiters.length >= 3) {
      return res.status(400).json({ msg: 'Recruiter limit reached (3)' });
    }

    let user = await User.findOne({ email, isVerified: true });
    if (user) {
      return res.status(400).json({ msg: 'Recruiter already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      subscriptionType: 'RECRUITER',
      phone: 'N/A',
      businessId,
      isVerified: true, // Recruiters created by business are auto-verified
    });

    await user.save();
    business.recruiters.push(user._id);
    await business.save();

    res.json({ recruiter: user });
  } catch (err) {
    console.error('Recruiter creation error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you requested a password reset.\n\n
        Click the following link to reset your password:\n
        ${process.env.CLIENT_URL}/reset-password/${token}\n\n
        If you did not request this, please ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
      isVerified: true,
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: process.env.COMPANY_EMAIL,
      from: email,
      subject: `Contact Us: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ msg: 'Failed to send message' });
  }
});

module.exports = router;