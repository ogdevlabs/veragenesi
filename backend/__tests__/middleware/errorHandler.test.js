const errorHandler = require('../../src/middleware/errorHandler');

// Helper: build minimal res/next
const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const makeReqRes = () => ({ req: {}, res: makeRes(), next: jest.fn() });

describe('errorHandler', () => {
  const OLD_ENV = process.env.NODE_ENV;
  afterAll(() => { process.env.NODE_ENV = OLD_ENV; });

  it('returns 401 for "Invalid credentials"', () => {
    const { req, res, next } = makeReqRes();
    errorHandler(new Error('Invalid credentials'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ message: 'Invalid email or password' }) })
    );
  });

  it('returns 409 for "User already exists"', () => {
    const { req, res, next } = makeReqRes();
    errorHandler(new Error('User already exists'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('returns 404 for "User not found"', () => {
    const { req, res, next } = makeReqRes();
    errorHandler(new Error('User not found'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 401 for messages containing "Invalid token"', () => {
    const { req, res, next } = makeReqRes();
    errorHandler(new Error('Invalid token: expired'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ message: 'Invalid or expired token' }) })
    );
  });

  it('returns 400 for EI assessment answer count error', () => {
    const { req, res, next } = makeReqRes();
    errorHandler(new Error('EI assessment requires exactly 16 answers'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for "Invalid tool ID"', () => {
    const { req, res, next } = makeReqRes();
    errorHandler(new Error('Invalid tool ID'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for mood range error', () => {
    const { req, res, next } = makeReqRes();
    errorHandler(new Error('Mood values must be between 0 and 10'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 500 for unrecognised errors', () => {
    const { req, res, next } = makeReqRes();
    errorHandler(new Error('Something unexpected'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ message: 'Internal server error' }) })
    );
  });

  it('includes error details in development mode', () => {
    process.env.NODE_ENV = 'development';
    const { req, res, next } = makeReqRes();
    errorHandler(new Error('kaboom'), req, res, next);
    const body = res.json.mock.calls[0][0];
    expect(body.error.details).toBe('kaboom');
    process.env.NODE_ENV = OLD_ENV;
  });

  it('omits error details in non-development mode', () => {
    process.env.NODE_ENV = 'production';
    const { req, res, next } = makeReqRes();
    errorHandler(new Error('secret'), req, res, next);
    const body = res.json.mock.calls[0][0];
    expect(body.error.details).toBeUndefined();
  });
});
