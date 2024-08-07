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
    // required: ,
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
    url: { type: String }
  },
  savedListings: 
    [ {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',}
      
    ]
  
});

const User =   mongoose.model('User', UserSchema);

module.exports = User;
