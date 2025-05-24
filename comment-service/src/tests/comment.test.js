const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');

describe('Comment Service Tests', () => {
  let authToken;
  let testBlogId = 'test-blog-id'; // This would be a real blog ID in integration tests

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Simulate login to get JWT token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /comments', () => {
    it('should create a new comment with valid token', async () => {
      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          blogId: testBlogId,
          content: 'This is a test comment'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.content).toBe('This is a test comment');
    });

    it('should reject comment creation without token', async () => {
      const response = await request(app)
        .post('/comments')
        .send({
          blogId: testBlogId,
          content: 'This is a test comment'
        });

      expect(response.status).toBe(401);
    });
  });
}); 