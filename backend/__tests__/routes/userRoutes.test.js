const request = require('supertest');
const express = require('express');

jest.mock('../../src/middleware/authMiddleware', () => (req, res, next) => {
  req.userId = 1;
  next();
});

jest.mock('../../src/services/authService');
jest.mock('../../src/services/toolService');
const AuthService = require('../../src/services/authService');
const ToolService = require('../../src/services/toolService');
const errorHandler = require('../../src/middleware/errorHandler');
const userRoutes = require('../../src/routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/user', userRoutes);
app.use('/resources', userRoutes);
app.use(errorHandler);

describe('GET /user/profile', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 with user and toolStats', async () => {
    AuthService.getUserById.mockResolvedValueOnce({
      id: 1, email: 'u@test.com', firstName: 'Uma',
    });
    ToolService.getUserToolStats.mockResolvedValueOnce({
      totalToolUses: 3, toolBreakdown: [], overallAvgMoodDelta: '1.00',
    });

    const res = await request(app).get('/user/profile');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('toolStats');
  });

  it('404 when user is not found', async () => {
    AuthService.getUserById.mockRejectedValueOnce(new Error('User not found'));

    const res = await request(app).get('/user/profile');
    expect(res.status).toBe(404);
  });
});

describe('GET /resources/emergency', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 with resources array', async () => {
    ToolService.getEmergencyResources.mockReturnValueOnce({
      resources: [{ country: 'MX', name: 'SAPTEL', number: '55-5259-8121' }],
    });

    const res = await request(app).get('/resources/emergency');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.resources)).toBe(true);
  });
});
