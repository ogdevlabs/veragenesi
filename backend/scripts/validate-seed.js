#!/usr/bin/env node
/**
 * validate-seed.js
 * Run:  node scripts/validate-seed.js
 * Checks that the veragenesi schema, all tables, and seed data exist.
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT) || 5433,
  database: process.env.DB_NAME || 'vera_genesi_dev',
});

const check = (label, passed, detail = '') => {
  const icon = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${icon}\x1b[0m ${label}${detail ? `  → ${detail}` : ''}`);
  return passed;
};

const run = async () => {
  const client = await pool.connect();
  let allPassed = true;

  try {
    // 1. Schema exists
    const schemaRes = await client.query(
      "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'veragenesi'"
    );
    allPassed &= check('Schema veragenesi exists', schemaRes.rows.length === 1);

    // 2. Tables exist
    const tablesRes = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'veragenesi'
      ORDER BY table_name
    `);
    const tableNames = tablesRes.rows.map(r => r.table_name);
    const expectedTables = ['archetypes', 'assessments', 'tool_usage', 'users'];
    for (const t of expectedTables) {
      allPassed &= check(`Table veragenesi.${t} exists`, tableNames.includes(t));
    }

    // 3. uuid-ossp extension
    const extRes = await client.query(
      "SELECT extname FROM pg_extension WHERE extname = 'uuid-ossp'"
    );
    allPassed &= check('Extension uuid-ossp installed', extRes.rows.length === 1);

    // 4. Row counts
    const usersRes = await client.query('SELECT COUNT(*) FROM veragenesi.users');
    const userCount = parseInt(usersRes.rows[0].count);
    allPassed &= check('Users table has rows', userCount > 0, `${userCount} row(s)`);

    const archetypesRes = await client.query('SELECT COUNT(*) FROM veragenesi.archetypes');
    const archetypeCount = parseInt(archetypesRes.rows[0].count);
    allPassed &= check('Archetypes seeded', archetypeCount >= 8, `${archetypeCount} row(s)`);

    // 5. Admin user exists
    const adminRes = await client.query(
      "SELECT email, first_name FROM veragenesi.users WHERE email = 'admin'"
    );
    allPassed &= check(
      "Default admin user exists (email='admin')",
      adminRes.rows.length === 1,
      adminRes.rows[0] ? `name: ${adminRes.rows[0].first_name}` : 'NOT FOUND'
    );

    // 6. List all users
    const allUsersRes = await client.query(
      'SELECT email, first_name, created_at FROM veragenesi.users ORDER BY created_at'
    );
    console.log('\n\x1b[36mUsers in DB:\x1b[0m');
    allUsersRes.rows.forEach(u =>
      console.log(`  • ${u.email} (${u.first_name || 'no name'}) — ${u.created_at}`)
    );

    console.log(`\n${allPassed ? '\x1b[32m✓ All checks passed\x1b[0m' : '\x1b[31m✗ Some checks FAILED\x1b[0m'}`);
  } catch (err) {
    console.error('\x1b[31m✗ Validation error:\x1b[0m', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }

  if (!allPassed) process.exitCode = 1;
};

run();
