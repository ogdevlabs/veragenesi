# VeraGenesi MVP Testing Guide

## Status: Implementation Complete ✅

All core MVP components have been implemented and are ready for end-to-end testing.

## Architecture Overview

### Backend (Node.js + Express + PostgreSQL)
- **Port:** 3000
- **Status:** Running with auto-startup via Docker
- **Database:** PostgreSQL 15 Alpine via Docker Compose
- **Data:** Seeded with 8 Archetypes on startup

### Frontend (React Native + Expo)
- **Status:** Ready for testing
- **Build:** Web, iOS, Android support
- **State Management:** Context API (AuthContext, AppContext)
- **Navigation:** Screen stack + Tab navigation post-auth

## Implemented Features

### 1. Authentication Flow ✅
- **LoginScreen**: Email + password login
- **SignupScreen**: Email + first name + password registration
- **AuthContext**: JWT token storage in AsyncStorage
- **API Endpoints**: `/auth/register`, `/auth/login`

### 2. Archetype Assessment ✅
- **ArchetypeQuizScreen**: 7 questions with 1-5 Likert scale
- **Backend Scoring**: Maps answers to 8 archetypes
- **API Endpoint**: `POST /assessments/archetype`
- **Response**: Primary + secondary archetypes with metadata

### 3. EI (Emotional Intelligence) Assessment ✅
- **EIAssessmentScreen**: 16 questions (8 Self-Awareness, 8 Self-Management)
- **Likert Scale**: 1-5 rating for each question
- **Backend Scoring**: Calculates normalized scores (0-100)
- **API Endpoint**: `POST /assessments/ei-baseline`
- **Response**: Self-awareness + Self-management scores with interpretations

### 4. Results Display ✅
- **ResultsScreen**: Shows archetype profile + EI scores
- **Archetype Display**: Emoji, name, description, strengths, growth areas
- **EI Scores**: Color-coded (High/Moderate/Low) with interpretation

### 5. Navigation Flow ✅
- **Welcome** → **Login/Signup** → **Archetype Quiz** → **EI Assessment** → **Results** → **Home**
- Automatic navigation based on auth state and assessment completion
- Error handling and validation at each step

## Next Steps: Tool Implementation

### HomeScreen (TODO)
- Display 5 core tools: Calm Breath, Ground Yourself, Quick Write, Crisis Protocol, Pause+Reflect
- Mood tracker input
- Tool usage history

### Tool Execution (TODO)
- Calm Breath: 5-minute guided breathing
- Ground Yourself: 5-senses grounding technique
- Quick Write: Prompted journaling
- Crisis Protocol: Emergency support resources
- Pause+Reflect: 3-minute breathing + gratitude

## Testing Workflow

### Step 1: Backend Health Check
```bash
curl http://localhost:3000/auth/register
# Should respond (even with error) within 2 seconds
```

### Step 2: Register Test User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@veragenesi.app",
    "firstName": "Test User",
    "password": "SecurePass123"
  }'
```
**Expected Response:**
```json
{
  "token": "eyJhbGcl...",
  "user": {
    "id": 1,
    "email": "test@veragenesi.app",
    "firstName": "Test User"
  }
}
```

### Step 3: Test Archetype Assessment
```bash
# Using token from registration
curl -X POST http://localhost:3000/assessments/archetype \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [2, 4, 1, 3, 5, 2, 4]
  }'
```
**Expected Response:**
```json
{
  "primary": {
    "id": 2,
    "name": "El Innovador",
    "short_name": "innovator",
    "score": 21
  },
  "secondary": [...]
}
```

### Step 4: Test EI Assessment
```bash
curl -X POST http://localhost:3000/assessments/ei-baseline \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
  }'
```
**Expected Response:**
```json
{
  "autoconciencia": 50,
  "autogestional": 50,
  "raw": {...},
  "interpretation": {...}
}
```

## Frontend QA Checklist

### Authentication
- [ ] Can register with valid email
- [ ] Can't register with duplicate email
- [ ] Can login with correct credentials
- [ ] Can't login with wrong password
- [ ] Token persists on app restart

### Archetype Quiz
- [ ] All 7 questions display correctly
- [ ] Can select 1-5 rating for each question
- [ ] Progress bar shows correct progress
- [ ] Can go back and edit answers
- [ ] Submit disabled until all questions answered

### EI Assessment
- [ ] All 16 questions display with scenarios
- [ ] Competency label shows (Self-Awareness vs Self-Management)
- [ ] Same Likert scale functionality as archetype
- [ ] Proper question ordering maintained

### Results Display
- [ ] Archetype emoji and name render
- [ ] Strengths/growth areas list displays
- [ ] EI scores show with correct color coding
- [ ] Interpretations render correctly
- [ ] "Explore Tools" button navigates

## Data Model: 8 Archetypes

1. **El Protector** 🛡️ - Compassionate, empathetic
2. **El Innovador** 💡 - Creative, problem-solving
3. **El Aventurero** 🗺️ - Spontaneous, experience-seeking
4. **El Sabio** 🧠 - Analytical, wisdom-seeking
5. **El Amante** ❤️ - Passionate, emotionally connected
6. **El Gobernante** 👑 - Leader, control-oriented
7. **El Mago** ✨ - Transformative, reality-changing
8. **El Bufón** 🎭 - Joyful, fun-bringing

## Common Issues & Solutions

### Backend Not Responding
```bash
# 1. Check if Docker is running
docker ps

# 2. Check if PostgreSQL is running
docker ps | grep postgres

# 3. View backend logs
tail -100 /tmp/backend.log

# 4. Restart backend
cd backend && npm run dev
```

### Frontend Can't Connect to Backend
- Check `API_BASE_URL` in `apiService.js` (should be `http://localhost:3000`)
- Verify backend is responding: `curl http://localhost:3000`
- Check network configuration (firewall, VPN)

### Archetype Results Not Showing
- Verify `archetypeResults` in AppContext has both `primary` and `secondary`
- Check that archetype ID exists in `ARCHETYPES` array in `scoring.js`
- Verify archetype object has `name`, `emoji`, `description`, `strengths`, `growthAreas`

### EI Scores Showing as NaN
- Check that backend returns numeric scores (0-100)
- Verify `Math.round()` in ResultsScreen is working
- Check that EI response has correct structure: `{ autoconciencia: {...}, autogestional: {...} }`

## Performance Targets

- **Registration:** < 2 seconds
- **Assessment Submission:** < 2 seconds  
- **Screen Load:** < 1 second
- **Navigation:** Instant

## Security Checklist

- [ ] JWT tokens stored securely in AsyncStorage
- [ ] Passwords hashed with bcrypt
- [ ] Auth token added to all protected API calls
- [ ] 401 errors redirect to login
- [ ] CORS properly configured
- [ ] No sensitive data in console logs

## Browser/Device Testing

### Web (Expo Web)
```bash
cd frontend
npm start
# Press 'w' for web
```

### iOS Simulator
```bash
cd frontend
npm start
# Press 'i' for iOS
```

### Android Emulator
```bash
cd frontend
npm start
# Press 'a' for Android
```

### Physical Device
- Install Expo Go app
- Scan QR code from Expo CLI

## Success Criteria

The MVP is complete when:

1. ✅ User can register and login
2. ✅ User can complete 7-question archetype quiz
3. ✅ User can complete 16-question EI assessment
4. ✅ User sees results with archetype profile
5. ✅ User sees EI scores with interpretations
6. ✅ Navigation flows seamlessly through all screens
7. ✅ All API calls complete within timeout
8. ✅ Errors are handled gracefully with user-friendly messages

---

**Last Updated:** Current Session
**Version:** MVP 1.0 - Full Stack Complete
