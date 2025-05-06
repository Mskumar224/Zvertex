const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    console.error('Auth middleware: No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id; // Attach user ID to request
    next();
  } catch (error) {
    console.error('Auth middleware: Invalid token', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;