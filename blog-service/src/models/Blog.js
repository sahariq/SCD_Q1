const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters long']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better search performance
blogSchema.index({ title: 'text', content: 'text' });

// Method to check if user is the author
blogSchema.methods.isAuthor = function(userId) {
  return this.author.toString() === userId.toString();
};

// Method to get public blog data
blogSchema.methods.getPublicBlog = function() {
  const blog = this.toObject();
  return {
    id: blog._id,
    title: blog.title,
    content: blog.content,
    author: blog.author,
    tags: blog.tags,
    status: blog.status,
    likes: blog.likes.length,
    comments: blog.comments.map(comment => ({
      id: comment._id,
      content: comment.content,
      user: comment.user,
      createdAt: comment.createdAt
    })),
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt
  };
};

module.exports = mongoose.model('Blog', blogSchema); 