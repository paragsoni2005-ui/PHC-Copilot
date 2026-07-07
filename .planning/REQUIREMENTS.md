# Requirements: PHC Copilot

**Defined:** 2026-07-05
**Core Value:** Provide clear, actionable operational recommendations within 30 seconds of opening the dashboard.

## v1 Requirements

Requirements for the initial release. Each maps to roadmap phases.

### Onboarding & Shell (ONBD)

- [ ] **ONBD-01**: Splash screen displays logo, health cross + AI spark icon, and subtle fade-in loading animation.
- [ ] **ONBD-02**: Three onboarding screens describing dashboard features (Operations, Decision Support, Proactive Planning) with Skip/Next buttons.
- [ ] **ONBD-03**: App Shell with sidebar navigation on desktop/tablet (Width: 280px) and bottom navigation on mobile.
- [ ] **ONBD-04**: App Shell displays Greeting header ("Good Morning, Doctor"), date/time, and notification alerts.

### AI Operations Dashboard (DASH)

- [ ] **DASH-01**: central dashboard displaying summary cards for Medicine Alerts, Patient Footfall, Doctors Present, and Critical Issues.
- [ ] **DASH-02**: "Today's Alerts" timeline displaying critical warnings (e.g. absent doctors, low stock) with priority-colored status badges.
- [ ] **DASH-03**: Interactive "AI Action Plan" checklist where users can check/uncheck priority tasks.
- [ ] **DASH-04**: One-click prompt button to quickly navigate to the AI Daily Briefing screen.

### Smart Medicine Inventory (MED)

- [ ] **MED-01**: Inventory grid displaying Medicine Name, Current Stock, Average Daily Usage, Days Remaining, and Status.
- [ ] **MED-02**: Days Remaining prediction calculated automatically (`Current Stock / Daily Usage`). Status badges indicate:
  - Critical (Red, < 3 days remaining)
  - Warning (Amber, 3-7 days remaining)
  - Safe (Green, > 7 days remaining)
- [ ] **MED-03**: Form to add new medicines and update stock.
- [ ] **MED-04**: Detailed Prediction Modal showing reorder recommendations and mock/real AI reasoning.

### Patient Footfall Analytics (FOOT)

- [ ] **FOOT-01**: Charts showing historical patient footfall (Line chart for daily count, Bar chart for weekly comparison).
- [ ] **FOOT-02**: Peak Hour area chart visualizing workload distribution.
- [ ] **FOOT-03**: Prediction Card displaying predicted OPD patients tomorrow, peak hour workload risk level, and AI recommendations.

### Doctor Attendance Monitor (ATT)

- [ ] **ATT-01**: Roster listing doctor cards with department, shift, avatar, and Present/Absent/On-Leave toggle.
- [ ] **ATT-02**: Real-time summary statistics showing Present/Absent counts and Coverage Percentage.
- [ ] **ATT-03**: AI Impact Card updating waiting time and shift recommendations based on absentee status.

### AI Daily Briefing (BRIEF)

- [ ] **BRIEF-01**: One-click Daily Briefing generation screen showing Gemini logo and typing effect.
- [ ] **BRIEF-02**: Natural Language operational summary detailing shortages, absenteeism, and surge risk.
- [ ] **BRIEF-03**: "Why this recommendation?" accordion detailing the AI reasoning and confidence score.
- [ ] **BRIEF-04**: Action buttons to download, copy, or regenerate the briefing.

### Settings & Administration (SETT)

- [ ] **SETT-01**: Profile section with user details and roles (Doctor, Admin, Pharmacist).
- [ ] **SETT-02**: Configuration to toggle between mock AI mode and live Google AI Studio API (entering Gemini API key).

### Landing Page & Access Shell (LND)

- [ ] **LND-01**: Hero section features product name "PHC Copilot", tagline, and subtitle explaining the Next.js/Firestore/Gemini architecture.
- [ ] **LND-02**: Role-based entry CTAs: "Register Patients" (routes to `/opd-registration` for Receptionists) and "Medical Officer Dashboard" (routes to `/dashboard` for Medical Officers).
- [ ] **LND-03**: Premium hero section animation using Framer Motion (clinic, doctors, patients, AI glow, and dashboard preview).
- [ ] **LND-04**: Feature highlights section displaying glassmorphic cards (OPD registration, inventory, attendance, footfall analytics, AI briefing, alerts).
- [ ] **LND-05**: Interactive workflow roadmap diagram (Patient Arrives -> Receptionist Registers -> Dashboard Updates -> Gemini Insights).
- [ ] **LND-06**: Technology stack section with logos and impact benefits summary cards.

### Digital OPD Registration (OPD)

- [ ] **OPD-01**: Registration form with inputs for Name (optional), Age (required), Gender (required), Visit Type (required: New/Follow-up), Department (required), Symptoms (required), Village (required), and Phone (optional).
- [ ] **OPD-02**: Friendly validation errors on form submission for missing required fields.
- [ ] **OPD-03**: Registration assigns a unique registration ID and timestamp, then saves the document directly to Firestore in a new `patients` collection.
- [ ] **OPD-04**: Today's Registrations table displaying registered patients with fields: ID, Time, Age, Gender, Department, Symptoms, Visit Type, Status, and Actions (View, Edit, Delete).
- [ ] **OPD-05**: Search bar to query table by Registration ID, Name, or Symptoms, plus filters for Today, Yesterday, Department, Visit Type, and Gender.
- [ ] **OPD-06**: Real-time sync using `onSnapshot` listeners to automatically increment dashboard counters and update footfall graphs upon patient registration.

---

## v2 Requirements

Deferred to future releases.

- **VOIC-01**: Voice input for adding medicines or reporting attendance.
- **VOIC-02**: Voice output reading the Daily Operations Briefing out loud.
- **TRND-01**: Automated disease trend detection mapping regional fevers or virus surges.
- **CHAT-01**: Conversational AI Chat Assistant for querying inventory or analytics.
- **OFFL-01**: Offline mode storing state locally and syncing on reconnect.

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-PHC dashboard | Increases initial complexity; focused on single centre. |
| Patient Medical Records (EMR) | Focus of MVP is operational logistics, not clinical history. |
| SMS Notifications | Avoid external API costs and integration overhead for prototype. |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ONBD-01 | Phase 1 | Pending |
| ONBD-02 | Phase 1 | Pending |
| ONBD-03 | Phase 1 | Pending |
| ONBD-04 | Phase 1 | Pending |
| DASH-01 | Phase 1 | Pending |
| DASH-02 | Phase 2 | Pending |
| DASH-03 | Phase 3 | Pending |
| DASH-04 | Phase 1 | Pending |
| MED-01 | Phase 2 | Pending |
| MED-02 | Phase 2 | Pending |
| MED-03 | Phase 3 | Pending |
| MED-04 | Phase 3 | Pending |
| FOOT-01 | Phase 2 | Pending |
| FOOT-02 | Phase 2 | Pending |
| FOOT-03 | Phase 3 | Pending |
| ATT-01 | Phase 2 | Pending |
| ATT-02 | Phase 2 | Pending |
| ATT-03 | Phase 3 | Pending |
| BRIEF-01 | Phase 2 | Pending |
| BRIEF-02 | Phase 3 | Pending |
| BRIEF-03 | Phase 3 | Pending |
| BRIEF-04 | Phase 2 | Pending |
| SETT-01 | Phase 1 | Pending |
| SETT-02 | Phase 3 | Pending |
| LND-01 | Phase 6 | Pending |
| LND-02 | Phase 6 | Pending |
| LND-03 | Phase 6 | Pending |
| LND-04 | Phase 6 | Pending |
| LND-05 | Phase 6 | Pending |
| LND-06 | Phase 6 | Pending |
| OPD-01 | Phase 6 | Pending |
| OPD-02 | Phase 6 | Pending |
| OPD-03 | Phase 6 | Pending |
| OPD-04 | Phase 6 | Pending |
| OPD-05 | Phase 6 | Pending |
| OPD-06 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 36
- Unmapped: 0 ✓

---
*Last updated: 2026-07-07 after adding Landing Page & Digital OPD Registration Phase*
