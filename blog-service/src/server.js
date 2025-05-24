require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const blogController = require('./controllers/blogController');
const { verifyToken } = require('./middleware/auth');
const { blogValidation, commentValidation } = require('./middleware/validator');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies

// Public routes
app.get('/api/blogs', blogController.getBlogs);
app.get('/api/blogs/:id', blogController.getBlog);

// Protected routes
app.post('/api/blogs', verifyToken, blogValidation, blogController.createBlog);
app.put('/api/blogs/:id', verifyToken, blogValidation, blogController.updateBlog);
app.delete('/api/blogs/:id', verifyToken, blogController.deleteBlog);
app.post('/api/blogs/:id/comments', verifyToken, commentValidation, blogController.addComment);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Readiness check endpoint
app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Blog service running on port ${PORT}`);
}); 