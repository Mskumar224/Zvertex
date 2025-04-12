const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'https://zvertexai.com', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'x-auth-token'] }));
app.use(express.json());
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'Uploads', 'resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

app.use('/api/jobs', (req, res, next) => {
  console.log(`Jobs route hit: ${req.method} ${req.originalUrl}`);
  next();
});

try {
  console.log('Loading auth routes...');
  app.use('/api/auth', require('./routes/auth'));
  console.log('Loading jobs routes...');
  const jobsRouter = require('./routes/jobs');
  console.log('Jobs routes loaded:', jobsRouter.stack.map(r => r.route?.path).filter(Boolean));
  app.use('/api/jobs', jobsRouter);
  console.log('Routes loaded successfully.');
} catch (err) {
  console.error('Error loading routes:', err.message, err.stack);
}

app.get('/api/jobs/test', (req, res) => {
  console.log('Test route hit: GET /api/jobs/test');
  res.json({ msg: 'Jobs router is working' });
});

app.use((req, res) => {
  console.log(`404 Error: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ msg: `Route not found: ${req.method} ${req.originalUrl}` });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));