#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
};

const log = {
  error: (msg) => console.error(`${colors.red}✗ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
};

const checkDocker = () => {
  try {
    // Check if docker command exists
    try {
      execSync('docker --version', { stdio: 'pipe' });
    } catch {
      log.error('Docker not found. Please install Docker Desktop.');
      process.exit(1);
    }

    // Check if postgres container is running
    try {
      const result = execSync('docker ps --filter "name=vera_genesi_db" --format "{{.Names}}"', {
        encoding: 'utf8',
      });

      if (result.includes('vera_genesi_db')) {
        // Check if it's healthy
        const healthResult = execSync(
          'docker inspect vera_genesi_db --format "{{.State.Health.Status}}"',
          { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
        );

        if (healthResult.includes('healthy') || healthResult.includes('none')) {
          log.success('PostgreSQL is running');
          return;
        }
      }
    } catch (e) {
      // Container not running or error checking, will start it
    }

    // Start docker compose
    log.info('🐳 Starting PostgreSQL container...');
    const rootDir = path.join(__dirname, '..');
    
    const result = spawnSync('docker', ['compose', 'up', '-d', 'postgres'], {
      cwd: rootDir,
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      log.error('Failed to start docker compose. Make sure Docker Desktop is running.');
      process.exit(1);
    }

    // Wait for postgres to be ready
    log.info('⏳ Waiting for PostgreSQL...');
    let ready = false;
    for (let i = 0; i < 30; i++) {
      try {
        execSync('docker exec vera_genesi_db pg_isready -U postgres', {
          stdio: 'pipe',
        });
        ready = true;
        break;
      } catch {
        if (i === 29) {
          log.error('PostgreSQL failed to start. Check logs with: docker compose logs postgres');
          process.exit(1);
        }
        // Wait before retry
        execSync('sleep 1', { stdio: 'pipe' });
      }
    }

    if (ready) {
      log.success('PostgreSQL is ready');
    }
  } catch (error) {
    log.error(`Docker check failed: ${error.message}`);
    process.exit(1);
  }
};

checkDocker();
