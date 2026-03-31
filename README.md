# VeraGenesi - Emotional Health App

A lightweight, mobile-first emotional intelligence assessment and coping tools app. Built for rapid market validation with core features focused on user wellness.

**Status**: 🚀 Phase 1 Complete - Architecture & Foundation Built  
**Timeline**: 10-12 weeks to MVP launch  
**Target**: 5,000+ users, 35%+ D7 retention, 5-8% premium conversion

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm 9+

### Backend
```bash
cd backend
npm install
# Create .env from .env.example
npm run dev
# Server runs on http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
# Create .env from .env.example
npm start
# Scan QR code with Expo Go or run on emulator
```

**Full Setup Guide**: See [GETTING_STARTED.md](./GETTING_STARTED.md)

### Stopping Services
```bash
# Stop all running services
./stop-all.sh

# Or use Make
make stop-all

# Or individually
cd backend && npm run stop     # Stop backend
cd frontend && npm run stop    # Stop frontend
make stop                      # Stop Docker
```

**Full cleanup guide**: See [CLEANUP.md](./CLEANUP.md)

---

## Project Structure

```
VeraGenesi/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/            # Database & environment
│   │   ├── services/          # Business logic (auth, assessments, tools)
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # JWT auth, error handling
│   │   └── index.js           # Express app
│   └── package.json
│
├── frontend/                   # React Native mobile app
│   ├── src/
│   │   ├── screens/           # Screen components
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API client, storage
│   │   ├── state/             # Context providers (Auth, App)
│   │   ├── utils/             # Scoring, validation helpers
│   │   ├── config/            # Design system
│   │   └── App.js             # Navigation bootstrap
│   └── package.json
│
├── docs/
│   └── SPEC_MVP_A_CORE_TOOLS.md    # Full specification
│
├── .planning/                  # Project management artifacts
│   ├── PROJECT.md             # Project overview
│   ├── REQUIREMENTS.md        # Detailed requirements
│   ├── ROADMAP.md             # Phase breakdown
│   └── STATE.md               # Project state tracking
│
└── GETTING_STARTED.md         # Detailed setup guide
```

---

## What's Included (Phase 1)

### ✅ Backend Foundation
- Express.js server with PostgreSQL integration
- JWT authentication (registration, login, token verification)
- Database schema for users, assessments, tool usage
- Assessment service with scoring algorithms:
  - **Archetype Quiz**: 7 questions → 8 archetypes scoring
  - **EI Baseline**: 16 questions → Autoconciencia + Autogestión (0-100 normalized)
- Tool usage tracking service with statistics aggregation
- Centralized error handling middleware
- All core API endpoints ready for integration

### ✅ Frontend Foundation
- React Native setup with Expo
- Context API state management:
  - **AuthContext**: User login, registration, token management
  - **AppContext**: Assessments, tool stats, user profile
- Axios API client with JWT interceptor
- AsyncStorage for local persistence (online/offline sync)
- Design system (colors, typography, spacing)
- Reusable UI components (buttons, text, etc.)
- Scoring utilities and validation helpers
- Navigation structure (Stack + Bottom Tabs)

### ✅ Planning & Documentation
- Comprehensive REQUIREMENTS.md (70+ requirements)
- Detailed ROADMAP.md with 9 phases breakdown
- PROJECT.md with architecture overview
- Design system specifications
- Getting started guide

---

## API Overview

### Core Endpoints
**Authentication**
- `POST /auth/register` - Create account
- `POST /auth/login` - Login user

**Assessments**
- `POST /assessments/archetype` - Submit archetype quiz (7Q)
- `POST /assessments/ei-baseline` - Submit EI assessment (16Q)
- `GET /assessments/:type` - Get latest assessment

**Tools**
- `POST /tools/usage` - Log tool session + mood
- `GET /tools/list` - Available tools
- `GET /tools/stats` - User statistics
- `GET /tools/history` - Usage history

**User & Resources**
- `GET /user/profile` - User profile + stats
- `GET /resources/emergency` - Crisis resources

---

## Key Features (Complete by Week 12)

### Onboarding Flow
- Welcome screen with app intro
- Email/Google/Apple registration
- Archetype quiz (7 questions, 3 min)
- EI baseline assessment (16 questions, 8-10 min)
- Results with archetype profile

### 5 Quick Tools
- 🌬️ Calm Breath - 5 min breathing exercise
- 🧘 Ground Yourself - 5-4-3-2-1 sensory grounding
- 📝 Quick Write - Prompted journaling
- 🆘 Crisis Protocol - Emergency resources
- ✨ Pause + Reflect - Affirmations + gratitude

### User Features
- Profile screen (archetype + EI overview)
- Tool statistics & history
- Settings (notifications, theme, language)
- Emergency resources directory
- Bilingual (Spanish/English)

---

## Next Steps

### Phase 2 (Weeks 2-3)
- [ ] Welcome & Auth screens
- [ ] Navigation implementation
- [ ] Form validation

### Phase 3+ (Weeks 3-12)
Complete all remaining features, tools, and launch preparation.

See [.planning/ROADMAP.md](./.planning/ROADMAP.md) for full timeline.

---

## Documentation

- **Full Spec**: [docs/SPEC_MVP_A_CORE_TOOLS.md](./docs/SPEC_MVP_A_CORE_TOOLS.md)
- **Requirements**: [.planning/REQUIREMENTS.md](./.planning/REQUIREMENTS.md)
- **Roadmap**: [.planning/ROADMAP.md](./.planning/ROADMAP.md)
- **Project Overview**: [.planning/PROJECT.md](./.planning/PROJECT.md)
- **Setup Guide**: [GETTING_STARTED.md](./GETTING_STARTED.md)

---

**Created**: 2026-03-29 | **Current Phase**: 1 (Foundation) ✅ | **Target**: Q3 2026 Launch
