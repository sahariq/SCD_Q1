const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

// Add a comment (protected)
exports.addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { blogId, content } = req.body;
    const comment = new Comment({
      blogId,
      userId: req.user.id,
      username: req.user.username,
      content
    });
    await comment.save();
    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
};

// Get comments by blogId (public)
exports.getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
}; 