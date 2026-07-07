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

### Landing Page, Authentication & Onboarding
- **D-01 (Standalone Public Portal):** Render the Landing Page at `/` as a completely standalone public view without the application App Shell (no sidebar, no bottom navigation). It will feature a premium responsive top navigation bar with links to sections (Vision, Features, Workflow, Impact) and "Get Started" triggers.
- **D-02 (Role Selection & Auth Service):** Implement a centralized Role & Permission Service utilizing Firebase Authentication:
  - **Receptionist:** Enters without password (using Firebase Anonymous Authentication or simple role selection), granting access *only* to `/opd-registration`.
  - **Medical Officer:** Must authenticate using Firebase Auth Email/Password credentials to access `/dashboard`, `/medicines`, `/attendance`, `/briefing`, and `/settings`.
- **D-03 (Role-Based Route Guards):** Restrict router access client-side based on the authenticated user role. Hide sidebar links, bottom navigation options, and edit buttons appropriately (e.g. Receptionists cannot see the sidebar, and Medical Officers cannot see/use edit/delete actions on `/opd-registration`).
- **D-04 (Gated Onboarding):** If a newly logged-in Medical Officer has not completed the onboarding tutorial (`localStorage` check `phc_first_visit_complete`), redirect them to the 3-step onboarding flow before they can access the dashboard.

### Digital OPD Registration & Single Source of Truth
- **D-05 (unified Patients Collection):** Reorganize patient data to use a single Firestore collection: `patients`. The seeder will populate 50-100 realistic patient documents spanning the past week (each with age, gender, department, symptoms, and registeredAt timestamps).
- **D-06 (Dynamic Footfall Aggregation):** Refactor the Patient Footfall charts and statistics (daily/weekly counts, peak hours, predicted surgings) to aggregate dynamically from the `patients` collection's timestamps, removing the redundant `footfall` collection.
- **D-07 (OPD Form Fields & Validation):** Build the registration form at `/opd-registration` validating required fields (Age, Gender, Department, Symptoms, Visit Type) and saving records immediately to Firestore. On registration, the dashboard metrics must increment in real time using `onSnapshot` listeners.
- **D-08 (Search & Filter Table):** Implement a "Today's Registrations" table supporting client-side filtering (by Today/Yesterday, Department, Visit Type, Gender) and query search (by ID, Name, Symptoms).

### AI Integration
- **D-09 (Gemini Surge Inputs):** Refactor the Gemini API proxy route to pull actual patient symptoms, age groups, and departments registered in the `patients` collection over the past week to generate accurate surges, alerts, and daily briefings.

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
