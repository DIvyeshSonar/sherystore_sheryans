const jwt = require('jsonwebtoken');

const getAccessTokenSecret = () => process.env.ACCESS_TOKEN_SECRET || 'shery_default_access_secret_key_2026';
const getRefreshTokenSecret = () => process.env.REFRESH_TOKEN_SECRET || 'shery_default_refresh_secret_key_2026';

// Generate a short-lived access token (10–15 minutes)
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    getAccessTokenSecret(),
    { expiresIn: '15m' }
  );
};

// Generate a long-lived refresh token (7 days)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    getRefreshTokenSecret(),
    { expiresIn: '7d' }
  );
};

// Verify an access token and return the payload or throw an error
const verifyAccessToken = (token) => {
  return jwt.verify(token, getAccessTokenSecret());
};

// Verify a refresh token and return the payload or throw an error
const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshTokenSecret());
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
