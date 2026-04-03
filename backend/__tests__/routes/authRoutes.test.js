const request = require('supertest');
const express = require('express');

jest.mock('../../src/services/authService');
const AuthService = require('../../src/services/authService');
const errorHandler = require('../../src/middleware/errorHandler');

const authRoutes = require('../../src/routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use(errorHandler);

describe('POST /auth/register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('201 with token and user on success', async () => {
    AuthService.register.mockResolvedValueOnce({
      token: 'tok123',
      user: { id: 1, email: 'a@b.com', firstName: 'Ana' },
    });

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'a@b.com', firstName: 'Ana', password: 'pass123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token', 'tok123');
  });

  it('400 when email is missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ password: 'pass123' });

    expect(res.status).toBe(400);
  });

  it('400 when password is missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'a@b.com' });

    expect(res.status).toBe(400);
  });

  it('409 when service throws "User already exists"', async () => {
    AuthService.register.mockRejectedValueOnce(new Error('User already exists'));

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'dup@b.com', password: 'pass' });

    expect(res.status).toBe(409);
  });
});

describe('POST /auth/login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 with token on valid credentials', async () => {
    AuthService.login.mockResolvedValueOnce({
      token: 'tok456',
      user: { id: 2, email: 'b@b.com', firstName: 'Bob' },
    });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'b@b.com', password: 'pass' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('400 when email or password missing', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'b@b.com' });

    expect(res.status).toBe(400);
  });

  it('401 when service throws "Invalid credentials"', async () => {
    AuthService.login.mockRejectedValueOnce(new Error('Invalid credentials'));

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'x@x.com', password: 'wrong' });

    expect(res.status).toBe(401);
  });
});
