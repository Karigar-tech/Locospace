const mongoose = require('mongoose');


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
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
  preferences: [{ type: String }],
});

const User =   mongoose.model('User', UserSchema);

module.exports = User;
