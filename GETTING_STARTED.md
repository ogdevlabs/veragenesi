# VeraGenesi - Getting Started Guide

## Project Overview

VeraGenesi is a lightweight emotional intelligence assessment app with immediate, practical coping tools. This is the MVP A implementation designed for rapid market validation.

**Timeline**: 10-12 weeks | **Target**: 5,000+ users, 35%+ D7 retention

---

## Prerequisites

- **Docker & Docker Compose**: For local PostgreSQL (recommended)
- **Node.js**: v18+ 
- **npm**: v9+
- **Git**: Latest version

**OR** (if not using Docker):
- **PostgreSQL**: v13+ (must be running locally)

---

## Quick Start (Recommended - Docker)

### 1. One-Command Setup (First Time Only)
```bash
chmod +x setup-local.sh
./setup-local.sh
```

This script will:
- Start PostgreSQL in Docker
- Wait for database readiness
- Install dependencies
- Display next steps

### 2. Start Development Server
```bash
cd backend
npm run dev
```

**Note**: `npm run dev` automatically starts PostgreSQL if it's not running. No manual Docker commands needed!

### 3. Stop Services (When Done)
```bash
# From project root:
docker-compose down
```

---

## Backend Setup (Manual - Without Docker)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Create `.env` file (copy from `.env.example`):
```bash
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vera_genesi_dev
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
```

**Important**: PostgreSQL must be running on port 5432 before starting the server.

### 3. Initialize Database
Start the server (database will auto-initialize):
```bash
npm run dev
```

### 4. Verify Backend
```bash
curl http://localhost:3000/health
# Expected response: {"status":"healthy","timestamp":"..."}
```

---

## Frontend Setup (Expo)

The frontend uses **Expo** — no native build tools required!

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

You'll see a QR code and a menu with options:

### 3. Choose How to Run

**⭐ Option A: Expo Go App (FASTEST - Recommended)**
- Download "Expo Go" from App Store or Play Store
- Scan the QR code with your phone camera
- App loads instantly on your device

**Option B: Web Browser** (Good for quick testing)
```bash
npm run web
```

**Option C: Android Emulator** (requires Android Studio)
```bash
npm run android
# Note: If you get permission errors, see [ANDROID_TROUBLESHOOTING.md](./frontend/ANDROID_TROUBLESHOOTING.md)
```

**Option D: iOS Simulator** (macOS only, requires Xcode)
```bash
npm run ios
```

### 4. View App on Your Phone

**Recommended workflow**:
1. Download **Expo Go** app on your phone
2. Run `npm start` on your computer
3. Scan the QR code with your phone's camera
4. That's it! App appears on your phone instantly

### 5. Troubleshooting

If you get errors like "main has not been registered" or permission errors, see [ANDROID_TROUBLESHOOTING.md](./frontend/ANDROID_TROUBLESHOOTING.md)

**Quick fix for most issues**:
```bash
npm start -- --clear   # Clear Metro cache
npm start              # Try again
```

1. Download **Expo Go** app
2. Run `npm start` in frontend directory
3. Scan the QR code
4. That's it! ✅

### 5. Develop

- Make code changes in your editor
- Changes auto-reload on your device
- In the terminal, press 'r' to reload, or shake phone to open dev menu

---

## Architecture Overview

### Backend API Endpoints

**Authentication**
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login with email/password

**Assessments**
- `POST /assessments/archetype` - Submit 7-question archetype quiz
- `POST /assessments/ei-baseline` - Submit 16-question EI baseline (2 competencies)
- `GET /assessments/:type` - Get latest assessment by type

**Tools**
- `POST /tools/usage` - Log tool usage + mood tracking
- `GET /tools/list` - Get available tools
- `GET /tools/stats` - Get user tool usage statistics
- `GET /tools/history` - Get user tool usage history

**User & Resources**
- `GET /user/profile` - Get user profile + archetype + stats
- `GET /resources/emergency` - Get emergency resources/hotlines

### Frontend State Management

**AuthContext**
- Handles user authentication, registration, login, logout
- Persists token to local storage
- Auto-checks auth on app start

**AppContext**
- Manages user assessments (archetype, EI scores)
- Tracks tool usage statistics
- Loads user profile from backend

### Data Flow

```
Frontend (user action)
  ↓
Context (dispatch action)
  ↓
API Service (HTTP request)
  ↓
Backend (route handler)
  ↓
Service (business logic)
  ↓
Database (persistence)
```

---

## Key Features Implemented (Phase 1)

### BackendServices
- **authService.js**: User registration, login, token generation
- **assessmentService.js**: Quiz scoring algorithms (8 archetypes, EI normalized scores)
- **toolService.js**: Tool usage tracking, statistics aggregation

### Frontend Services
- **apiService.js**: Axios client with JWT interceptors
- **storageService.js**: Local persistence (auth token, user data, offline sync)

### State Management
- **AuthContext.js**: Authentication state + auth actions
- **AppContext.js**: App data + assessment results + tool stats

### UI Components
- **BasicComponents.js**: Reusable Button, HeadingText, BodyText components
- **WelcomeScreen.js**: Onboarding intro screen (template)

### Utilities
- **designSystem.js**: Colors, typography, spacing constants
- **scoring.js**: Archetype definitions, tool definitions, helper functions

---

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/auth-screens
```

### 2. Implement Feature (Backend)
- Add routes in `src/routes/`
- Add business logic in `src/services/`
- Add models/queries in database
- Add error handling in middleware

### 3. Implement Feature (Frontend)
- Add screens in `src/screens/`
- Add components in `src/components/`
- Use Context for state management
- Use apiService for backend calls

### 4. Test Locally
```bash
# Backend
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test","password":"password"}'

# Frontend manual testing on emulator
```

### 5. Commit & Push
```bash
git add .
git commit -m "feat: implement auth screens"
git push origin feature/auth-screens
```

---

## Testing Checklist

### Backend
- [ ] All endpoints return correct status codes
- [ ] Authentication middleware works (401 on missing token)
- [ ] Database operations persist correctly
- [ ] Error handling returns meaningful messages
- [ ] CORS is configured properly

### Frontend
- [ ] Navigation flows work smoothly
- [ ] Context state updates propagate correctly
- [ ] API calls succeed with valid token
- [ ] Offline storage persists across app restarts
- [ ] Screens render without errors

---

## Common Issues & Solutions

### Backend
**Issue**: "Database connection error"
- Ensure PostgreSQL is running: `brew services start postgresql`
- Check .env credentials match PostgreSQL user

**Issue**: "Port 3000 already in use"
- Kill process: `lsof -ti:3000 | xargs kill -9`
- Or change PORT in .env

### Frontend
**Issue**: "API connection refused"
- Ensure backend is running on port 3000
- Check REACT_APP_API_URL in .env
- On Android emulator, use 10.0.2.2 instead of localhost

**Issue**: "AsyncStorage not available"
- Ensure @react-native-async-storage/async-storage is installed
- Run `npm install` again if missing

---

## Monitoring & Debugging

### Backend Logs
The server outputs logs to console:
```
✓ Database initialized successfully
✓ Server running on http://localhost:3000
```

Check `src/index.js` for logging setup.

### Frontend Debugging
Use React Native Debugger:
```bash
# Install globally
npm install -g react-native-debugger

# Launch
react-native-debugger
```

Or use Expo's built-in error overlay.

---

## Next Phase Goals (Phase 2)

- [ ] Implement Welcome & Auth screens
- [ ] Email verification flow
- [ ] Navigation structure (Stack + Tabs)
- [ ] Form validation & error messages
- [ ] Load testing on backend

---

## Resources

- **Specification**: `/docs/SPEC_MVP_A_CORE_TOOLS.md`
- **Requirements**: `/.planning/REQUIREMENTS.md`
- **Roadmap**: `/.planning/ROADMAP.md`
- **API Documentation**: See `/backend/src/routes/*.js` for endpoint details
- **Design System**: `/frontend/src/config/designSystem.js`

---

## Questions?

Refer to the specification document or check existing code patterns in the codebase.

For technical decisions, check `.planning/ROADMAP.md` for phase details and success criteria.

**Last Updated**: 2026-03-29  
**Status**: Phase 1 Complete - Ready for Phase 2
