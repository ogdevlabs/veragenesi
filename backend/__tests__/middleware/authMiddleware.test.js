const jwt = require('jsonwebtoken');

// Mock AuthService before requiring middleware
jest.mock('../../src/services/authService');
const AuthService = require('../../src/services/authService');
const authMiddleware = require('../../src/middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

// Helper: build minimal req/res/next
const makeReq = (authHeader) => ({ headers: { authorization: authHeader } });
const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const makeNext = () => jest.fn();

describe('authMiddleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when Authorization header is missing', async () => {
    const req = makeReq(undefined);
    const res = makeRes();
    const next = makeNext();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Missing or invalid') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header does not start with Bearer', async () => {
    const req = makeReq('Basic abc123');
    const res = makeRes();
    const next = makeNext();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and sets req.userId when token is valid', async () => {
    AuthService.verifyToken.mockResolvedValueOnce({ userId: 42, email: 'u@test.com' });

    const req = makeReq('Bearer valid.token.here');
    const res = makeRes();
    const next = makeNext();

    await authMiddleware(req, res, next);

    expect(AuthService.verifyToken).toHaveBeenCalledWith('valid.token.here');
    expect(req.userId).toBe(42);
    expect(req.userEmail).toBe('u@test.com');
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 401 when AuthService.verifyToken throws (invalid token)', async () => {
    AuthService.verifyToken.mockRejectedValueOnce(new Error('Invalid token'));

    const req = makeReq('Bearer bad.token');
    const res = makeRes();
    const next = makeNext();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Invalid or expired') })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
