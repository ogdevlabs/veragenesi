# PROJECT: VeraGenesi - Emotional Health App

**Status**: Phase 1 - Backend & Frontend Foundation Complete
**Created**: 2026-03-29  
**Target Launch**: Q3 2026 (10-12 weeks)

---

## Context

A lightweight, mobile-first emotional intelligence assessment app with immediate practical coping tools for emotional wellness and mental health support. MVP A focuses on rapid market validation through core evaluations and quick tools.

### Tech Stack
- **Frontend**: React Native (Expo-ready)
- **Backend**: Node.js / Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + Email/OAuth
- **API**: RESTful
- **State Management**: React Context API

### Team
- Developer: VeraGenesi Build Team

---

## Project Goals

### Primary
1. Launch fastest MVP to validate market demand for emotional health tools
2. Achieve 5,000+ installations and 35%+ D7 retention in 12 weeks
3. Build foundation for Premium tier conversion (5-8% targeting)
4. Create intuitive onboarding → assessment → tools flow

### Secondary
1. Design scalable architecture for future growth
2. Establish quality baseline (WCAG AA accessibility, GDPR compliance)
3. Validate emotional intelligence scoring with Goleman-Boyatzis framework
4. Spanish-first localization (ES/EN bilingual)

---

## Success Criteria

### Launch
- ✓ App store submissions pending (iOS + Android)
- ✓ All 5 quick tools functional
- ✓ Archetype quiz (7Q) + EI baseline (16Q) complete
- ✓ Emergency resources verified

### Growth (Post-Launch)
- D1 Retention: 40%+
- D7 Retention: 35%+
- D30 Retention: 25%+
- Premium Conversion: 5-8%
- Avg Mood Delta (Pre/Post Tool): +2 points

---

## Architecture Overview

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        # PostgreSQL connection pool
│   │   └── initDb.js          # Schema + migrations
│   ├── services/
│   │   ├── authService.js     # JWT + user registration
│   │   ├── assessmentService.js # Quiz scoring algorithms
│   │   └── toolService.js     # Tool usage tracking
│   ├── routes/
│   │   ├── authRoutes.js      # /auth/register, /auth/login
│   │   ├── assessmentRoutes.js # /assessments/archetype, /ei-baseline
│   │   ├── toolRoutes.js      # /tools/usage, /tools/stats
│   │   └── userRoutes.js      # /user/profile, /resources/emergency
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── errorHandler.js    # Centralized error handling
│   └── index.js               # Express app bootstrap
├── package.json
└── .env.example
```

### Frontend Structure
```
frontend/
├── src/
│   ├── screens/               # Screen components
│   ├── components/            # Reusable UI components
│   ├── services/
│   │   ├── apiService.js      # REST client + interceptors
│   │   └── storageService.js  # AsyncStorage wrapper
│   ├── state/
│   │   ├── AuthContext.js     # Auth state & actions
│   │   └── AppContext.js      # App data & tool state
│   ├── utils/
│   │   └── scoring.js         # Scoring algorithms
│   ├── config/
│   │   └── designSystem.js    # Colors, typography, spacing
│   └── App.js                 # Navigation bootstrap
├── package.json
└── .env.example
```

---

## Data Models

### User
```
id (UUID) | email | first_name | password_hash | 
primary_archetype (JSON) | secondary_archetypes (JSON) | 
created_at | updated_at
```

### Assessment
```
id (UUID) | user_id (FK) | assessment_type (enum: archetype|ei-baseline) |
answers (JSON) | results (JSON) | created_at | version
```

### ToolUsage
```
id (UUID) | user_id (FK) | tool_id | duration_seconds |
before_mood | after_mood | mood_delta | note | created_at
```

---

## Key Deliverables by Phase

### Phase 1 (Weeks 1-2): ✅ Complete
- [x] Backend project scaffold (Express + PostgreSQL)
- [x] Database schema with migrations
- [x] Authentication service (JWT, registration, login)
- [x] API middleware (auth, error handling)
- [x] Frontend React Native setup
- [x] Context API state management (Auth + App)
- [x] API service client with axios
- [x] Local storage service (AsyncStorage)
- [x] Design system (colors, typography, spacing)
- [x] Core utilities (scoring, validation)

### Phase 2 (Weeks 2-3): Next
- [ ] Welcome screen & onboarding flow
- [ ] Registration/Login screens
- [ ] Email verification screen
- [ ] Navigation setup (Stack + Bottom Tabs)

### Phase 3 (Weeks 3-5): Quiz Implementation
- [ ] Archetype quiz screens (7 questions)
- [ ] Quiz scoring & results display
- [ ] Backend assessment storage

### Phase 4 (Weeks 5-7): EI Assessment
- [ ] EI baseline screens (16 questions)
- [ ] Scoring algorithms (Autoconciencia + Autogestión)
- [ ] Results visualization (radar chart)

### Phase 5 (Weeks 6-8): Tools Integration
- [ ] 5 quick tool implementations
- [ ] Tool execution screens
- [ ] Mood tracking & analytics

### Phases 6-9 (Weeks 9-12): Tools, Settings & Launch
- [ ] Remaining tool refinements
- [ ] Profile & Settings screens
- [ ] QA & bug fixes
- [ ] Launch preparation

---

## Next Steps

### Immediate (This Sprint)
1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env from .env.example
   # Set up PostgreSQL database
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Create .env from .env.example
   npm start
   ```

3. **Phase 2 Planning**: Detailed requirements for auth screens & onboarding

### Known Risks
- Assessment scoring algorithm validation needed (UAT with sample data)
- Database performance under 100K+ concurrent users (connection pooling required)
- App store approval timings (early legal review critical)
- Localization accuracy (Spanish prompts need native review)

---

## Resources

- **Spec**: `/docs/SPEC_MVP_A_CORE_TOOLS.md`
- **Requirements**: `/.planning/REQUIREMENTS.md`
- **Roadmap**: `/.planning/ROADMAP.md`
- **Design System**: `/frontend/src/config/designSystem.js`

---

**Last Updated**: 2026-03-29  
**Next Review**: Phase 2 completion (end of week 3)  
**Owner**: Development Team
