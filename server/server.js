const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('winston');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const zgptRoutes = require('./routes/zgpt');

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

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost/zvertexai', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info(`${new Date().toISOString()} - MongoDB Connected`))
  .catch((err) => {
    logger.error(`${new Date().toISOString()} - MongoDB Connection Failed: ${err.message}`);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/zgpt', zgptRoutes);

// Serve static files (client build)
const staticPath = path.join(__dirname, '../../client/build');
app.use(express.static(staticPath));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  logger.info(`${new Date().toISOString()} - Server running on port ${PORT}`);
});