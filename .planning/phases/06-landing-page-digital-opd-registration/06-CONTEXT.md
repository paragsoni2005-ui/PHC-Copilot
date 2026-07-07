# Phase 6: Landing Page & Digital OPD Registration - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase implements the entry experience of PHC Copilot. It consists of:
1. **Landing Page:** Introduces PHC Copilot, explains the product vision, showcases major features, provides role-based entry paths for Receptionists and Medical Officers, and features premium Framer Motion animations.
2. **Digital OPD Registration:** Replaces the paper-based register with a digital form, auto-generates IDs and timestamps, saves entries directly to Firestore, and syncs patient counts dynamically with the Medical Officer's dashboard using real-time listeners. It also displays today's registrations with queryable search and filters.

**Requirements in scope:**
- **Landing Page & Access Shell (LND)**: LND-01, LND-02, LND-03, LND-04, LND-05, LND-06
- **Digital OPD Registration (OPD)**: OPD-01, OPD-02, OPD-03, OPD-04, OPD-05, OPD-06

</domain>

<decisions>
## Implementation Decisions

### Landing Page & Navigational Flow
- **D-01 (Role-Based CTA Navigation):** Introduce a clean landing page at the root route (`/`). The page contains two distinct paths:
  - **Receptionist path:** CTAs navigate to `/opd-registration` to allow quick patient intake.
  - **Medical Officer path:** CTAs navigate to `/dashboard` to allow monitoring.
- **D-02 (Aesthetics & Animations):** Design a premium landing page using vanilla CSS glassmorphism, modern typography, and Framer Motion for hero illustrations and timelines.
- **D-03 (Navigation Control):** The app shell sidebar or bottom navigation should hide or adapt when viewing the landing page to preserve the entry page layout.

### OPD Registration & Firestore Integration
- **D-04 (Patients Collection Schema):** Store registered patients in a new Firestore collection named `patients`. Document fields must include:
  - `patientId`: string (unique auto-generated ID)
  - `name`: string (optional)
  - `age`: number (required)
  - `gender`: string (required)
  - `village`: string (required)
  - `phone`: string (optional)
  - `department`: string (required)
  - `symptoms`: string (required)
  - `visitType`: 'new' | 'follow-up' (required)
  - `registeredAt`: timestamp (auto-generated current date/time)
  - `createdBy`: string (e.g., 'receptionist')
  - `status`: string (e.g., 'waiting', 'completed')
- **D-05 (Real-time Dashboard Integration):** Connect the patient registrations to the active dashboard metrics. Incrementing today's patient count must be updated in real time via Firestore `onSnapshot` listeners without manual refreshes.
- **D-06 (Table Actions & Controls):** Today's Registrations table allows searching (by ID, Name, or Symptoms) and filtering (by Today/Yesterday, Department, Visit Type, and Gender).

### AI Integration
- **D-07 (Gemini Input):** Patient registrations (specifically departments, symptoms, age, and gender) will feed directly into the Daily Briefing generation inputs to allow Gemini to analyze surge trends and disease alerts.

</decisions>

<canonical_refs>
## Canonical References

### PRD Document
- `prd2.md` — The complete landing page & digital OPD registration requirements and design spec.

### Firebase/Firestore SDK Docs
- `https://firebase.google.com/docs/firestore` — Client Firestore updates and snapshot listeners.

</canonical_refs>

<code_context>
## Code Context

### Reusable Assets
- `src/lib/firebase.ts` — Existing Firestore client config and db reference.
- `src/repositories/` — Create `FirestorePatientRepository` implementing `IPatientRepository` for CRUD and live listeners.
- `src/hooks/` — Create `usePatients.ts` for managing registration list, search/filter state, and sync hooks.

### Integration Points
- `/` or `/page.tsx` — Landing page view.
- `/opd-registration` — Registration form and today's patients list.
- `/dashboard` — Make sure dashboard hooks subscribe to the new `patients` collection to aggregate real-time counts instead of relying entirely on static seeder data.

</code_context>

<specifics>
## Specific Ideas
- Use Framer Motion for smooth entrances: fade-ins for cards and slide-ups for the timeline process.
- Implement registration form fields matching material design specifications with clean styling classes.

</specifics>

<deferred>
## Deferred Ideas
- Offline registration storage and retry logic (deferred for post-hackathon versions).
- Direct SMS receipts to patients (deferred to minimize external API dependencies).

</deferred>

---

*Phase: 06-landing-page-digital-opd-registration*
*Context gathered: 2026-07-07*
