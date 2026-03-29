# ROADMAP - VeraGenesi Emotional Health App (MVP A)

**Timeline**: Q3 2026 (10-12 weeks)  
**Status**: Ready for Phase 1 Planning  
**Target**: 5,000+ installations, 35%+ D7 retention

---

## Milestone 1: Core Flows (Weeks 1-8)

### Phase 1: Project Setup & Backend Foundation (Weeks 1-2)
**Goal**: Establish project infrastructure and backend authentication

**Deliverables**:
- [ ] Backend project structure (Express + PostgreSQL setup)
- [ ] Database schema (User, Archetype, Assessment tables)
- [ ] Authentication system (JWT, email registration)
- [ ] Firebase/email setup for sign-up
- [ ] API error handling middleware
- [ ] Environment configuration
- [ ] Docker setup for development
- [ ] Git workflow established

**Key Features**:
- User registration (email/verify)
- User login/logout
- Session management (JWT 24h expiry)

**Success Criteria**:
- Backend runs locally: `npm run dev`
- Auth endpoints tested (registration, login)
- Database migrations working
- API responds with proper error codes

**Dependencies**: None (foundation)  
**Blockers**: Database setup access

---

### Phase 2: Frontend Setup & Onboarding UI (Weeks 2-3)
**Goal**: Create mobile app shell with onboarding screens

**Deliverables**:
- [ ] React Native project setup (Expo or bare)
- [ ] Navigation structure (React Navigation)
- [ ] Onboarding flow (Welcome → Auth → Ready)
- [ ] Welcome screens (2 screens)
- [ ] Auth screens (registration, verification)
- [ ] Local storage setup (AsyncStorage)
- [ ] Redux/Context setup for state management
- [ ] Design system (colors, typography, spacing)

**Key Features**:
- Welcome screen with brand intro
- Permissions request (notifications, analytics)
- Email/Google/Apple sign-up UI
- User names input

**Success Criteria**:
- App builds for iOS and Android
- Onboarding flow mockup complete
- Navigation working smoothly
- Form validation working

**Dependencies**: Phase 1 (auth API ready)

---

### Phase 3: Archetype Quiz Integration (Weeks 3-5)
**Goal**: Implement 7-question quiz with scoring

**Deliverables**:
- [ ] Quiz screen component
- [ ] Quiz data structure (7 questions, 5 answers each)
- [ ] Scoring algorithm (8 archetypes)
- [ ] Backend endpoint: POST /assessments/archetype
- [ ] Quiz state management (Redux)
- [ ] Results storage to backend
- [ ] Archetype descriptions & icons (8 types)
- [ ] Quiz UI with progress bar and answer options

**Key Features**:
- 7 single-screen questions (card-based)
- Likert 1-5 scale with emojis
- Back button for editing
- Progress bar (X of 7)
- Results calculation
- Primary + secondary archetype output

**Success Criteria**:
- Quiz completes in < 5 minutes
- Scoring algorithm returns top 3 archetypes
- Results match expected output
- Backend stores assessment correctly

**Dependencies**: Phase 1 (API), Phase 2 (UI framework)

---

### Phase 4: EI Assessment Integration (Weeks 5-7)
**Goal**: Implement 16-question emotional intelligence baseline

**Deliverables**:
- [ ] EI Assessment screens (16 questions, 3 screens)
- [ ] Goleman-Boyatzis questions (Autoconciencia × 8, Autogestión × 8)
- [ ] Scenario descriptions (in Spanish)
- [ ] Backend endpoint: POST /assessments/ei-baseline
- [ ] Scoring algorithm (normalize 8-40 → 0-100)
- [ ] Results interpretation logic
- [ ] EI data model + database storage
- [ ] UI for scenario display + Likert scale

**Key Features**:
- Scenario-based questions
- Likert 1-5 with Spanish labels
- Color-coded ranges (green/yellow/red)
- Estimated time display (8-10 min)
- Back button for editing
- Progress tracking

**Success Criteria**:
- Assessment completes in 8-10 minutes
- Scores normalized correctly (0-100)
- Backend stores all response data
- Interpretation text appropriate

**Dependencies**: Phase 1 (API), Phase 2 (UI framework)

---

### Phase 5: Results Display & Home Screen (Weeks 6-8)
**Goal**: Show assessment results and create main app hub

**Deliverables**:
- [ ] Results screen - Archetype card (name, icon, strengths, growth)
- [ ] Results screen - EI radar chart (2D: Autoconciencia x Autogestión)
- [ ] Archetype detail page (expandable "Entender más")
- [ ] Home screen shell (greeting, mood button, tool cards)
- [ ] Tool card components (5 cards with icons, names, times)
- [ ] Bottom navigation (Home, Profile, Settings, Help)
- [ ] Backend endpoint: GET /user/profile
- [ ] Navigation between results and home

**Key Features**:
- Archetype card with icon, description, strengths, growth areas
- EI radar chart with color coding
- Interpretation text based on scores
- Secondary archetypes list
- "Explorar Herramientas" CTA to home
- "Ver Plan Premium" link
- User greeting with archetype icon
- Mood check-in button (0-10)

**Success Criteria**:
- Results display correctly
- Radar chart renders properly
- Navigation to home working
- Profile data loads from backend
- Tool cards display properly

**Dependencies**: Phase 3 (archetype), Phase 4 (EI scores)

---

## Milestone 2: Quick Tools Implementation (Weeks 9-10)

### Phase 6: Tool Implementation - Calm Breath, Ground Yourself, Crisis (Week 9)
**Goal**: Implement 3 core quick tools with guides

**Deliverables**:
- [ ] Tool selection screen UI
- [ ] Calm Breath tool (5-min, 4-4-4 breathing)
  - [ ] Animation component (expanding/contracting circle)
  - [ ] Audio/haptic (optional)
  - [ ] Cycle counter
  - [ ] Pre/post mood check-in
- [ ] Ground Yourself tool (3-5 min, 5-4-3-2-1)
  - [ ] Interactive prompts
  - [ ] Text input for each level
  - [ ] Progress through stages
- [ ] Crisis Protocol tool (2 min)
  - [ ] Stabilization steps
  - [ ] Emergency resources screen
  - [ ] Direct call/text capability
  - [ ] Mexico-specific numbers verified
- [ ] Backend endpoint: POST /tools/usage
- [ ] Backend endpoint: GET /resources/emergency

**Key Features**:
- Step-by-step guided experiences
- Visual/audio cues
- Mood tracking (before/after)
- Notes/reflection optional
- Session logging
- Emergency resource links

**Success Criteria**:
- Each tool executes smoothly
- Mood delta calculated correctly
- Usage data stored properly
- Emergency resources current
- Tools complete in expected time

**Dependencies**: Phase 5 (home screen, button navigation)

---

### Phase 7: Tool Implementation - Quick Write & Pause+Reflect (Week 10)
**Goal**: Implement remaining tools and refine UX

**Deliverables**:
- [ ] Quick Write tool (5 min, journaling)
  - [ ] Prompted questions
  - [ ] Text input with timer
  - [ ] Word count display
  - [ ] Local storage (not synced in MVP A)
- [ ] Pause + Reflect tool (2-3 min)
  - [ ] Breathing pause
  - [ ] Reflection prompt
  - [ ] Archetype-based affirmations
  - [ ] Mood tracking
- [ ] Tool usage aggregation
- [ ] Profile "Tools used: X times" stat
- [ ] Post-tool CTA screens ("Another tool" or "Back Home")

**Key Features**:
- Journaling prompts
- Timer and word count
- Affirmations based on archetype
- Usage statistics
- Tool recommendations (optional)

**Success Criteria**:
- Quick Write stores locally
- Affirmations contextual to archetype
- Usage stats accurate
- All 5 tools accessible from home

**Dependencies**: Phase 6 (tool framework)

---

## Milestone 3: Advanced Features & Launch (Weeks 11-12)

### Phase 8: Profile & Settings Screens (Week 11)
**Goal**: Create user profile and settings management

**Deliverables**:
- [ ] Profile screen UI
  - [ ] Large archetype card
  - [ ] EI scores radar chart (snapshot)
  - [ ] "Entender más" expandable details
  - [ ] Usage stats display
  - [ ] Buttons: Edit Profile, Change Archetype
- [ ] Settings screen UI
  - [ ] Notifications toggle + time picker
  - [ ] Theme selection (Light/Dark)
  - [ ] Language selection (Spanish/English)
  - [ ] Premium upgrade CTA
  - [ ] Help & Support link
  - [ ] Legal links (Privacy, Terms, Disclaimer)
- [ ] LocalStorage persistence for preferences
- [ ] Backend endpoints for user updates

**Key Features**:
- Edit user name/profile info
- Retake archetype quiz
- Notification preferences
- Theme persistence
- Language switching
- Premium teaser (coming soon)

**Success Criteria**:
- Profile loads and updates correctly
- Settings persist across sessions
- Theme switching works
- Language switching affects UI
- Navigation working

**Dependencies**: Phase 5 (user data), Phase 7 (tools)

---

### Phase 9: QA, Localization, Polish & Launch Prep (Week 12)
**Goal**: Bug fixes, performance optimization, and launch readiness

**Deliverables**:
- [ ] Cross-platform testing (iOS + Android)
- [ ] Bug fixes and performance optimization
- [ ] Localization QA (Spanish/English)
  - [ ] All strings translated
  - [ ] Culturally appropriate content
  - [ ] Assessment prompts verified
- [ ] Accessibility audit (WCAG AA basics)
- [ ] Launch checklist completion
  - [ ] Privacy Policy (GDPR/LFPDPPP)
  - [ ] Terms of Service
  - [ ] Emergency resource verification
  - [ ] Legal review
- [ ] App Store preparation
  - [ ] Icons and screenshots
  - [ ] Metadata (description, keywords)
  - [ ] Testing on real devices
- [ ] Google Play preparation
  - [ ] Similar assets
  - [ ] Version code/name setup
- [ ] Analytics configuration
- [ ] Crash reporting setup (Sentry/Firebase)
- [ ] Performance monitoring

**Key Features**:
- App store listing ready
- No critical bugs
- Localization complete
- Emergency resources verified
- Privacy documentation complete

**Success Criteria**:
- App Store and Google Play submissions approved
- No critical P0 bugs
- Onboarding funnel: 85%+ completion
- Page load times < 1s
- Core metrics tracked (D1, D7, D30 retention)

**Dependencies**: Phase 8 (all features implemented)

---

## Success Checkpoints

### Checkpoint 1: End of Phase 5 (Week 8)
- ✓ Registration, Quiz, Assessment complete
- ✓ Results screens displaying correctly
- ✓ Home screen ready for tool integration
- **Target**: Onboarding flow testable end-to-end

### Checkpoint 2: End of Phase 7 (Week 10)
- ✓ All 5 quick tools functional
- ✓ Usage tracking working
- ✓ Full user flow from onboarding → tool use → profile
- **Target**: Feature-complete MVP, ready for QA

### Checkpoint 3: End of Phase 9 (Week 12)
- ✓ All bugs fixed
- ✓ Localization verified
- ✓ Launch readiness checklist 100%
- **Target**: Ready for app store submission

---

## Risk & Dependencies

| Phase | Risk | Mitigation |
|-------|------|-----------|
| 1-2 | Backend + frontend misalignment | Daily sync, shared API contracts |
| 3-4 | Assessment scoring algorithm bugs | Comprehensive unit tests, validation |
| 6-7 | Animation performance on older phones | Profile test devices, optimize |
| 9 | App store rejection | Early legal review, guidelines check |

---

## Metrics Tracking

**Target Metrics** (Post-Launch):
- D1 Retention: 40%+
- D7 Retention: 35%+
- D30 Retention: 25%+
- Average sessions/week: 2+
- Tool usage pre/post mood delta: +2 points average
- Premium conversion: 5-8%

---

**Created**: 2026-03-29  
**Last Updated**: 2026-03-29  
**Next Phase**: Phase 1 Planning & Execution
