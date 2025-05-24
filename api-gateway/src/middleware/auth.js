const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.verifyToken = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
    try {
      // Verify token
      jwt.verify(token, process.env.JWT_SECRET);
      // Get user data from auth service
      const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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