const pool = require('./database');

// Check if database is already initialized
const isDatabaseInitialized = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      )
    `);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking database initialization:', error.message);
    return false;
  } finally {
    client.release();
  }
};

const initializeDatabase = async () => {
  // Check if already initialized
  const initialized = await isDatabaseInitialized();
  if (initialized) {
    console.log('✓ Database already initialized, skipping initialization');
    return;
  }

  const client = await pool.connect();
  try {
    console.log('📋 Running initial database setup...');
    
    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        primary_archetype JSON,
        secondary_archetypes JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Archetypes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS archetypes (
        id SERIAL PRIMARY KEY,
        name_es VARCHAR(100) NOT NULL,
        name_en VARCHAR(100) NOT NULL,
        description_es TEXT,
        description_en TEXT,
        strengths_es JSON,
        strengths_en JSON,
        growth_areas_es JSON,
        growth_areas_en JSON,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Assessments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_type VARCHAR(50) NOT NULL,
        answers JSON NOT NULL,
        results JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        version INT DEFAULT 1
      )
    `);

    // Create Tool Usage table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tool_usage (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tool_id VARCHAR(50) NOT NULL,
        duration_seconds INT,
        before_mood INT,
        after_mood INT,
        mood_delta INT,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON tool_usage(user_id)');

    console.log('✓ Database schema created successfully');
  } catch (error) {
    console.error('✗ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = initializeDatabase;
