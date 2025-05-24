const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Blog'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, 'Comment cannot be empty']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema); 