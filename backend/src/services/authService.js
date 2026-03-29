const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '24h';

class AuthService {
  // Register a new user
  static async register(email, firstName, password) {
    try {
      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        'INSERT INTO users (email, first_name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, first_name',
        [email, firstName, passwordHash]
      );

      const user = result.rows[0];

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  static async login(email, password) {
    try {
      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = result.rows[0];

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Verify token
  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, primary_archetype, secondary_archetypes FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        primaryArchetype: user.primary_archetype,
        secondaryArchetypes: user.secondary_archetypes,
      };
    } catch (error) {
      throw error;
    }
  }

  // Update user archetype
  static async updateArchetype(userId, primaryArchetype, secondaryArchetypes) {
    try {
      const result = await pool.query(
        'UPDATE users SET primary_archetype = $1, secondary_archetypes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, primary_archetype, secondary_archetypes',
        [
          JSON.stringify(primaryArchetype),
          JSON.stringify(secondaryArchetypes),
          userId,
        ]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
