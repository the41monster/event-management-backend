require('dotenv').config();
const request = require('supertest');
const app = require('../app'); // Assuming you have an Express app in app.js
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

describe('Auth Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  }, 10000); // Increase timeout to 10000 ms

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password', role: 'attendee' }); // Send plain password
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  }, 10000); // Increase timeout to 10000 ms

  it('should login an existing user', async () => {
    const user = new User({ username: 'testuser', email: 'test@example.com', password: await bcrypt.hash('password', 5), role: 'attendee' }); // Use lower salt rounds
    await user.save();

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
