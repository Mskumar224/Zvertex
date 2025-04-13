const jwt = require('jsonwebtoken');
const logger = require('winston');

module.exports = async (req, res, next) => {
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