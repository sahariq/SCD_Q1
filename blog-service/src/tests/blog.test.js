const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');

describe('Blog Service Tests', () => {
  let authToken;
  let testBlogId;

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

  describe('POST /blogs', () => {
    it('should create a new blog post with valid token', async () => {
      const response = await request(app)
        .post('/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Blog',
          content: 'This is a test blog post',
          tags: ['test', 'blog']
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe('Test Blog');
      
      testBlogId = response.body._id;
    });

    it('should reject blog creation without token', async () => {
      const response = await request(app)
        .post('/blogs')
        .send({
          title: 'Test Blog',
          content: 'This is a test blog post',
          tags: ['test', 'blog']
        });

      expect(response.status).toBe(401);
    });
  });
}); 