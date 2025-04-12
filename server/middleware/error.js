// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation error', errors: err.errors });
    }
  
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({ msg: 'Duplicate key error', field: Object.keys(err.keyValue)[0] });
    }
  
    if (err.message.includes('Only PDF files are allowed')) {
      return res.status(400).json({ msg: err.message });
    }
  
    // Default to 500 for unhandled errors
    res.status(500).json({ msg: 'Server error', error: err.message });
  };
  
  module.exports = errorHandler;