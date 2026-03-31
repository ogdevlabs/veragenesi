# Docker Setup Guide

This project uses Docker and Docker Compose to simplify local development. No need to install PostgreSQL separately!

## What's Included

- **PostgreSQL 15 Alpine**: Lightweight, production-ready database
- **Volume Mount**: Data persists between container restarts
- **Health Checks**: Ensures database is ready before your app connects
- **Network Isolation**: Services communicate safely in a dedicated network

## Quick Commands

### Automatic Docker Startup (Recommended)
```bash
cd backend
npm run dev
```

**This automatically:**
- Checks if PostgreSQL is running
- Starts it if needed
- Initializes database if required
- Starts the dev server

**No manual Docker commands needed!**

### Manual Docker Commands

### Check Database Status
```bash
docker-compose ps
```

Expected output:
```
NAME              STATUS
vera_genesi_db    Up (healthy)
```

### View Logs
```bash
docker-compose logs -f postgres
```

### Stop Services
```bash
docker-compose down
```

### Stop & Clear Data
```bash
docker-compose down -v
```

### Access Database Directly
```bash
docker exec -it vera_genesi_db psql -U postgres -d vera_genesi_dev
```

Then in psql:
```sql
\dt                  -- List tables
SELECT * FROM users; -- Query users
\q                   -- Exit
```

## Troubleshooting

### "Connection refused" error
**Problem**: Backend can't connect to database  
**Solution**: 
1. Ensure `docker-compose up -d` has completed
2. Wait 5-10 seconds for database startup
3. Check: `docker-compose ps` (should show "healthy")

### "Port 5432 already in use"
**Problem**: PostgreSQL conflict  
**Solution**:
```bash
# Kill existing container
docker-compose down

# Or use a different port in docker-compose.yml:
# ports:
#   - "5433:5432"
# Then update backend .env: DB_PORT=5433
```

### "Database 'vera_genesi_dev' does not exist"
**Problem**: Database not initialized  
**Solution**:
```bash
npm run dev
# Backend will auto-create tables on first run
```

### Docker not found
**Problem**: Docker not installed  
**Solution**:
1. Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Install and restart terminal
3. Run `docker --version` to verify

## Environment Variables

The `.env` file is already configured to match Docker Compose:

```
DB_HOST=localhost    # Docker Compose maps this correctly
DB_PORT=5432         # Exposed by docker-compose.yml
DB_USER=postgres     # Matches POSTGRES_USER in docker-compose.yml
DB_PASSWORD=password # Matches POSTGRES_PASSWORD in docker-compose.yml
DB_NAME=vera_genesi_dev # Matches POSTGRES_DB in docker-compose.yml
```

**Note**: These are development defaults only. Change `DB_PASSWORD` before deploying to production.

## Development Workflow

```bash
# 1. One-time setup (if not done already)
./setup-local.sh

# 2. Each development session - just run:
cd backend
npm run dev

# That's it! Docker starts automatically if needed.

# 3. In another terminal, work on code
# Changes auto-reload via nodemon

# 4. When done:
# Ctrl+C to stop server (Docker keeps running for next session)
# docker-compose down (to stop database when leaving for the day)
```

## Database Persistence

Your PostgreSQL data is stored in a Docker volume named `vera_genesi_data`. This means:
- ✅ Data persists when you stop containers with `docker-compose down`
- ✅ Data persists when you restart your machine
- ❌ Data is lost only if you run `docker-compose down -v`

## Production Notes

For production deployment:
1. Change `DB_PASSWORD` to a strong secret
2. Use environment-specific `.env` files
3. Consider managed PostgreSQL (RDS, Cloud SQL, etc.)
4. Update `docker-compose.yml` for production-grade settings (resource limits, backups, etc.)
