const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const multer = require('multer');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const schedule = require('node-schedule');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check required environment variables
const requiredEnv = [
  'PORT',
  'MONGODB_URI',
  'EMAIL_USER',
  'EMAIL_PASS',
  'JWT_SECRET',
  'FRONTEND_URL',
  'RAPIDAPI_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'COMPANY_EMAIL',
];
requiredEnv.forEach((env) => {
  if (!process.env[env]) throw new Error(`Missing required env variable: ${env}`);
});

console.log('Starting backend server...', {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  EMAIL_USER: process.env.EMAIL_USER,
  COMPANY_EMAIL: process.env.COMPANY_EMAIL,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Updated CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://zvertexai.netlify.app',
  'https://67d1e078ce70580008045c8d--zvertexai.netlify.app',
  'https://67d1e69e2d47412a5001c924--zvertexai.netlify.app',
  'https://67d1e9046704b12e711ef0b1--zvertexai.netlify.app',
  'https://zvertexai.com',
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS rejected origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204);
});

// MongoDB connection with retry logic
let dbConnected = false;
const connectToMongoDB = async (retryCount = 0, maxRetries = 10) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    dbConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(`MongoDB connection attempt ${retryCount + 1} failed:`, err.message);
    if (retryCount < maxRetries) {
      const delayMs = Math.min(1000 * 2 ** retryCount, 30000); // Exponential backoff, max 30s
      console.log(`Retrying in ${delayMs / 1000} seconds...`);
      setTimeout(() => connectToMongoDB(retryCount + 1, maxRetries), delayMs);
    } else {
      console.error('Max MongoDB connection retries reached. Exiting process.');
      process.exit(1);
    }
  }
};
connectToMongoDB();

mongoose.connection.on('disconnected', () => {
  if (dbConnected) {
    console.log('MongoDB disconnected, attempting to reconnect...');
    dbConnected = false;
    connectToMongoDB();
  }
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

// Multer configuration for memory storage (for Cloudinary)
const upload = multer({ storage: multer.memoryStorage() }).single('resume');

// Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  subscription: { type: String, enum: ['Student', 'Vendor/Recruiter', 'Business'], required: true },
  plan: { type: String, enum: ['Basic', 'Unlimited'], default: 'Basic' },
  resumePaths: [String],
  selectedCompanies: [String],
  appliedJobs: [{ jobId: String, date: Date }],
  phone: { type: String, required: true },
  resetToken: String,
  resetTokenExpiry: Date,
  linkedinProfile: String,
  coverLetter: String,
  technology: String,
  isOtpVerified: { type: Boolean, default: false },
  scraperPreferences: {
    jobBoards: [{ type: String, enum: ['Indeed', 'LinkedIn', 'Glassdoor'], default: ['Indeed'] }],
    frequency: { type: String, default: 'daily' },
    location: { type: String, default: 'United States' },
  },
});
userSchema.index({ email: 1, isOtpVerified: 1 });

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  posted: { type: Date, default: Date.now },
  url: String,
  description: String,
  source: { type: String, enum: ['Indeed', 'LinkedIn', 'Glassdoor', 'Mock'], required: true },
  requiresDocs: Boolean,
  appliedBy: [{ userId: mongoose.Schema.Types.ObjectId, date: Date }],
}, { timestamps: true });
jobSchema.index({ company: 1, posted: -1 });

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

const User = mongoose.model('User', userSchema);
const Job = mongoose.model('Job', jobSchema);
const OTP = mongoose.model('OTP', otpSchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true,
  maxConnections: 5,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});
transporter.verify((error) => {
  if (error) {
    console.error('Nodemailer setup failed:', error.message);
    console.error('Ensure EMAIL_USER and EMAIL_PASS are correct. EMAIL_PASS must be a Gmail App Password.');
  } else {
    console.log('Nodemailer configured successfully');
  }
});

// Utility functions
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const scanResume = (resumePath) => ['Add more technical skills', 'Update recent experience'];
const updateResume = (resumePath, prompt) => resumePath;

const scrapeIndeedJobs = async (technology, location, companies, page = 1) => {
  const options = {
    method: 'GET',
    url: 'https://indeed12.p.rapidapi.com/jobs/search',
    params: {
      query: technology || 'software',
      location: location || 'United States',
      page: page.toString(),
      sort: 'date',
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'indeed12.p.rapidapi.com',
    },
  };
  try {
    const response = await axios.request(options);
    const jobs = response.data.hits || [];
    const filteredJobs = jobs
      .filter((job) => job.company_name && companies.some((c) => job.company_name.toLowerCase().includes(c.toLowerCase())))
      .map((job) => ({
        jobId: job.job_id,
        title: job.title || 'Unknown Title',
        company: job.company_name,
        location: job.location || 'Unknown Location',
        posted: job.posted_time ? new Date(job.posted_time) : new Date(),
        url: job.link || `https://www.indeed.com/viewjob?jk=${job.job_id}`,
        description: job.description || '',
        source: 'Indeed',
        requiresDocs: (job.description || '').toLowerCase().includes('resume') || (job.description || '').toLowerCase().includes('cover letter'),
      }));
    console.log(`Fetched ${filteredJobs.length} jobs from Indeed for page ${page}`);
    return filteredJobs;
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn(`Rate limited (429) by Indeed API on page ${page}`);
      throw new Error('429 Rate Limit');
    }
    console.error(`Indeed scraping error on page ${page}:`, error.message);
    return [];
  }
};

const scrapeLinkedInJobs = async (technology, location, companies) => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const query = encodeURIComponent(`${technology || 'software'} ${location || 'United States'}`);
    await page.goto(`https://www.linkedin.com/jobs/search?keywords=${query}&sortBy=DD`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.jobs-search__results-list', { timeout: 10000 });
    const jobs = await page.evaluate((companies) => {
      const jobElements = document.querySelectorAll('.jobs-search__results-list li');
      const jobList = [];
      jobElements.forEach((el) => {
        const companyEl = el.querySelector('.base-search-card__subtitle');
        const company = companyEl?.innerText || '';
        if (company && companies.some((c) => company.toLowerCase().includes(c.toLowerCase()))) {
          const titleEl = el.querySelector('.base-search-card__title');
          const linkEl = el.querySelector('a');
          jobList.push({
            jobId: linkEl?.href.split('?')[0] || `linkedin-${Date.now()}`,
            title: titleEl?.innerText || 'Unknown Title',
            company,
            location: el.querySelector('.job-search-card__location')?.innerText || 'Unknown Location',
            posted: new Date(),
            url: linkEl?.href || '',
            description: '',
            source: 'LinkedIn',
            requiresDocs: true,
          });
        }
      });
      return jobList;
    }, companies);
    await browser.close();
    console.log(`Fetched ${jobs.length} jobs from LinkedIn`);
    return jobs;
  } catch (error) {
    console.error('LinkedIn scraping error:', error.message);
    return [];
  }
};

const fetchRealTimeJobs = async (companies, technology, location, maxRetries = 3) => {
  const jobs = {};
  for (const company of companies) {
    jobs[company] = [];
  }

  // Check database for recent jobs (within last 6 hours)
  const cacheTime = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const cachedJobs = await Job.find({
    company: { $in: companies },
    updatedAt: { $gte: cacheTime },
  }).lean();
  for (const job of cachedJobs) {
    if (companies.includes(job.company)) {
      jobs[job.company].push(job);
    }
  }
  console.log(`Retrieved ${cachedJobs.length} cached jobs from database`);

  // If sufficient cached jobs, return early
  const totalCachedJobs = Object.values(jobs).flat().length;
  if (totalCachedJobs >= companies.length * 2) {
    console.log('Using cached jobs, skipping API calls');
    return jobs;
  }

  const sources = [
    { name: 'Indeed', scraper: scrapeIndeedJobs },
    { name: 'LinkedIn', scraper: scrapeLinkedInJobs },
  ];

  // Batch companies to reduce API calls
  const companyBatches = [];
  for (let i = 0; i < companies.length; i += 5) {
    companyBatches.push(companies.slice(i, i + 5));
  }

  for (const source of sources) {
    for (const batch of companyBatches) {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          console.log(`Fetching jobs from ${source.name} for ${batch.length} companies at ${new Date().toISOString()} - Attempt ${attempt + 1}`);
          let scrapedJobs = [];
          if (source.name === 'Indeed') {
            // Fetch multiple pages for Indeed to maximize results
            for (let page = 1; page <= 2; page++) {
              const pageJobs = await source.scraper(technology, location, batch, page);
              scrapedJobs.push(...pageJobs);
              if (pageJobs.length < 10) break; // Stop if fewer results
              await delay(2000); // Delay between page requests
            }
          } else {
            scrapedJobs = await source.scraper(technology, location, batch);
          }
          for (const job of scrapedJobs) {
            if (batch.includes(job.company)) {
              jobs[job.company].push(job);
              // Store in database
              await Job.updateOne(
                { jobId: job.jobId },
                { $set: job },
                { upsert: true }
              );
            }
          }
          console.log(`Stored ${scrapedJobs.length} jobs from ${source.name} for batch`);
          break; // Success, move to next batch
        } catch (error) {
          if (error.message === '429 Rate Limit' && attempt < maxRetries - 1) {
            const waitTime = (2 ** attempt) * 10000; // Exponential backoff: 10s, 20s, 40s
            console.warn(`Rate limited (429), waiting ${waitTime / 1000} seconds`);
            await delay(waitTime);
            continue;
          }
          console.error(`${source.name} attempt ${attempt + 1} failed:`, error.message);
          if (attempt === maxRetries - 1) {
            console.log(`Max retries reached for ${source.name}, using mock data for batch`);
            for (const company of batch) {
              const mockJob = {
                jobId: `${company}-mock-${Date.now()}`,
                title: `${company} - ${technology || 'Software'} Engineer`,
                company,
                location: location || 'United States',
                posted: new Date(),
                url: `https://${company.toLowerCase()}.com/careers`,
                description: 'Mock job listing',
                source: 'Mock',
                requiresDocs: true,
              };
              jobs[company].push(mockJob);
              await Job.updateOne(
                { jobId: mockJob.jobId },
                { $set: mockJob },
                { upsert: true }
              );
            }
          }
        }
        await delay(5000); // Delay between batches
      }
    }
  }

  return jobs;
};

const autoApplyToJob = async (job, user) => {
  try {
    if (!job.jobId || !job.title || !job.company) {
      console.warn(`Skipping invalid job for ${user.email}:`, job);
      return false;
    }
    console.log(`Auto-applying to ${job.title} at ${job.company} for ${user.email}`);
    const resumePath = user.resumePaths[user.resumePaths.length - 1];
    if (!resumePath) {
      console.warn(`No resume available for ${user.email}`);
      return false;
    }
    console.log(`Using resume: ${resumePath}`);
    if (job.requiresDocs) {
      console.log(`Using LinkedIn: ${user.linkedinProfile || 'Not provided'}, Cover Letter: ${user.coverLetter || 'Not provided'}`);
    }
    await delay(1000); // Simulate application process
    return true;
  } catch (error) {
    console.error(`Auto-apply failed for ${user.email} to ${job.title}:`, error.message);
    return false;
  }
};

const runAutoApplyForUser = async (user) => {
  if (!user.isOtpVerified || !user.resumePaths.length || !user.selectedCompanies.length) {
    console.log(`Skipping auto-apply for ${user.email}: Incomplete setup`);
    return 0;
  }

  console.log(`Starting auto-apply for ${user.email} with ${user.selectedCompanies.length} companies`);
  const jobs = await fetchRealTimeJobs(user.selectedCompanies, user.technology, user.scraperPreferences.location);
  let appliedToday = 0;

  for (const company of user.selectedCompanies) {
    for (const job of jobs[company] || []) {
      const alreadyApplied = user.appliedJobs.some((j) => j.jobId === job.jobId) ||
        (await Job.findOne({ jobId: job.jobId, 'appliedBy.userId': user._id }));
      if (!alreadyApplied) {
        const success = await autoApplyToJob(job, user);
        if (success) {
          user.appliedJobs.push({ jobId: job.jobId, date: new Date() });
          await Job.updateOne(
            { jobId: job.jobId },
            { $push: { appliedBy: { userId: user._id, date: new Date() } } }
          );
          appliedToday++;
          console.log(`Successfully applied to ${job.title} at ${job.company} for ${user.email}`);
        }
      } else {
        console.log(`Skipping already applied job ${job.title} at ${job.company} for ${user.email}`);
      }
    }
  }

  await user.save();
  if (appliedToday > 0) {
    await sendEmail(
      user.email,
      'ZvertexAI Auto-Apply Update',
      getAutoApplyEmail(user.email, user.subscription, user.selectedCompanies)
    );
    console.log(`Sent auto-apply update email to ${user.email} for ${appliedToday} applications`);
  }
  return appliedToday;
};

schedule.scheduleJob('0 0 * * *', async () => {
  console.log('Running daily job scraper at', new Date().toISOString());
  const users = await User.find({ isOtpVerified: true }).lean();
  for (const user of users) {
    const userDoc = await User.findById(user._id);
    if (!dbConnected) {
      console.warn(`Skipping auto-apply for ${user.email}: MongoDB not connected`);
      continue;
    }
    const applied = await runAutoApplyForUser(userDoc);
    console.log(`Applied to ${applied} jobs for ${user.email}`);
    await delay(5000); // Delay between users to avoid overwhelming APIs
  }
});

const getSignupEmail = (email, subscription) => `
  <div style="font-family: Arial, sans-serif; background-color: #F0F8FF; color: #333; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #FFFFFF; border: 1px solid #87CEEB;">
      <tr>
        <td style="background-color: #87CEEB; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">Welcome to ZvertexAI</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${email},</p>
          <p style="font-size: 16px;">Thank you for joining ZvertexAI with your ${subscription} plan. We're excited to help you streamline your job application process.</p>
          <p style="font-size: 16px;">Get started by uploading your resume and selecting companies to auto-apply to.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background-color: #87CEEB; color: #FFFFFF; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Go to Dashboard</a>
          <p style="font-size: 16px; margin-top: 20px;">Best regards,<br>The ZvertexAI Team</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #87CEEB; padding: 10px; text-align: center;">
          <p style="color: #FFFFFF; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} ZvertexAI. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
`;

const getOtpEmail = (email, otp, subscription, phone) => `
  <div style="font-family: Arial, sans-serif; background-color: #F0F8FF; color: #333; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #FFFFFF; border: 1px solid #87CEEB;">
      <tr>
        <td style="background-color: #87CEEB; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">ZvertexAI OTP Verification</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p style="font-size: 16px;">Dear Admin,</p>
          <p style="font-size: 16px;">A new signup request has been received with the following details:</p>
          <ul style="font-size: 16px;">
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Subscription:</strong> ${subscription}</li>
            <li><strong>Phone Number:</strong> ${phone}</li>
          </ul>
          <p style="font-size: 16px;">The OTP for verification is: <strong>${otp}</strong></p>
          <p style="font-size: 16px;">This OTP is valid for 10 minutes. Please provide this code to the user to complete their signup.</p>
          <p style="font-size: 16px;">Best regards,<br>The ZvertexAI Team</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #87CEEB; padding: 10px; text-align: center;">
          <p style="color: #FFFFFF; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} ZvertexAI. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
`;

const getAutoApplyEmail = (email, subscription, companies) => `
  <div style="font-family: Arial, sans-serif; background-color: #F0F8FF; color: #333; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #FFFFFF; border: 1px solid #87CEEB;">
      <tr>
        <td style="background-color: #87CEEB; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">Auto-Apply Activated</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${email},</p>
          <p style="font-size: 16px;">Congratulations! Your auto-apply process with your ${subscription} plan is now active for the following companies:</p>
          <ul style="font-size: 16px;">
            ${companies.map((c) => `<li>${c}</li>`).join('')}
          </ul>
          <p style="font-size: 16px;">We will apply your resume to relevant jobs daily. You can track your applications and update your preferences at any time.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background-color: #87CEEB; color: #FFFFFF; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">View Dashboard</a>
          <p style="font-size: 16px; margin-top: 20px;">Best regards,<br>The ZvertexAI Team</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #87CEEB; padding: 10px; text-align: center;">
          <p style="color: #FFFFFF; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} ZvertexAI. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
`;

const getResetPasswordEmail = (email, resetLink) => `
  <div style="font-family: Arial, sans-serif; background-color: #F0F8FF; color: #333; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #FFFFFF; border: 1px solid #87CEEB;">
      <tr>
        <td style="background-color: #87CEEB; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">Reset Your Password</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${email},</p>
          <p style="font-size: 16px;">We received a request to reset your password. Please click the button below to reset it:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #87CEEB; color: #FFFFFF; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
          <p style="font-size: 16px;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
          <p style="font-size: 16px;">Best regards,<br>The ZvertexAI Team</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #87CEEB; padding: 10px; text-align: center;">
          <p style="color: #FFFFFF; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} ZvertexAI. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
`;

const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    await transporter.sendMail({
      from: `"ZvertexAI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

// API routes
app.get('/api/health', (req, res) => res.status(200).json({ message: 'Server is running', dbConnected }));

app.post('/api/signup', async (req, res) => {
  const { email, password, subscription, phone } = req.body;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    if (!email || !password || !subscription || !phone)
      return res.status(400).json({ message: 'Missing required fields: email, password, subscription, and phone are mandatory' });
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser && existingUser.isOtpVerified)
      return res.status(400).json({ message: 'Email already registered and verified' });
    if (existingUser && !existingUser.isOtpVerified) {
      await User.deleteOne({ email });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, subscription, phone });
    await user.save();
    const otp = generateOtp();
    await OTP.create({ email, otp });
    await sendEmail(
      process.env.COMPANY_EMAIL,
      'ZvertexAI OTP Verification',
      getOtpEmail(email, otp, subscription, phone)
    );
    res.status(200).json({ message: 'OTP sent to company email for verification' });
  } catch (error) {
    console.error('Signup error:', error.message, error.stack);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    if (!email || !otp) return res.status(400).json({ message: 'Missing email or OTP' });
    const otpRecord = await OTP.findOne({ email, otp }).lean();
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isOtpVerified = true;
    await user.save();
    await OTP.deleteOne({ email, otp });
    const token = jwt.sign({ email, subscription: user.subscription, isOtpVerified: true }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    await sendEmail(email, 'Welcome to ZvertexAI', getSignupEmail(email, user.subscription));
    res.status(200).json({ message: 'OTP verified, signup complete', token });
  } catch (error) {
    console.error('OTP verification error:', error.message);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    if (!email || !password) return res.status(400).json({ message: 'Missing required fields' });
    const user = await User.findOne({ email }).lean();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isOtpVerified) {
      return res.status(403).json({ message: 'OTP verification required. Please sign up again.' });
    }
    const token = jwt.sign({ email, subscription: user.subscription, isOtpVerified: true }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isOtpVerified)
      return res.status(403).json({ message: 'Account not verified. Please complete OTP verification.' });
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000);
    await user.save();
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(email, 'Reset Your Password - ZvertexAI', getResetPasswordEmail(email, resetLink));
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Failed to process request', error: error.message });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, resetToken: token });
    if (!user || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
});

app.post('/api/upload-resume', upload, async (req, res) => {
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const token = req.body.token;
    const technology = req.body.technology;
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user || !user.isOtpVerified) return res.status(403).json({ message: 'User not verified' });
    const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
      if (error) throw new Error('Cloudinary upload failed');
      user.resumePaths.push(result.secure_url);
      user.technology = technology || user.technology;
      await user.save();
      res.status(200).json({ message: 'Resume uploaded successfully' });
    }).end(req.file.buffer);
  } catch (error) {
    console.error('Resume upload error:', error.message);
    res.status(500).json({ message: 'Resume upload failed', error: error.message });
  }
});

app.post('/api/select-companies', async (req, res) => {
  const { token, companies } = req.body;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user || !user.isOtpVerified) return res.status(403).json({ message: 'User not verified' });
    user.selectedCompanies = companies || [];
    await user.save();
    const jobs = await fetchRealTimeJobs(companies, user.technology, user.scraperPreferences.location);
    res.status(200).json({ message: 'Companies updated', jobs });
  } catch (error) {
    console.error('Select companies error:', error.message);
    res.status(500).json({ message: 'Failed to update companies', error: error.message });
  }
});

app.post('/api/update-profile', async (req, res) => {
  const { token, linkedinProfile, coverLetter } = req.body;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user || !user.isOtpVerified) return res.status(403).json({ message: 'User not verified' });
    user.linkedinProfile = linkedinProfile || user.linkedinProfile;
    user.coverLetter = coverLetter || user.coverLetter;
    await user.save();
    res.status(200).json({ message: 'Profile updated', linkedinProfile: user.linkedinProfile, coverLetter: user.coverLetter });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

app.post('/api/auto-apply', async (req, res) => {
  const { token, linkedinProfile, coverLetter } = req.body;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user || !user.isOtpVerified) return res.status(403).json({ message: 'User not verified' });
    if (!user.resumePaths.length) return res.status(400).json({ message: 'No resume uploaded' });
    if (!user.selectedCompanies.length) return res.status(400).json({ message: 'No companies selected' });
    // Update profile only if new details are provided
    if (linkedinProfile) user.linkedinProfile = linkedinProfile;
    if (coverLetter) user.coverLetter = coverLetter;
    const appliedToday = await runAutoApplyForUser(user);
    await user.save();
    res.status(200).json({ message: `Auto-applied to ${appliedToday} jobs`, appliedToday });
  } catch (error) {
    console.error('Auto-apply error:', error.message);
    res.status(500).json({ message: 'Auto-apply failed', error: error.message });
  }
});

app.post('/api/update-scraper-preferences', async (req, res) => {
  const { token, jobBoards, frequency, location } = req.body;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user || !user.isOtpVerified) return res.status(403).json({ message: 'User not verified' });
    user.scraperPreferences.jobBoards = jobBoards || user.scraperPreferences.jobBoards;
    user.scraperPreferences.frequency = frequency || user.scraperPreferences.frequency;
    user.scraperPreferences.location = location || user.scraperPreferences.location;
    await user.save();
    res.status(200).json({ message: 'Scraper preferences updated', preferences: user.scraperPreferences });
  } catch (error) {
    console.error('Update scraper preferences error:', error.message);
    res.status(500).json({ message: 'Failed to update preferences', error: error.message });
  }
});

app.get('/api/jobs', async (req, res) => {
  const { token } = req.headers.authorization?.split(' ')[1] ? { token: req.headers.authorization.split(' ')[1] } : req.query;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user || !user.isOtpVerified) return res.status(403).json({ message: 'User not verified' });
    const jobs = await Job.find({
      company: { $in: user.selectedCompanies },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ posted: -1 }).lean();
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Fetch jobs error:', error.message);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
});

// New Dashboard endpoint
app.get('/api/dashboard', async (req, res) => {
  const { token } = req.headers.authorization?.split(' ')[1] ? { token: req.headers.authorization.split(' ')[1] } : req.query;
  try {
    if (!dbConnected) return res.status(503).json({ message: 'Database not connected' });
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).lean();
    if (!user || !user.isOtpVerified) return res.status(403).json({ message: 'User not verified' });
    const jobsAppliedCount = user.appliedJobs ? user.appliedJobs.length : 0;
    res.status(200).json({
      message: 'Dashboard data retrieved',
      user: {
        email: user.email,
        subscription: user.subscription,
        phone: user.phone,
        resumePaths: user.resumePaths,
        linkedinProfile: user.linkedinProfile,
        coverLetter: user.coverLetter,
        technology: user.technology,
        selectedCompanies: user.selectedCompanies,
        jobsAppliedCount,
        scraperPreferences: user.scraperPreferences,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve dashboard data', error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});