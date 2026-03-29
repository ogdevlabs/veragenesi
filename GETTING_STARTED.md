# VeraGenesi - Getting Started Guide

## Project Overview

VeraGenesi is a lightweight emotional intelligence assessment app with immediate, practical coping tools. This is the MVP A implementation designed for rapid market validation.

**Timeline**: 10-12 weeks | **Target**: 5,000+ users, 35%+ D7 retention

---

## Prerequisites

- **Node.js**: v18+ 
- **PostgreSQL**: v13+
- **npm**: v9+
- **Git**: Latest version
- **React Native CLI**: For native development (optional for Expo)

---

## Backend Setup

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
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### 3. Initialize Database
Ensure PostgreSQL is running, then start the server:
```bash
npm run dev
```

The database will auto-initialize on first run.

### 4. Verify Backend
```bash
curl http://localhost:3000/health
# Expected response: {"status":"healthy","timestamp":"..."}
```

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENVIRONMENT=development
```

### 3. Start Development Server
```bash
npm start
```

This launches Expo CLI. Scan QR code with Expo Go app or run emulator.

### 4. Run on iOS (macOS only)
```bash
npm run ios
```

### 5. Run on Android
```bash
npm run android
```

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
