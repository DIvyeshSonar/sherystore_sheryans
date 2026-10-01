require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { autoSeedDB } = require('./seed');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the HTTP server
const startServer = async () => {
  await connectDB();
  
  // Automatically seed database if it's empty
  await autoSeedDB();

  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Shery App Backend Server             ║
║   Running on: http://localhost:${PORT}   ║
║   Environment: ${process.env.NODE_ENV}          ║
╚════════════════════════════════════════╝
    `);
  });
};

startServer();
