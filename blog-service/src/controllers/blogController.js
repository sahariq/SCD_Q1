const Blog = require('../models/Blog');
const { validationResult } = require('express-validator');

// Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      blogs: blogs.map(blog => blog.getPublicBlog())
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};

// Get single blog
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.user', 'username');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({
      blog: blog.getPublicBlog()
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Error fetching blog' });
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags, status } = req.body;

    const blog = new Blog({
      title,
      content,
      tags,
      status,
      author: req.user.id
    });

    await blog.save();

    res.status(201).json({
      message: 'Blog created successfully',
      blog: blog.getPublicBlog()
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Error creating blog' });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags, status } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (!blog.isAuthor(req.user.id)) {
      return res.status(403).json({ 
        message: 'You are not authorized to update this blog' 
      });
    }

    // Update blog
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.status = status || blog.status;

    await blog.save();

    res.status(200).json({
      message: 'Blog updated successfully',
      blog: blog.getPublicBlog()
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Error updating blog' });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (!blog.isAuthor(req.user.id)) {
      return res.status(403).json({ 
        message: 'You are not authorized to delete this blog' 
      });
    }

    await blog.remove();

    res.status(200).json({
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Error deleting blog' });
  }
};

// Add comment to blog
exports.addComment = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.comments.push({
      user: req.user.id,
      content
    });

    await blog.save();

    res.status(201).json({
      message: 'Comment added successfully',
      blog: blog.getPublicBlog()
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
}; 