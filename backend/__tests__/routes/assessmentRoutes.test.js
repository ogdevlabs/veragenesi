const request = require('supertest');
const express = require('express');

jest.mock('../../src/middleware/authMiddleware', () => (req, res, next) => {
  req.userId = 1;
  next();
});

jest.mock('../../src/services/assessmentService');
jest.mock('../../src/services/authService');
const AssessmentService = require('../../src/services/assessmentService');
const AuthService = require('../../src/services/authService');
const errorHandler = require('../../src/middleware/errorHandler');
const assessmentRoutes = require('../../src/routes/assessmentRoutes');

const app = express();
app.use(express.json());
app.use('/assessments', assessmentRoutes);
app.use(errorHandler);

describe('POST /assessments/archetype', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 with primary/secondary on valid 7-answer submission', async () => {
    AssessmentService.scoreArchetypeQuiz.mockReturnValueOnce({
      primary: { id: 1, name: 'Protector' },
      secondary: [{ id: 2 }, { id: 3 }],
    });
    AssessmentService.storeArchetypeAssessment.mockResolvedValueOnce({ id: 1 });
    AuthService.updateArchetype.mockResolvedValueOnce({ id: 1 });

    const res = await request(app)
      .post('/assessments/archetype')
      .send({ answers: [3, 4, 2, 5, 1, 3, 4] });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('primary');
    expect(res.body).toHaveProperty('secondary');
  });

  it('400 when answers count is not 7', async () => {
    const res = await request(app)
      .post('/assessments/archetype')
      .send({ answers: [1, 2, 3] });

    expect(res.status).toBe(400);
  });

  it('400 when answers is missing', async () => {
    const res = await request(app)
      .post('/assessments/archetype')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('POST /assessments/ei-baseline', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 with EI results on valid 16-answer submission', async () => {
    const eiResult = { autoconciencia: 80, autogestion: 70 };
    AssessmentService.scoreEIBaseline.mockReturnValueOnce(eiResult);
    AssessmentService.storeEIAssessment.mockResolvedValueOnce({ id: 5 });

    const res = await request(app)
      .post('/assessments/ei-baseline')
      .send({ answers: Array(16).fill(4) });

    expect(res.status).toBe(200);
    expect(res.body.autoconciencia).toBe(80);
  });

  it('400 when answers count is not 16', async () => {
    const res = await request(app)
      .post('/assessments/ei-baseline')
      .send({ answers: Array(10).fill(3) });

    expect(res.status).toBe(400);
  });
});

describe('GET /assessments/:type', () => {
  beforeEach(() => jest.clearAllMocks());

  it('200 with assessment data when it exists', async () => {
    AssessmentService.getLatestAssessment.mockResolvedValueOnce({
      assessment_type: 'archetype',
      results: { primary: { id: 1 } },
      created_at: new Date().toISOString(),
    });

    const res = await request(app).get('/assessments/archetype');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('archetype');
  });

  it('404 when assessment does not exist', async () => {
    AssessmentService.getLatestAssessment.mockResolvedValueOnce(null);

    const res = await request(app).get('/assessments/archetype');
    expect(res.status).toBe(404);
  });

  it('400 for invalid assessment type', async () => {
    const res = await request(app).get('/assessments/invalid-type');
    expect(res.status).toBe(400);
  });
});
