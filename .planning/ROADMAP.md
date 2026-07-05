# Project Roadmap: PHC Copilot

## Phases

- [ ] **Phase 1: Project Setup & Core App Shell** - Scaffolds the Next.js app, configures the App Shell, and builds the Splash, Onboarding slides, basic Dashboard Shell, and Settings page with static layouts.
- [ ] **Phase 2: High-Fidelity Feature Mock UIs** - Implements detailed static screens and mock data for Medicine Inventory, Patient Footfall charts, Doctor Attendance roster, and AI Daily Briefing.
- [ ] **Phase 3: Local Persistence & Interactive Prototype** - Integrates React hooks and `localStorage` to make all widgets interactive (adding medicines, updating stock, toggling attendance, recalculating metrics locally).
- [ ] **Phase 4: Google Gemini API Integration** - Connects the frontend to secure serverless API routes that call Gemini 2.5 Flash to generate real operations briefings and analysis.
- [ ] **Phase 5: Google Cloud Firestore Database** - Migrates state management from `localStorage` to Google Cloud Firestore database for multi-device sync.
- [ ] **Phase 6: Cloud Deployment & Responsive Polish** - Deploys to Firebase Hosting/Cloud Run, finalizes responsive layouts, and applies premium Material 3 micro-animations.

---

## Phase Details

### Phase 1: Project Setup & Core App Shell
**Goal**: Initialize the Next.js workspace and construct the basic app navigation, Splash screen, Onboarding flow, basic Dashboard layout, and Settings page with static mock layouts.
**Depends on**: None
**Requirements**: ONBD-01, ONBD-02, ONBD-03, ONBD-04, DASH-01, DASH-04, SETT-01
**Success Criteria**:
  1. User can load the app, view the Splash screen fade animation, and click through 3 onboarding slides to reach the dashboard.
  2. The sidebar navigation (desktop) collapses into a bottom navigation bar (mobile) successfully.
  3. The main App Shell displays the greeting header and current date.
  4. The Settings page displays forms for profile management and entering API keys.
**Plans**: [.planning/phases/01-project-setup-core-app-shell/01-PLAN.md](file:///c:/Users/ASUS/phc%20copilot/.planning/phases/01-project-setup-core-app-shell/01-PLAN.md), [.planning/phases/01-project-setup-core-app-shell/02-PLAN.md](file:///c:/Users/ASUS/phc%20copilot/.planning/phases/01-project-setup-core-app-shell/02-PLAN.md)
**UI hint**: yes

### Phase 2: High-Fidelity Feature Mock UIs
**Goal**: Build detailed mock UI views and static data models for the core operational screens: Medicine Inventory, Patient Footfall, Doctor Attendance, and AI Daily Briefing.
**Depends on**: Phase 1
**Requirements**: DASH-02, MED-01, MED-02, FOOT-01, FOOT-02, ATT-01, ATT-02, BRIEF-01, BRIEF-04
**Success Criteria**:
  1. Medicine Inventory page displays a table with mock medicines, usage statistics, and colored warning chips.
  2. Patient Footfall page displays mock daily and weekly charts using Recharts, plus a static peak hour graph.
  3. Doctor Attendance page displays a roster of mock doctors with status indicators.
  4. Daily Briefing page renders a detailed static mock text summary and action checklist.
**Plans**: [.planning/phases/02-high-fidelity-feature-mock-uis/01-PLAN.md](file:///c:/Users/ASUS/phc%20copilot/.planning/phases/02-high-fidelity-feature-mock-uis/01-PLAN.md), [.planning/phases/02-high-fidelity-feature-mock-uis/02-PLAN.md](file:///c:/Users/ASUS/phc%20copilot/.planning/phases/02-high-fidelity-feature-mock-uis/02-PLAN.md)
**UI hint**: yes

### Phase 3: Local Persistence & Interactive Prototype
**Goal**: Wire up client-side state using React hooks and persist all state modifications to `localStorage`, allowing the user to experience the complete app flow locally.
**Depends on**: Phase 2
**Requirements**: DASH-03, MED-03, MED-04, FOOT-03, ATT-03, BRIEF-02, BRIEF-03, SETT-02
**Success Criteria**:
  1. User can add new medicine items or update stock, causing the stock count and remaining days to recalculate immediately.
  2. User can toggle a doctor's attendance status to Absent/Present, causing the coverage percentage and mock waiting time impact to update instantly.
  3. Action checklist items can be ticked off, updating the active count.
  4. All modified state remains intact across browser refreshes using `localStorage`.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Google Gemini API Integration
**Goal**: Establish secure API routes in Next.js to call Google Gemini 2.5 Flash, generating real briefings and reorder logic based on the user's active state.
**Depends on**: Phase 3
**Requirements**: None (integrates AI backend)
**Success Criteria**:
  1. Clicking "Generate Briefing" queries Gemini with the current local state and returns today's actual summary and checklist.
  2. Medicine detail modal displays genuine AI reorder reasoning based on the inventory usage and historical footfall.
  3. Doctor absenteeism impact analysis is generated dynamically by Gemini based on which specific roles are missing.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Google Cloud Firestore Database
**Goal**: Integrate Google Cloud Firestore, syncing all medicine data, doctor shifts, and patient counts to a cloud database instead of `localStorage`.
**Depends on**: Phase 4
**Requirements**: None (database migration)
**Success Criteria**:
  1. Data loads from Firestore collections on component mount.
  2. Any addition, stock change, or attendance toggle is written directly to Firestore.
  3. Data updates are synced in real-time across multiple active browser sessions.
**Plans**: TBD
**UI hint**: yes

### Phase 6: Cloud Deployment & Responsive Polish
**Goal**: Deploy the web app to Firebase Hosting and backend API routes to Cloud Run/Vercel, complete a responsive layout audit, and add micro-animations and transition styles.
**Depends on**: Phase 5
**Requirements**: None (deployment and polish)
**Success Criteria**:
  1. App is fully hosted and accessible via a public HTTPS URL.
  2. Interface operates flawlessly across mobile, tablet, and desktop viewports.
  3. Visuals are premium: glassmorphic nav bars blur, buttons ripple, and data charts animate.
**Plans**: TBD
**UI hint**: yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| Phase 1: Project Setup & Core App Shell | 2/2 | Executed | 2026-07-05 |
| Phase 2: High-Fidelity Feature Mock UIs | 2/2 | Executed | 2026-07-05 |
| Phase 3: Local Persistence & Interactive Prototype | 0/0 | Not started | - |
| Phase 4: Google Gemini API Integration | 0/0 | Not started | - |
| Phase 5: Google Cloud Firestore Database | 0/0 | Not started | - |
| Phase 6: Cloud Deployment & Responsive Polish | 0/0 | Not started | - |

---
*Last updated: 2026-07-05 after initial definition*
