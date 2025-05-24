require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const { verifyToken } = require('./middleware/auth');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Forward requests to auth service
app.use('/api/auth', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.AUTH_SERVICE_URL}${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ message: 'Error forwarding request to auth service' });
  }
});

// Forward requests to blog service
app.use('/api/blogs', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.BLOG_SERVICE_URL}${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ message: 'Error forwarding request to blog service' });
  }
});

// Forward requests to comment service
app.use('/api/comments', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.COMMENT_SERVICE_URL}${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ message: 'Error forwarding request to comment service' });
  }
});

// Forward requests to profile service
app.use('/api/profile', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${process.env.PROFILE_SERVICE_URL}${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ message: 'Error forwarding request to profile service' });
  }
});

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

// Start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
}); 