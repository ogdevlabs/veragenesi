# Cleanup & Termination Guide

This guide shows how to stop all running VeraGenesi services during local development.

## Quick Stop All

### Option 1: Using the cleanup script (Recommended)
```bash
./stop-all.sh
```

### Option 2: Using Make
```bash
make stop-all
```

### Option 3: Backend only
```bash
cd backend
npm run stop
```

### Option 4: Frontend only
```bash
cd frontend
npm run stop
```

## Services & How to Stop Them

### 1. Backend API Server

**Stop**:
```bash
# From backend directory
npm run stop

# Or manually
pkill -f "nodemon src/index.js"
```

**What it does**: Kills the Node.js backend server running on port 3000

---

### 2. Frontend Expo Dev Server

**Stop**:
```bash
# From frontend directory
npm run stop

# Or manually
pkill -f "expo start"
```

**What it does**: Kills the Metro bundler running on port 8081-8082

---

### 3. PostgreSQL Database (Docker)

**Stop**:
```bash
# From project root
docker-compose down

# Or via Make
make stop
```

**What it does**: Stops the PostgreSQL container but preserves data

**Stop & Clear Data**:
```bash
docker-compose down -v
```

⚠️ This deletes all database data!

---

## Check Service Status

### List running VeraGenesi services
```bash
lsof -i :3000      # Backend API
lsof -i :8081      # Metro bundler
lsof -i :5432      # PostgreSQL
```

### Check Docker status
```bash
docker-compose ps
make ps
```

### View running processes
```bash
ps aux | grep -E "expo|nodemon|metro"
```

---

## Cleanup Sequences

### After Development Session
```bash
make stop-all
```

### Before Git Commit
```bash
# Stop all services
make stop-all

# Verify nothing is running
lsof -i :3000
lsof -i :8081
lsof -i :5432
```

### Restart Clean
```bash
make stop-all
make start        # Start Docker
cd backend && npm run dev  # Or just npm start from frontend
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Services Won't Stop
```bash
# Force kill all Node processes
pkill -9 node

# Force stop all Docker containers
docker-compose down -v
```

### Stuck Processes
```bash
# Kill all Expo processes
pkill -9 -f expo

# Kill all Node processes
pkill -9 node

# Restart everything from scratch
make clean
./setup-local.sh
```

---

## Development Workflow

```bash
# 1. Start services (first time only, or after cleanup)
make start           # Docker
cd backend && npm run dev  # Backend

# 2. In another terminal (optional)
cd frontend && npm start    # Frontend

# 3. When done for the day
make stop-all

# 4. Next day
make start
cd backend && npm run dev
```

---

## Scripts Available

### Make Commands
```bash
make help           # Show all commands
make setup          # One-time setup
make start          # Start Docker
make stop           # Stop Docker only
make stop-all       # Stop everything
make restart        # Restart Docker
make clean          # Remove all data
make logs           # View Docker logs
make db-shell       # Connect to database
```

### npm Commands (from backend)
```bash
npm start           # Run production server
npm run dev         # Run with auto-reload
npm run stop        # Stop dev server
npm run stop-all    # Stop all services
npm test            # Run tests
npm run lint        # Check code
npm run format      # Format code
```

### npm Commands (from frontend)
```bash
npm start           # Start Expo dev server
npm run web         # Run in web browser
npm run android     # Run on Android
npm run ios         # Run on iOS simulator
npm run stop        # Stop Expo
npm test            # Run tests
npm run lint        # Check code
npm run format      # Format code
```

---

## Emergency Stop

If nothing else works:
```bash
# Kill everything
killall node
killall expo
killall nodemon
docker-compose kill
docker-compose down
```

Then verify all ports are free:
```bash
lsof -i :3000
lsof -i :8081
lsof -i :5432
```

All should return empty.

---

## Pro Tips

### Run in One Terminal (Complete Workflow)
```bash
# Terminal 1
cd backend && npm run dev

# This automatically:
# - Starts Docker if needed
# - Initializes database if needed
# - Starts backend server

# Terminal 2
cd frontend && npm start

# Scan QR code with Expo Go app or run 'npm run web'

# To stop everything
^C  # Stop frontend (Ctrl+C)
^C  # Stop backend (Ctrl+C)
./stop-all.sh  # Clean up any lingering processes
```

### Keep Data, Stop Services
```bash
docker-compose down    # Keeps database data
```

### Full Reset (Warning: Deletes Everything)
```bash
make clean
./setup-local.sh
```

---

## Common Scenarios

### "I want to keep backend running but reload frontend"
```bash
# Terminal 1: Backend keeps running
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# When you want to stop frontend
^C  # Just the frontend stops

# Backend keeps running
```

### "I want to clear the database and restart"
```bash
docker-compose down -v    # Stop & delete data
docker-compose up -d       # Start fresh
npm run dev                # Reset database schema
```

### "I need to switch between web and mobile testing"
```bash
# Currently running web
npm run web    # Ctrl+C to stop

# Switch to mobile
npm start      # Fresh Metro server ready for Expo Go
```

---

**Remember**: All data persists in Docker volumes unless you use `down -v`!
