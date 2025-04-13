const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const axios = require('axios');
const multer = require('multer');
const logger = require('winston');
const { v4: uuidv4 } = require('uuid');

// Logger setup
logger.configure({
  transports: [
    new logger.transports.Console(),
    new logger.transports.File({ filename: 'server.log' }),
  ],
  format: logger.format.combine(
    logger.format.timestamp(),
    logger.format.json()
  ),
});

// Express app
const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mongoose strictQuery setting
mongoose.set('strictQuery', true);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/zvertexai', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info(`${new Date().toISOString()} - MongoDB Connected`))
  .catch((err) => logger.error(`${new Date().toISOString()} - MongoDB Error: ${err.message}`));

// Multer setup for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'zvertexai@honotech.com',
    pass: process.env.EMAIL_PASS || 'your_email_password',
  },
});

// Routes
const authRoutes = [
  '/register',
  '/login',
  '/me',
  '/upload-resume',
  '/forgot-password',
  '/reset-password/:token',
  '/subscription',
];
const jobRoutes = ['/fetch', '/apply'];
const zgptRoutes = ['/query'];
const contactRoutes = ['/'];

logger.info(`${new Date().toISOString()} - Registered routes`, {
  auth: authRoutes,
  jobs: jobRoutes,
  zgpt: zgptRoutes,
  contact: contactRoutes,
});

// Authentication Middleware
const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    logger.warn(`${new Date().toISOString()} - No token provided`);
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Token Error: ${err.message}`);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await mongoose.model('User').findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new (mongoose.model('User'))({
      name,
      email,
      password: hashedPassword,
      subscription: 'Basic',
      trialActive: true,
      trialStart: new Date(),
    });

    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    await transporter.sendMail({
      from: '"ZvertexAI" <zvertexai@honotech.com>',
      to: email,
      subject: 'Welcome to ZvertexAI!',
      html: `<p>Hello ${name},</p><p>Welcome to ZvertexAI! Your account has been created successfully.</p>`,
    });

    res.json({ token });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Register Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await mongoose.model('User').findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!user.isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Login Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/auth/user', auth, async (req, res) => {
  try {
    const user = await mongoose.model('User').findById(req.user.id).select('-password');
    if (!user) {
      logger.error(`${new Date().toISOString()} - User not found for ID: ${req.user.id}`);
      return res.status(404).json({ msg: 'User not found' });
    }
    logger.info(`${new Date().toISOString()} - Fetched user: ${user.email}`);
    res.json(user);
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Get User Error: ${err.message}`, {
      stack: err.stack,
      userId: req.user?.id,
    });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.post('/api/auth/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    const user = await mongoose.model('User').findById(req.user.id);
    user.resume = req.file.path;
    await user.save();
    res.json({ msg: 'Resume uploaded successfully' });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Upload Resume Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await mongoose.model('User').findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '10m',
    });

    await transporter.sendMail({
      from: '"ZvertexAI" <zvertexai@honotech.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${process.env.CLIENT_URL || 'https://zvertexai-orzv.onrender.com'}/reset-password/${token}">here</a> to reset your password.</p>`,
    });

    res.json({ msg: 'Password reset link sent' });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Forgot Password Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/auth/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await mongoose.model('User').findById(decoded.user.id);
    if (!user) return res.status(400).json({ msg: 'Invalid token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Reset Password Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/api/auth/subscription', auth, async (req, res) => {
  const { subscription } = req.body;
  try {
    const user = await mongoose.model('User').findById(req.user.id);
    user.subscription = subscription;
    await user.save();
    res.json({ msg: 'Subscription updated' });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Subscription Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/jobs/search', auth, async (req, res) => {
  const { query, location } = req.query;
  try {
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
      params: {
        app_id: process.env.ADZUNA_APP_ID || 'your_adzuna_app_id',
        app_key: process.env.ADZUNA_APP_KEY || 'your_adzuna_app_key',
        what: query,
        where: location,
      },
    });
    res.json(response.data.results);
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Job Search Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/jobs/apply', auth, async (req, res) => {
  const { jobId, jobTitle, company, jobUrl } = req.body;
  try {
    const user = await mongoose.model('User').findById(req.user.id);
    await transporter.sendMail({
      from: '"ZvertexAI" <zvertexai@honotech.com>',
      to: user.email,
      subject: `Application Confirmation: ${jobTitle}`,
      html: `<p>You have applied for ${jobTitle} at ${company}. View details <a href="${jobUrl}">here</a>.</p>`,
    });
    res.json({ msg: 'Application submitted' });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Job Apply Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/zgpt/query', auth, async (req, res) => {
  const { prompt } = req.body;
  const user = await mongoose.model('User').findById(req.user.id);
  if (!['Pro', 'Enterprise'].includes(user.subscription)) {
    return res.status(403).json({ msg: 'ZGPT requires Pro or Enterprise subscription' });
  }
  try {
    // Placeholder for ZGPT integration
    res.json({ response: `ZGPT response to: ${prompt}` });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - ZGPT Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await transporter.sendMail({
      from: '"ZvertexAI" <zvertexai@honotech.com>',
      to: 'zvertexai@honotech.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
    });
    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Contact Error: ${err.message}`);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Serve static files (client build)
const staticPath = path.join(__dirname, '../client/build');
app.use(express.static(staticPath));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'), (err) => {
    if (err) {
      logger.error(`${new Date().toISOString()} - Static File Error: ${err.message}`);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  subscription: String,
  resume: String,
  trialActive: Boolean,
  trialStart: Date,
});
mongoose.model('User', userSchema);

// Cron job for trial expiration
cron.schedule('0 0 * * *', async () => {
  try {
    const users = await mongoose.model('User').find({ trialActive: true });
    const now = new Date();
    for (const user of users) {
      const trialEnd = new Date(user.trialStart);
      trialEnd.setDate(trialEnd.getDate() + 4);
      if (now > trialEnd) {
        user.trialActive = false;
        await user.save();
        await transporter.sendMail({
          from: '"ZvertexAI" <zvertexai@honotech.com>',
          to: user.email,
          subject: 'ZvertexAI Trial Expired',
          html: `<p>Hello ${user.name},</p><p>Your 4-day trial has expired. Upgrade your plan to continue enjoying our services!</p>`,
        });
      }
    }
  } catch (err) {
    logger.error(`${new Date().toISOString()} - Cron Error: ${err.message}`);
  }
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  logger.info(`${new Date().toISOString()} - Server running on port ${PORT}`, {});
});