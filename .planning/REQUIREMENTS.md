# REQUIREMENTS - VeraGenesi Emotional Health App (MVP A)

**Spec Source**: docs/SPEC_MVP_A_CORE_TOOLS.md  
**Status**: Active Development  
**Target Timeline**: 10-12 weeks (Q3 2026)

---

## Product Overview

A lightweight emotional intelligence assessment app with immediate, practical coping tools for users. MVP focuses on core evaluation and quick tools, deferring advanced features (plans, journal, re-evaluations) to v1.1+.

### Success Metrics
- 5,000+ installations
- 35%+ D7 retention
- 40%+ D30 retention
- Premium conversion: 5-8% of active users

---

## Functional Requirements

### FR1: Authentication System
- **FR1.1**: User registration via email, Google, or Apple Sign-up
- **FR1.2**: Email verification (if needed)
- **FR1.3**: Login/Logout functionality
- **FR1.4**: Session management with JWT tokens
- **FR1.5**: Password reset capability

### FR2: Onboarding Flow (Screens 1-2)
- **FR2.1**: Welcome screen with brand intro and value proposition
- **FR2.2**: App permissions request (notifications, analytics opt-in)
- **FR2.3**: Progress tracking through onboarding

### FR3: Archetype Assessment (Screens 3-9)
- **FR3.1**: 7-question quiz with single-select/Likert 1-5 format
- **FR3.2**: ~3 minute completion time
- **FR3.3**: Output: Primary archetype + 2-3 secondary archetypes
- **FR3.4**: Support 8 archetypes: Héroe, Sabio, Amante, Sombra, Cuidador, Jungla, Mago, Inocente
- **FR3.5**: Scoring algorithm based on answer patterns
- **FR3.6**: Back button for editing answers
- **FR3.7**: Progress bar showing question progress

### FR4: EI Baseline Assessment (Screens 10-12)
- **FR4.1**: 16 Goleman-Boyatzis scenario-based questions
- **FR4.2**: Likert 1-5 scale with Spanish labels
- **FR4.3**: 8-10 minute completion time
- **FR4.4**: Measure 2 competencies: Autoconciencia (Awareness), Autogestión (Self-Management)
- **FR4.5**: Score calculation: raw (8-40) → normalize to 0-100
- **FR4.6**: Color coding: Green (>70), Yellow (40-70), Red (<40)
- **FR4.7**: Send results to backend for storage

### FR5: Results Display (Screens 13-14)
- **FR5.1**: Archetype card with name, description, strengths, growth areas
- **FR5.2**: Illustration/icon for archetype
- **FR5.3**: Secondary archetypes listed with descriptions
- **FR5.4**: EI radar chart (2D) showing Autoconciencia and Autogestión
- **FR5.5**: Interpretation text based on scores
- **FR5.6**: CTAs: "Explorar Herramientas" (primary), "Ver Plan Premium" (secondary)
- **FR5.7**: "Entender más" expandable section for archetype details

### FR6: Home Screen (Main Hub)
- **FR6.1**: Greeting with user name + archetype icon
- **FR6.2**: Current mood button (0-10 scale)
- **FR6.3**: 5 quick tool cards (grid layout, 2 rows staggered)
- **FR6.4**: Each tool shows: icon, name, time estimate, description, last accessed
- **FR6.5**: Bottom navigation: Home, Profile, Settings, Help
- **FR6.6**: Active navigation state highlighting

### FR7: Quick Tools - Calm Breath (Stress)
- **FR7.1**: 5-minute guided breathing exercise
- **FR7.2**: Visual animation (expanding/contracting circle)
- **FR7.3**: Audio guidance with 4-4-4 breathing cycles (inhale, hold, exhale)
- **FR7.4**: Cycle counter (5 total)
- **FR7.5**: Pre/post mood check-in (0-10 scale)
- **FR7.6**: Optional reflection text
- **FR7.7**: Haptic feedback optional

### FR8: Quick Tools - Ground Yourself (Anxiety)
- **FR8.1**: 3-5 minute 5-4-3-2-1 sensory grounding
- **FR8.2**: Interactive prompts: "5 things you see", "4 you can touch", etc.
- **FR8.3**: Text input for each level
- **FR8.4**: Pre/post mood tracking
- **FR8.5**: Grounding responses stored locally

### FR9: Quick Tools - Quick Write (Sadness)
- **FR9.1**: 5-minute prompted journaling
- **FR9.2**: Prompts: "What am I feeling?", "What triggered this?", "What do I need?"
- **FR9.3**: Text input with timer and word count
- **FR9.4**: Local storage only (not synced in MVP A)
- **FR9.5**: Mood tracking before/after

### FR10: Quick Tools - Crisis Protocol (Emergency)
- **FR10.1**: 2-minute stabilization steps
- **FR10.2**: "Find safe place" + 5-senses grounding
- **FR10.3**: "You are safe" affirmations
- **FR10.4**: Emergency resources button
- **FR10.5**: Mexico specific: Línea de la Vida (800-911-2000)
- **FR10.6**: International crisis numbers
- **FR10.7**: Direct call/text capability
- **FR10.8**: Session logging

### FR11: Quick Tools - Pause + Reflect (General)
- **FR11.1**: 2-3 minute breathing pause
- **FR11.2**: Guided reflection: "What's one thing I appreciate?"
- **FR11.3**: Archetype-based positive affirmations
- **FR11.4**: Mood check
- **FR11.5**: Affirmation logging

### FR12: Profile Screen
- **FR12.1**: Large archetype card
- **FR12.2**: EI scores snapshot with radar chart
- **FR12.3**: "Entender más" expandable archetype details
- **FR12.4**: Usage stats: "Tools used: X times"
- **FR12.5**: Buttons: Edit Profile, Change Archetype (retake quiz)

### FR13: Settings Screen
- **FR13.1**: Notifications toggle + time of day selection
- **FR13.2**: Theme selection (Light/Dark)
- **FR13.3**: Language selection (Español/English)
- **FR13.4**: Premium upgrade CTA
- **FR13.5**: Help & Support link
- **FR13.6**: Legal links (Privacy, Terms, Disclaimer)

### FR14: Backend API Endpoints
- **FR14.1**: POST /auth/register
- **FR14.2**: POST /auth/login
- **FR14.3**: POST /assessments/archetype
- **FR14.4**: POST /assessments/ei-baseline
- **FR14.5**: POST /tools/usage
- **FR14.6**: GET /user/profile
- **FR14.7**: GET /resources/emergency
- **FR14.8**: Error handling and validation

### FR15: Data Persistence
- **FR15.1**: PostgreSQL database for users, assessments, tool usage
- **FR15.2**: Local storage for offline cache and quick writes (frontend)
- **FR15.3**: Sync pending data when online

### FR16: Localization
- **FR16.1**: Spanish language (primary)
- **FR16.2**: English language (secondary)
- **FR16.3**: All UI text, prompts, and guidance in both languages

---

## Non-Functional Requirements

### Performance
- **NFR1.1**: App startup time < 3 seconds
- **NFR1.2**: Quiz completion < 15 seconds between questions
- **NFR1.3**: Tool screens load < 1 second
- **NFR1.4**: API response time < 500ms (p95)

### Security
- **NFR2.1**: Password hashing with bcrypt
- **NFR2.2**: JWT token expiration (24 hours)
- **NFR2.3**: HTTPS/TLS for all API calls
- **NFR2.4**: Input validation and sanitization
- **NFR2.5**: GDPR/LFPDPPP compliance (Mexico privacy law)

### Scalability
- **NFR3.1**: Support 100,000+ concurrent users (using CDN, load balancing)
- **NFR3.2**: Database connection pooling
- **NFR3.3**: Horizontal scaling ready (stateless API)

### Accessibility
- **NFR4.1**: WCAG AA compliance
- **NFR4.2**: Screen reader support
- **NFR4.3**: High contrast mode option
- **NFR4.4**: Text scaling support

### Data Privacy
- **NFR5.1**: No personal data in logs
- **NFR5.2**: User data encrypted at rest
- **NFR5.3**: Clear data deletion policies
- **NFR5.4**: Analytics opt-in during onboarding

---

## User Personas

### Persona 1: María (Stressed Professional)
- Age: 28-35
- Occupation: Corporate professional, manager
- Challenge: Work stress, emotional burnout
- Motivation: Quick tools for stress relief during work
- Tech savvy: High

### Persona 2: Juan (Anxious Youth)
- Age: 18-25
- Occupation: Student/early career
- Challenge: Anxiety, social situations
- Motivation: Understanding emotions, coping mechanisms
- Tech savvy: Very high

### Persona 3: Sofía (Wellness Enthusiast)
- Age: 35-45
- Occupation: Self-employed, wellness-oriented
- Challenge: Personal growth, emotional intelligence
- Motivation: Self-knowledge, premium plans for long-term development
- Tech savvy: Medium-High

### Persona 4: Carlos (Crisis Support Seeker)
- Age: Any
- Challenge: Mental health crisis, need immediate help
- Motivation: Stabilization, emergency resources
- Tech savvy: Variable

---

## Use Cases

### UC1: Onboarding New User
1. User opens app for first time
2. Sees welcome screen with value proposition
3. Grants permissions (notifications, analytics)
4. Registers via email/Google/Apple
5. Completes archetype quiz
6. Completes EI baseline assessment
7. Views results screens
8. Accesses home screen (ready to use tools)

### UC2: Using Calm Breath Tool
1. User navigates to home screen
2. Taps "Calm Breath" tool card
3. Sees intro screen with instructions
4. Reviews time estimate (5 min)
5. Clicks "Comenzar"
6. Follows 5 breathing cycles (animations + audio)
7. Provides post-tool mood check-in
8. Optional: Adds reflection note
9. Returns to home or tries another tool

### UC3: Accessing Archetype Information
1. User views profile screen
2. Sees archetype card
3. Clicks "Entender más" to expand
4. Reads detailed archetype description, strengths, growth areas
5. Optionally re-takes quiz to change archetype

### UC4: Emergency Crisis Response
1. User in crisis state
2. Navigates to Crisis Protocol tool
3. Follows stabilization steps
4. Accesses emergency resources
5. Calls/texts emergency number directly from app

---

## Acceptance Criteria

### AC1: Authentication
- [ ] User can register with valid email
- [ ] User can login with correct credentials
- [ ] User sessions persist across app restarts
- [ ] User can logout and lose session
- [ ] Invalid credentials show error message

### AC2: Archetype Quiz
- [ ] 7 questions displayed one per screen
- [ ] User can select answer (1-5 scale)
- [ ] User can edit answer by going back
- [ ] Progress bar shows current question
- [ ] Quiz completes in < 5 minutes
- [ ] Results returned match scoring algorithm

### AC3: EI Assessment
- [ ] 16 questions displayed sequentially
- [ ] Likert scale (1-5) with Spanish labels
- [ ] User can review and edit answers
- [ ] Assessment completes in 8-10 minutes
- [ ] Scores calculated correctly (0-100 range)
- [ ] Results saved to backend

### AC4: Tool Execution
- **Calm Breath**:
  - [ ] Animation cycles 5 times correctly
  - [ ] Audio guidance plays for each step
  - [ ] Duration approximately 5 minutes
  - [ ] Pre/post mood tracked
  
- **Ground Yourself**:
  - [ ] 5-4-3-2-1 prompts in order
  - [ ] Text input captured for each level
  - [ ] User can complete in 3-5 minutes
  
- **Quick Write**:
  - [ ] Prompts shown in sequence
  - [ ] Text saved locally
  - [ ] Timer visible
  - [ ] Word count displayed

### AC5: Data Accuracy
- [ ] Mood delta calculated correctly (after - before)
- [ ] Tool usage times match actual duration
- [ ] Scores normalized correctly to 0-100 range
- [ ] Emergency resources verified as current/valid

### AC6: Localization
- [ ] All UI text available in Spanish and English
- [ ] User language preference persists
- [ ] Archetype names/descriptions translated correctly
- [ ] Assessment prompts culturally appropriate

---

## Out of Scope (Deferred to v1.1+)

- Personalized development plans
- Journal/bitácora system
- Module progression system
- Re-evaluations (scheduled)
- Advanced graphics & gamification
- Wearable integration
- Video content
- Therapist matching

---

**Created**: 2026-03-29  
**Last Updated**: 2026-03-29  
**Owner**: Development Team
