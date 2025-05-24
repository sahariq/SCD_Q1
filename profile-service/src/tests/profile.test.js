const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');

describe('Profile Service Tests', () => {
  let authToken;
  let otherUserToken;
  let testProfileId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Simulate login to get JWT token for main user
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;

    // Simulate login to get JWT token for another user
    const otherLoginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'other@example.com',
        password: 'password123'
      });
    
    otherUserToken = otherLoginResponse.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /profile', () => {
    it('should fetch profile data successfully', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toBe('test@example.com');
      
      testProfileId = response.body._id;
    });
  });

  describe('PUT /profile/:id', () => {
    it('should allow user to update their own profile', async () => {
      const response = await request(app)
        .put(`/profile/${testProfileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          bio: 'Updated bio'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.bio).toBe('Updated bio');
    });

    it('should reject update of another user\'s profile', async () => {
      const response = await request(app)
        .put(`/profile/${testProfileId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({
          name: 'Malicious Update',
          bio: 'Malicious bio'
        });

      expect(response.status).toBe(403);
    });
  });
}); 