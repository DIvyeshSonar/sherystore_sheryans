const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Password is stored as a bcrypt hash — NEVER plain text
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    // User role — 'user' (default) or 'admin'
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // We store the refresh token (or its hash) so we can revoke it on logout
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Before saving, hash the password if it was modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Use at least 10 salt rounds as required by the assignment
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Helper method to compare a plain-text password with the stored hash
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Helper to get a safe user object (without sensitive fields)
userSchema.methods.toSafeObject = function () {
  const { password, refreshToken, ...safeUser } = this.toObject();
  return safeUser;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
