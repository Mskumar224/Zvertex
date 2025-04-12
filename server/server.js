const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'Uploads', 'resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/jobs', require('./routes/jobs'));
} catch (err) {
  console.error('Error loading routes:', err.message);
}

// Catch-all for 404 errors
app.use((req, res) => {
  console.log(`404 Error: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ msg: `Route not found: ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));