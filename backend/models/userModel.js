const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    default: null,
  },
  lastCommunityJoinDate: {
    type: Date,
    default: null,
  },
  address: {
    type: String,
    // Optional field, uncomment if required
    // required: false,
  },
  location: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  profilePicture: {
    filePath: { type: String },
    url: { type: String },
  },
  savedListings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  }],
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  // New fields for password reset
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

// Middleware to hash the password before saving the user
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
