const request = require('supertest');
const express = require('express');

// Mock auth middleware — bypass token verification for route tests
jest.mock('../../src/middleware/authMiddleware', () => (req, res, next) => {
  req.userId = 1;
  next();
});

jest.mock('../../src/services/toolService');
const ToolService = require('../../src/services/toolService');
const errorHandler = require('../../src/middleware/errorHandler');
const toolRoutes = require('../../src/routes/toolRoutes');

const app = express();
app.use(express.json());
app.use('/tools', toolRoutes);
app.use(errorHandler);

describe('POST /tools/usage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('201 with usage record on success', async () => {
    ToolService.recordToolUsage.mockResolvedValueOnce({
      id: 10, toolId: 'calm_breath', moodDelta: 2,
    });

    const res = await request(app)
      .post('/tools/usage')
      .send({ toolId: 'calm_breath', durationSeconds: 120, beforeMood: 4, afterMood: 6 });

    expect(res.status).toBe(201);
    expect(res.body.toolId).toBe('calm_breath');
  });

  it('400 when toolId is missing', async () => {
    const res = await request(app)
      .post('/tools/usage')
      .send({ durationSeconds: 60, beforeMood: 5, afterMood: 7 });

    expect(res.status).toBe(400);
  });

  it('400 when service throws "Invalid tool ID"', async () => {
    ToolService.recordToolUsage.mockRejectedValueOnce(new Error('Invalid tool ID'));

    const res = await request(app)
      .post('/tools/usage')
      .send({ toolId: 'bad_tool', durationSeconds: 60, beforeMood: 5, afterMood: 7 });

    expect(res.status).toBe(400);
  });
});

describe('GET /tools/list', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 with tools array', async () => {
    ToolService.getToolsList.mockReturnValueOnce([
      { id: 'calm_breath', name: 'Calm Breath', category: 'stress' },
    ]);

    const res = await request(app).get('/tools/list');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tools)).toBe(true);
  });
});

describe('GET /tools/stats', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 with stats object', async () => {
    ToolService.getUserToolStats.mockResolvedValueOnce({
      totalToolUses: 5, toolBreakdown: [], overallAvgMoodDelta: '1.50',
    });

    const res = await request(app).get('/tools/stats');
    expect(res.status).toBe(200);
    expect(res.body.totalToolUses).toBe(5);
  });
});
