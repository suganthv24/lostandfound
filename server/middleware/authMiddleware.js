const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route. No token provided.' });
    }

    // Verify token
    // Note: process.env.JWT_SECRET should be defined in .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development');

    // Fetch the user from the database and attach to req.user
    // We exclude the password for security
    const currentUser = await User.findById(decoded.id).select('-password');
    
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists.' });
    }

    // Attach user to request
    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized. Token is invalid or expired.' });
  }
};

module.exports = authMiddleware;
