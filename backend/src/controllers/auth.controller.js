const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

// Helper: Set the refresh token as an httpOnly cookie
const setRefreshTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,       // Not accessible via JavaScript — prevents XSS
    secure: isProduction, // Must be true when sameSite is 'none' in production
    sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin cookies in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// POST /api/auth/register
// Creates a new user account
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: String(email).toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Create the user (password is hashed in the pre-save hook in User.js)
    const user = await User.create({ name, email, password });

    // Return the user without password — do NOT return tokens on register
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
// Authenticates a user and returns tokens
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    const invalidCredentialsError = {
      success: false,
      message: 'Invalid email or password',
    };

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find the user (include password for comparison)
    const user = await User.findOne({ email: String(email).toLowerCase() });

    if (!user) {
      return res.status(401).json(invalidCredentialsError);
    }

    // Compare the plain-text password with the stored bcrypt hash
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json(invalidCredentialsError);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store the refresh token in the database so we can revoke it on logout
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Send refresh token as a secure httpOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    // Send access token in the response body
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/refresh-token
// Issues a new access token using the refresh token from the cookie
const refreshToken = async (req, res, next) => {
  try {
    // Read the refresh token from the httpOnly cookie
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found',
      });
    }

    // Verify the token signature and expiry
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    // Find the user and verify the stored token matches (prevents reuse after logout)
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== token) {
      // Token reuse detected or user not found — force re-login
      return res.status(403).json({
        success: false,
        message: 'Refresh token is invalid or has been revoked',
      });
    }

    // Generate a brand-new access token
    const newAccessToken = generateAccessToken(user._id);

    // Optionally rotate the refresh token for extra security
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
// Invalidates the refresh token and clears the cookie
const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      // Find the user and remove the stored refresh token
      await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: null }
      );
    }

    // Clear the httpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
// Returns the currently authenticated user's profile
const getMe = async (req, res, next) => {
  try {
    // req.user is already attached by the authenticate middleware
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, logout, getMe };
