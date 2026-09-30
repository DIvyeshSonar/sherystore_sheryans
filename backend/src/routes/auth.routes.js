const express = require('express');
const router = express.Router();

const { register, login, refreshToken, logout, getMe } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const { authenticate } = require('../middleware/auth.middleware');

// POST /api/auth/register — Public
router.post('/register', registerValidator, register);

// POST /api/auth/login — Public
router.post('/login', loginValidator, login);

// POST /api/auth/refresh-token — Requires valid refresh token in cookie
router.post('/refresh-token', refreshToken);

// POST /api/auth/logout — Authenticated
router.post('/logout', logout);

// GET /api/auth/me — Authenticated (requires valid access token)
router.get('/me', authenticate, getMe);

module.exports = router;
