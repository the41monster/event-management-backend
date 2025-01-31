require('dotenv').config();
const request = require('supertest');
const app = require('../app'); // Assuming you have an Express app in app.js
const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

describe('Event Controller', () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = new User({ username: 'organizer', email: 'organizer@example.com', password: await bcrypt.hash('password', 5), role: 'organizer' }); // Use lower salt rounds
    await user.save();
    token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Event.deleteMany({});
    await User.deleteMany({ email: 'organizer@example.com' }); // Clear the user collection before each test
  });

  it('should create a new event', async () => {
    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Event', date: new Date(), description: 'Test Description' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Event created successfully');
  });

  it('should get all events', async () => {
    const event = new Event({ name: 'Test Event', date: new Date(), description: 'Test Description', participants: [] });
    await event.save();

    const res = await request(app)
      .get('/events')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should register a participant for an event', async () => {
    const event = new Event({ name: 'Test Event', date: new Date(), description: 'Test Description', participants: [] });
    await event.save();

    const res = await request(app)
      .post(`/events/${event._id}/register`)
      .set('Authorization', `Bearer ${token}`) // Ensure the token is set
      .send({ participantName: 'John Doe', participantEmail: 'john@example.com' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Participant registered successfully');
  }, 10000); // Increase timeout to 10000 ms
});
