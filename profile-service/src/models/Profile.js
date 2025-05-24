const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  bio: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  social: {
    twitter: String,
    facebook: String,
    linkedin: String,
    github: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema); 