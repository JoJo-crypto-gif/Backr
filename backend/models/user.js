// models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  avatar: { type: String, default: '/uploads/avatar/default.jpg' },
  bio: { type: String, default: '' },
  address: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  balance: { type: Number, default: 0 },
  password: { type: String, required: false },

  // New fields for verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['not applied', 'pending', 'approved', 'denied'],
    default: 'not applied'
  },
  ghanaCardNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  ghanaCardImage: {
    type: String
  },
  verificationReason: {
    type: String
  }
}, { timestamps: true }); // Adding timestamps is a good practice

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Set ghanaCardNumber to undefined if it's an empty string or null to work with sparse index
  if (this.ghanaCardNumber === '' || this.ghanaCardNumber === null) {
    this.ghanaCardNumber = undefined;
  }
  
  next();
});

module.exports = mongoose.model('user', userSchema);