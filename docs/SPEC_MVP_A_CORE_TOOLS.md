# ARQUETIPOS SELF-CARE — MVP SPEC OPTION A
## Core Evaluation + Quick Tools Only

**Focus:** Launch fastest, validate market demand, establish user base  
**Estimated Timeline:** 10-12 weeks development  
**Target Release:** Q3 2026 (Mexico)  
**Success Metric:** 5,000+ installed, 35%+ D7 retention, 40%+ D30 retention

---

## 1. PRODUCT OVERVIEW

### Positioning
A lightweight emotional intelligence assessment app with immediate, practical tools. Users get evaluated, understand their archetype + emotional baseline, then access on-demand coping tools. Premium tier unlocks detailed plans & tracking.

### Not Included (Defer to v1.1+)
- Personalized development plans  
- Journal/bitácora system
- Module progression system  
- Re-evaluations
- Advanced graphics & gamification

---

## 2. CORE USER FLOWS

### Flow 1: Onboarding → Assessment → Profile
```
1. Welcome Screen (2 screens)
   - Brand introduction + value prop
   - App permissions (notifications, analytics opt-in)

2. Authentication (2 screens)
   - Email/Google/Apple Sign-up
   - Email verification (if needed)

3. Archetype Assessment (1 screen, 7 questions)
   - Quick-fire quiz identifying predominant archetype
   - Format: Single-select, Likert 1-5
   - Time: ~3 minutes
   - Output: Primary archetype + 2-3 secondary archetypes
   - Example: "I feel most fulfilled when: (A) helping others, (B) discovering new things, (C) leading change..."

4. EI Baseline Assessment (2-3 screens)
   - 16 Goleman-Boyatzis questions (2 competencies × 8 items)
   - Format: Scenario-based + Likert
   - Time: ~8-10 minutes
   - Output: Scores for Autoconciencia (0-100) & Autogestión (0-100)
   - Example scenario: "Your manager critiques your work in front of the team. Tomorrow you present again. How easily do you focus? (1=Very difficult, 5=Very easy)"

5. Results Screen (2 screens)
   - Archetype card: Name, description, strengths, growth areas
   - EI Baseline radar chart (2 dimensions)
   - Personalized message based on archetype + scores
   - CTA: "Explore Tools Now" or "Try Premium Plan"
```

### Flow 2: Quick Tool Selection & Use
```
1. Home Screen
   - User greeting (name + archetype icon)
   - 5 quick tool cards (large, easy tap):
     * 🌬️ Calm Breath (stress)
     * 🨘 Ground Yourself (anxiety)
     * 📝 Quick Write (sadness)
     * 🆘 Crisis Help (emergency)
     * ✨ Pause + Reflect (general)
   - Each tool shows: name, time estimate (2-5 min), benefit
   - Secondary nav: Profile, Settings, Resources

2. Tool Selection Screen (per tool type)
   - e.g., "Calm Breath"
   - Description of what it does
   - How long it takes
   - Start button (large)

3. Tool Execution Screen
   - Guided, step-by-step experience
   - Example (Calm Breath):
     * Intro: "Let's calm your nervous system. Find a quiet place."
     * Step 1: "Breathe in for 4 counts" (animation)
     * Step 2: "Hold for 4 counts"
     * Step 3: "Exhale for 4 counts"
     * Repeat 5 times
     * Outro: "Well done. How do you feel?" (simple check-in)
   - Haptic feedback & sound effects (optional)

4. Post-Tool Check-in
   - "How do you feel now?" (0-10 scale)
   - Optional quick reflection: "What helped?" (text input)
   - Share result (optional) or "Do Another" / "Back Home"
```

### Flow 3: Profile & Settings
```
1. My Profile Screen
   - Archetype card (large)
   - EI scores snapshot (radar chart)
   - "Learn More About Your Archetype" (expandable)
   - Usage stats: "Tools used: 12 times"
   - Buttons: Edit Profile, Change Archetype (quiz again)

2. Settings Screen
   - Notifications: On/Off (time of day)
   - Theme: Light/Dark
   - Language: Español / English
   - Premium: "Upgrade" CTA
   - Help & Support
   - About / Legal (Privacy, Terms, Disclaimer)
```

---

## 3. SCREEN SPECIFICATIONS

### 3.1 Welcome Screen (Onboarding - Screen 1)
**Purpose:** Introduce app & value  
**Elements:**
- Logo + brand color (header, 20% height)
- Hero text: "Entiende tu mundo emocional"
- Subheader: "Herramientas prácticas de autocuidado en tu bolsillo"
- 3 benefit bullets (icons + text):
  - "Evaluación de tu inteligencia emocional"
  - "Herramientas de inmediato para estrés, ansiedad y animo"
  - "Acceso a archivos psicológicos personalizados"
- "Comenzar" button (primary, full width)
- "Opt-in for notifications" toggle (optional)
- Privacy disclaimer (small text, link to terms)

**Metrics:**
- Button tap tracking
- Time to action
- Opt-in rate (notifications)

---

### 3.2 Archetype Quiz Screen (Screen 3-9)
**Purpose:** Quick identification of user's dominant archetype  
**Format:** 7 single-screen questions, card-based

**Each Card:**
- Question (large, readable)
- 5 answer options (radio buttons or cards)
- Example question:
  ```
  "¿Qué te motiva más en la vida?"
  A) Ayudar a los demás ❤️
  B) Descubrir nuevas cosas 🔍
  C) Lograr mis objetivos 🎯
  D) Entender mis emociones 🧠
  E) Proteger lo que amo 🛡️
  ```
- Progress bar (7 of 7)
- Navigation: Next button (enabled after selection)
- Back button for editing

**Output Logic:**
- Score each archetype (total 8):
  - El Héroe (hero/warrior)
  - El Sabio (sage/knower)
  - El Amante (lover/connector)
  - La Sombra (shadow/healer)
  - El Cuidador (caregiver)
  - La Jungla (explorer)
  - El Mago (magician/transformer)
  - El Inocente (innocent/optimist)
- Sort by score, return top 3
- Send to backend for storage

---

### 3.3 EI Assessment Screen (Screen 10-12)
**Purpose:** Measure baseline emotional intelligence (Goleman-Boyatzis 2 competencies)

**Layout (per screen):**
- Question (top, large)
- 2-3 cards showing:
  - Scenario description (short narrative)
  - Likert scale 1-5 with labels:
    - 1 = "Muy difícil" / "Nunca"
    - 3 = "Moderado"
    - 5 = "Muy fácil" / "Siempre"
  - Example:
    ```
    AUTOCONCIENCIA (Awareness)
    "Tu pareja te critican en una cena con amigos.
    ¿Qué tan bien puedes identificar exactamente qué 
    emoción siente en ese momento?"
    
    [Escala 1-5]
    ```
- Progress bar
- Navigation: Next / Back
- Timer optional (show time if <10 min remaining)

**Question Distribution:**
- **Autoconciencia (8 items):**
  1. Identifying emotions in self
  2. Understanding triggers
  3. Recognizing patterns
  4. Emotional vocabulary
  5. Body awareness
  6. Impact on others
  7. Honest self-assessment
  8. Growth areas awareness

- **Autogestión (8 items):**
  1. Impulse control
  2. Emotional regulation
  3. Stress response
  4. Adaptability
  5. Motivation
  6. Setting boundaries
  7. Communication in conflict
  8. Recovery from setback

**Scoring:**
- Autoconciencia: Sum of 8 items (8-40 raw) → normalize to 0-100
- Autogestión: Sum of 8 items (8-40 raw) → normalize to 0-100
- Send both scores + raw responses to backend

---

### 3.4 Results Screen (Screen 13-14)
**Screen 13: Archetype Card**
- Large archetype illustration/icon
- Archetype name (e.g., "El Héroe")
- Description paragraph (2-3 sentences in Spanish)
- Strengths (3 bullets)
- Growth opportunity (1-2 bullets)
- Secondary archetypes listed below
- "Entder más" expandable section (link to archetype detail page)

**Screen 14: EI Baseline**
- Heading: "Tu Línea Base de Inteligencia Emocional"
- Two-dimensional radar chart:
  - Autoconciencia: 0-100 (right)
  - Autogestión: 0-100 (top)
  - Fill color based on score (green >70, yellow 40-70, red <40)
- Interpretation text:
  ```
  "Tu Autoconciencia es MODERADA (58/100).
  Estás desarrollando capacidad de reconocer tus emociones.
  
  Tu Autogestión es BAJA (35/100).
  Las herramientas de esta app te ayudarán a mejorar."
  ```
- Primary CTA: "Explorar Herramientas" (button)
- Secondary CTA: "Ver Plan Premium" (text link)

---

### 3.5 Home Screen (Main Hub)
**Layout:**
- Header (20% height):
  - Greeting: "¡Hola, [Name]!" with archetype icon
  - Current mood button (icon → opens 0-10 scale, stores locally)

- Quick Tools Section (60% height):
  - 5 tool cards in grid (2 rows, staggered or full-width stack)
  - Each card:
    - Icon + emoji
    - Tool name (bold)
    - Time estimate ("3-5 min")
    - Description ("Calm your nervous system")
    - Tap area (full card)
    - Usage last accessed ("Last used: 2h ago")

- Bottom Navigation (20% height):
  - Icons for: Home, Profile, Settings, Help
  - Active state highlighted

---

### 3.6 Tool Execution: Calm Breath (Example)
**Screen 1 (Intro):**
- Title: "Respiración Calmante"
- Description of what will happen
- "Encuentra un lugar tranquilo" (instruction)
- Timer: "5 minutos"
- Button: "Comenzar"

**Screen 2-6 (Guided Steps):**
- Large breathing animation (circle expanding/contracting)
- Visual cue + audio cue:
  - "Inhala (4 segundos)" - circle expands
  - "Sostén (4 segundos)" - circle holds
  - "Exhala (4 segundos)" - circle contracts
  - Cycle counter: "Ciclo 1 de 5"
- Button: Skip / Continue

**Screen 7 (Outro):**
- Celebratory message: "¡Bien hecho!"
- Question: "¿Cómo te sientes ahora?"
  - Slider 0-10 (before: displayed, after: get score difference)
- Buttons: 
  - "Otra Herramienta" → back to home
  - "Volver al Inicio" → home
- Optional reflection text area: "¿Qué te ayudó?"

---

## 4. TECHNICAL ARCHITECTURE

### 4.1 Frontend (React Native)
```
Estructura:
/src
  /screens
    - WelcomeScreen
    - ArchetypeQuizScreen (×7)
    - EIAssessmentScreen (×3)
    - ResultsScreen (×2)
    - HomeScreen
    - ToolDetailScreen
    - ToolExecutionScreen
    - ProfileScreen
    - SettingsScreen
  /components
    - ArchetypeCard
    - EIRadarChart
    - QuickToolCard
    - BreathingAnimation
    - GroundingGuide
    - etc.
  /services
    - AuthService (Firebase)
    - API client (axios/fetch)
    - LocalStorage (user prefs, offline cache)
  /state
    - Redux or Context (user profile, tool history)
  /assets
    - Icons, illustrations, audio files
  /utils
    - Scoring algorithms
    - LocalNotification scheduler
```

### 4.2 Backend (Node.js + PostgreSQL)
```
Endpoints (MVP A — minimal):

POST /auth/register
  Body: { email, password, firstName }
  Response: { token, user }

POST /auth/login
  Body: { email, password }
  Response: { token, user }

POST /assessments/archetype
  Body: { userId, answers: [1-7 choices] }
  Response: { archetype: { name, desc, img }, secondary: [...] }

POST /assessments/ei-baseline
  Body: { userId, answers: [16 Likert scores] }
  Response: { autoconciencia: 0-100, autogestión: 0-100, interpretation }

POST /tools/usage
  Body: { userId, toolId, duration, beforeMood, afterMood, note }
  Response: { ok: true }

GET /user/profile
  Response: { user, archetype, eiScores, toolUsageCount }

GET /resources/emergency
  Response: { resources: [{ country, numbers, links }] }
```

### 4.3 Data Models
```
User
├── id (UUID)
├── email (unique)
├── firstName
├── passwordHash
├── createdAt
├── updatedAt
├── archetype (reference)
├── primaryArchetype (JSON: name, score)
├── secondaryArchetypes (JSON array)
└── settings (JSON: notifications, theme, language)

Archetype
├── id
├── name (text ES/EN)
├── description
├── strengths (array)
├── growthAreas (array)
├── imageUrl
└── scores (calculated from quiz)

Assessment
├── id
├── userId
├── type (enum: archetype, ei-baseline)
├── timestamp
├── answers (JSON array)
├── results (JSON: scores, interpretation)
└── version (for A/B testing)

ToolUsage
├── id
├── userId
├── toolId (enum: breath, ground, write, crisis, pause)
├── timestamp
├── durationSeconds
├── beforeMood (0-10)
├── afterMood (0-10)
├── note (text)
└── moodDelta (calculated)

Tool
├── id (enum)
├── name
├── description
├── duration (seconds)
├── category (stress, anxiety, sadness, crisis, general)
├── steps (JSON array)
└── guidance (text/audio)
```

---

## 5. QUICK TOOLS SPECIFICATIONS

### Tool 1: Calm Breath (Estrés)
**Time:** 5 minutes  
**Mechanism:**
- 5 cycles of 4-4-4 breathing (inhale, hold, exhale)
- Visual animation (expanding/contracting circle)
- Audio guidance (optional)

**Outcomes:**
- Mood before/after
- Session logged to LocalStorage initially, synced to backend

---

### Tool 2: Ground Yourself (Ansiedad)
**Time:** 3-5 minutes  
**Mechanism:**
- 5-4-3-2-1 sensory grounding technique
- Interactive prompts: "Name 5 things you see", "4 you can touch", etc.
- Text input for each level

**Outcomes:**
- Mood before/after
- Grounding responses logged

---

### Tool 3: Quick Write (Tristeza)
**Time:** 5 minutes  
**Mechanism:**
- Prompted journaling (no saving to cloud yet in MVP A)
- Prompts:
  - "What am I feeling right now?"
  - "What triggered this feeling?"
  - "What do I need?"
- Text input, timer, word count

**Outcomes:**
- Local storage only (not synced to backend in MVP A)
- Mood tracking

---

### Tool 4: Crisis Protocol (Emergencia)
**Time:** 2 minutes  
**Mechanism:**
- Stabilization steps:
  1. "Find a safe place"
  2. 5-senses grounding (quick version)
  3. "You are safe" affirmations
- Emergency resources button:
  - Mexico: Línea de la Vida (800-911-2000)
  - International crisis numbers
  - Option to text/call directly from app

**Outcomes:**
- Session logged
- Resources accessed count

---

### Tool 5: Pause + Reflect (General)
**Time:** 2-3 minutes  
**Mechanism:**
- Simple breathing pause
- Guided reflection: "What's one thing I appreciate right now?"
- Positive affirmation based on archetype

**Outcomes:**
- Mood check
- Affirmation logged

---

## 6. MONETIZATION STRATEGY (MVP A)

### Freemium Model:
- **Free Tier:**
  - Unlimited archetype quiz
  - Unlimited EI assessments
  - Unlimited quick tool access (5 tools)
  - Emergency resources
  - Basic profile

- **Premium Tier ($149-199 MXN/month or $8-12 USD):**
  - *(Available but no premium content in MVP A)*
  - UX: "Premium coming soon" or hide features
  - Trial: 7 days free

### Strategy:
1. **Acquisition via Free:** Get users evaluating & using tools
2. **Conversion via**: Teaser for premium (bitácora, plans, re-evaluation)
3. **Expected conversion:** 5-8% of active users

---

## 7. FEATURE FLAGS & PHASING

### Phase 1 (Weeks 1-8): Core Flows
- Registration + Auth
- Archetype quiz (simplified 7Q)
- EI assessment (16Q)
- Results display
- Home screen
- 3 of 5 quick tools (Breath, Ground, Crisis)

### Phase 2 (Weeks 9-10): Remaining Tools + Refinement
- Quick Write tool
- Pause + Reflect tool
- Tool usage logging
- Profile screen
- Settings

### Phase 3 (Weeks 11-12): QA, Polish, Launch Prep
- Bug fixes
- Localization final pass (ES/EN)
- Performance optimization
- App store submission

---

## 8. SUCCESS METRICS (MVP A)

### Acquisition
- Downloads in first 2 weeks
- Target: 5,000+

### Onboarding Funnel
- Welcome → Quiz completion: 85%
- Quiz → Assessment completion: 75%
- Assessment → Home (first tool use): 60%

### Engagement
- D1 retention (day 1 return): 40%+
- D7 retention: 35%+
- D30 retention: 25%+
- Average sessions/week: 2+

### Tool Usage
- Most used tool: (expect Calm Breath)
- Avg tool duration: match specified (5min for calms, 3min for ground, etc.)
- Pre/post mood delta: avg +2 points positive

### Business
- Premium sign-ups: 5-8% of active
- Premium trial completion: 40%+
- Trial-to-paid conversion: 25-35%

---

## 9. LAUNCH READINESS CHECKLIST

- [ ] Privacy Policy (GDPR/LFPDPPP compliant)
- [ ] Terms of Service
- [ ] Emergency resources verified (valid numbers)
- [ ] Credentials check for clinical advisors
- [ ] Accessibility audit (WCAG AA)
- [ ] Localization QA (Spanish/English)
- [ ] iOS & Android testing on real devices
- [ ] App Store / Google Play submission
- [ ] Social media assets ready
- [ ] Press release drafted
- [ ] Beta user feedback incorporated

---

## 10. RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Clinical liability (crisis detection) | High | Clear disclaimer, verified emergency resources, legal review |
| Low retention | High | Fast launch to validate market; iterate based on D7 feedback |
| Poor conversion (free → premium) | Medium | Premium roadmap visible; teasing journal + plans early |
| Technical debt | Medium | Clean code review; automated testing; focus on core flows |
| Localization gaps | Low | QA with native speakers; user feedback loop |

---

**Document Version:** 1.0  
**Status:** Ready for Development Planning  
**Next Step:** Design system + wireframe validation
