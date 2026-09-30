/**
 * make-admin.js
 * 
 * One-time script to grant admin role to a user by email.
 * 
 * Usage:
 *   node make-admin.js your@email.com
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('./src/models/User');

const email = process.argv[2];
if (!email) {
  console.error('❌  Usage: node make-admin.js <email>');
  process.exit(1);
}

async function run() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shery_app';
    await mongoose.connect(uri);
    console.log('✅  Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.error(`❌  No user found with email: ${email}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    console.log(`✅  "${user.name}" (${user.email}) is now an ADMIN.`);
  } catch (err) {
    console.error('❌  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
