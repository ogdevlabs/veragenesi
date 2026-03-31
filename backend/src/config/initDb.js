const pool = require('./database');

// Check if database is already initialized
const isDatabaseInitialized = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'veragenesi' AND table_name = 'users'
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

    // Create schema
    await client.query('CREATE SCHEMA IF NOT EXISTS veragenesi');

    // Set search_path at the DATABASE level so all future connections use it automatically.
    // This avoids the race condition of using pool.on('connect') with async queries.
    const dbName = process.env.DB_NAME || 'vera_genesi_dev';
    await client.query(`ALTER DATABASE "${dbName}" SET search_path TO veragenesi, public`);

    // Also set it for this session
    await client.query('SET search_path TO veragenesi, public');

    // Enable UUID extension in public (accessible via search_path)
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public');

    // Create Users table — explicit schema prefix for safety
    await client.query(`
      CREATE TABLE IF NOT EXISTS veragenesi.users (
        id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
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
      CREATE TABLE IF NOT EXISTS veragenesi.archetypes (
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
      CREATE TABLE IF NOT EXISTS veragenesi.assessments (
        id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES veragenesi.users(id) ON DELETE CASCADE,
        assessment_type VARCHAR(50) NOT NULL,
        answers JSON NOT NULL,
        results JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        version INT DEFAULT 1
      )
    `);

    // Create Tool Usage table
    await client.query(`
      CREATE TABLE IF NOT EXISTS veragenesi.tool_usage (
        id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES veragenesi.users(id) ON DELETE CASCADE,
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
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON veragenesi.users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON veragenesi.assessments(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON veragenesi.tool_usage(user_id)');

    console.log('✓ Database schema created successfully');
  } catch (error) {
    console.error('✗ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
};

const verifyDatabaseSetup = async () => {
  const client = await pool.connect();
  try {
    const expectedTables = ['users', 'archetypes', 'assessments', 'tool_usage'];
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'veragenesi'
        AND table_name = ANY($1)
    `, [expectedTables]);

    const foundTables = result.rows.map(r => r.table_name);
    const missingTables = expectedTables.filter(t => !foundTables.includes(t));

    if (missingTables.length > 0) {
      console.warn('⚠ [dev] Missing tables:', missingTables.join(', '));
    } else {
      console.log('✓ [dev] All expected tables exist:', foundTables.join(', '));
    }

    const userResult = await client.query(
      "SELECT id, email, first_name, created_at FROM veragenesi.users WHERE email = 'admin@fererelabs.com'"
    );
    if (userResult.rows.length > 0) {
      const u = userResult.rows[0];
      console.log(`✓ [dev] Default user: id=${u.id} email=${u.email} name=${u.first_name} created=${u.created_at}`);
    } else {
      console.warn('⚠ [dev] Default user not found');
    }
  } catch (error) {
    console.error('✗ [dev] Verification error:', error.message);
  } finally {
    client.release();
  }
};

module.exports = { initializeDatabase, verifyDatabaseSetup };
