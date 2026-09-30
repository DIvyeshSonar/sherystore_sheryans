const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

// Middleware: Reads the Bearer token from the Authorization header,
// verifies it, and attaches the authenticated user to req.user
const authenticate = async (req, res, next) => {
  try {
    // Check for the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    // Extract the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Verify the token using the ACCESS_TOKEN_SECRET
    const payload = verifyAccessToken(token);

    // Find the user in the database
    const user = await User.findById(payload.userId).select('-password -refreshToken');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach the authenticated user to the request object
    req.user = user;
    next();
  } catch (error) {
    // Handle expired or invalid tokens
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token has expired',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid access token',
    });
  }
};

// Middleware: Ensures the authenticated user has the 'admin' role.
// Must be used AFTER the authenticate middleware.
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin only',
    });
  }
  next();
};

module.exports = { authenticate, requireAdmin };
