const jwt = require('jsonwebtoken');
require('dotenv').config();

// Logging function
const log = (message, data = {}) => {
  console.log(`${new Date().toISOString()} - ${message}`, JSON.stringify(data, null, 2));
};

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    log('Auth middleware: No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    log('Auth middleware: Token verified', { userId: decoded.id });
    next();
  } catch (err) {
    log('Auth middleware: Invalid token', { error: err.message });
    res.status(401).json({ msg: 'Token is not valid' });
  }
};