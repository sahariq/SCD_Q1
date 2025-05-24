const jwt = require('jsonwebtoken');
const axios = require('axios');

// Verify JWT token and get user data from auth service
exports.verifyToken = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user data from auth service
      const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Add user to request object
      req.user = response.data.user;
      next();
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is the author of the blog
exports.isAuthor = async (req, res, next) => {
  try {
    const blog = await req.blog;
    if (!blog.isAuthor(req.user.id)) {
      return res.status(403).json({ 
        message: 'You are not authorized to perform this action' 
      });
    }
    next();
  } catch (error) {
    console.error('Author check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 