const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// Trust reverse proxy (Render, Vercel, Heroku) so secure cookies and req.protocol work over HTTPS
app.set('trust proxy', 1);

// ─── Middleware ────────────────────────────────────────────────────────────────

// Allow requests from frontend domains with credentials (for cookies)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin server calls)
    if (!origin) return callback(null, true);

    // Check CLIENT_URL environment variable (supports comma-separated origins)
    if (process.env.CLIENT_URL) {
      const configuredUrls = process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''));
      const normalizedOrigin = origin.replace(/\/$/, '');
      if (configuredUrls.includes(normalizedOrigin)) {
        return callback(null, true);
      }
    }

    // Allow common hosting platforms and localhost development
    const allowedPatterns = ['localhost', '127.0.0.1', 'vercel.app', 'onrender.com', 'netlify.app', 'github.io'];
    const isAllowed = allowedPatterns.some((pattern) => origin.includes(pattern));

    if (isAllowed) {
      return callback(null, true);
    }

    // Disallow without throwing a 500 error
    return callback(null, false);
  },
  credentials: true, // Required to allow cookies to be sent/received
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Parse cookies (needed to read the httpOnly refresh token cookie)
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Handle 404 — route not found
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
// Must be LAST — after all routes
app.use(errorHandler);

module.exports = app;
