const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the database pool before requiring the service
const mockQuery = jest.fn();
jest.mock('../../src/config/database', () => ({ query: mockQuery }));

const AuthService = require('../../src/services/authService');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── register ────────────────────────────────────────────────────────────────

  describe('register', () => {
    it('creates a new user and returns token + user object', async () => {
      // No existing user
      mockQuery
        .mockResolvedValueOnce({ rows: [] }) // SELECT (no duplicate)
        .mockResolvedValueOnce({             // INSERT
          rows: [{ id: 1, email: 'test@test.com', first_name: 'Ana' }],
        });

      const result = await AuthService.register('test@test.com', 'Ana', 'password123');

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@test.com');
      expect(result.user.firstName).toBe('Ana');
      expect(result.user.id).toBe(1);
    });

    it('token is a valid JWT', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ id: 2, email: 'check@jwt.com', first_name: 'Luis' }],
        });

      const result = await AuthService.register('check@jwt.com', 'Luis', 'abc123');
      const decoded = jwt.decode(result.token);

      expect(decoded).toHaveProperty('userId', 2);
      expect(decoded).toHaveProperty('email', 'check@jwt.com');
    });

    it('throws if user already exists', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 99, email: 'dup@test.com' }], // duplicate found
      });

      await expect(
        AuthService.register('dup@test.com', 'Dup', 'pass')
      ).rejects.toThrow('User already exists');
    });

    it('hashes the password before storing', async () => {
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      mockQuery
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ id: 3, email: 'hash@test.com', first_name: 'Vera' }],
        });

      await AuthService.register('hash@test.com', 'Vera', 'plaintext');

      expect(hashSpy).toHaveBeenCalledWith('plaintext', 10);
    });
  });

  // ─── login ───────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('returns token and user for valid credentials', async () => {
      const passwordHash = await bcrypt.hash('secret', 10);
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 5, email: 'user@app.com', first_name: 'Maria', password_hash: passwordHash }],
      });

      const result = await AuthService.login('user@app.com', 'secret');

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('user@app.com');
      expect(result.user.firstName).toBe('Maria');
    });

    it('throws "Invalid credentials" when user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      await expect(AuthService.login('missing@test.com', 'pass')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('throws "Invalid credentials" when password is wrong', async () => {
      const passwordHash = await bcrypt.hash('correctpass', 10);
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 6, email: 'user2@app.com', first_name: 'Pedro', password_hash: passwordHash }],
      });

      await expect(AuthService.login('user2@app.com', 'wrongpass')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('token contains userId and email', async () => {
      const passwordHash = await bcrypt.hash('abc', 10);
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 7, email: 'tk@test.com', first_name: 'Token', password_hash: passwordHash }],
      });

      const result = await AuthService.login('tk@test.com', 'abc');
      const decoded = jwt.decode(result.token);

      expect(decoded.userId).toBe(7);
      expect(decoded.email).toBe('tk@test.com');
    });
  });
});
