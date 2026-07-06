# Phase 3: Local Persistence & Interactive Prototype - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Wires up client-side state management with localStorage persistence through a Repository pattern, making all mock UIs interactive. Covers CRUD on medicines (add/edit stock), toggling doctor attendance, ticking off dashboard action items, and persisting all changes across browser refreshes. Implements a clean abstraction layer that Phase 5 can swap to Firestore without touching UI components.

**Requirements in scope:** DASH-03, MED-03, MED-04, FOOT-03, ATT-03, BRIEF-02, BRIEF-03, SETT-02

</domain>

<decisions>
## Implementation Decisions

### Architecture: Repository Pattern
- **D-01:** Create `src/repositories/` directory with interface + localStorage implementation split. Each domain gets:
  - An interface file (e.g., `IMedicineRepository.ts`) defining the contract.
  - A localStorage implementation (e.g., `LocalMedicineRepository.ts`) implementing the interface.
  - Phase 5 will add `FirestoreMedicineRepository.ts` implementing the same interface.
- **D-02:** UI components MUST NEVER access `localStorage` directly. All CRUD operations flow through repository methods only.
- **D-03:** Keep business logic (calculations, validations, status derivations) separate from UI — repository or utility layer.

### State Management: Custom Hooks
- **D-04:** Use custom React hooks per domain as the component-facing API:
  - `useMedicines()` — returns medicine list, add/update/delete methods, search/filter state.
  - `useDoctors()` — returns doctor list, toggle attendance method, coverage stats.
  - `useFootfall()` — returns footfall records, predictions.
  - `useBriefing()` — returns briefing state, regenerate method.
  - `useSettings()` — returns API mode, key, update methods.
- **D-05:** Hooks internally instantiate and call the repository. Components only import hooks — never repositories directly.
- **D-06:** Hooks manage React state (`useState`/`useReducer`) and sync to localStorage via the repository on mutations.

### Data Models & Firestore Alignment
- **D-07:** Reuse existing interfaces from `src/types/store.ts` (Medicine, Doctor, FootfallRecord, HourlyLoad). Extend as needed for new fields (e.g., checklist items, settings).
- **D-08:** Repository interface methods should mirror Firestore SDK patterns: `getAll()`, `getById()`, `create()`, `update()`, `delete()` — making Phase 5 migration a drop-in replacement.

### Settings Page (SETT-02)
- **D-09:** Implement a dropdown with modes (Mock / Live) and a separate section for API key input with a "Test Connection" button.
- **D-10:** Store the API key and mode preference in localStorage via the settings repository.
- **D-11:** Phase 4 will read this setting to decide whether to call Gemini or return mock responses.

### Interactive Features by Screen
- **D-12:** Medicines (`MED-03, MED-04`): Add new medicine form, update stock quantities, recalculate `daysRemaining` and `riskLevel` in real-time. Reorder modal shows prediction reasoning.
- **D-13:** Attendance (`ATT-03`): Toggle doctor status between Present/Absent/On Leave. Coverage percentage and AI impact card update instantly.
- **D-14:** Dashboard (`DASH-03`): Action checklist items can be ticked/unticked, active count updates. Persist checklist state.
- **D-15:** Briefing (`BRIEF-02, BRIEF-03`): Briefing regeneration triggers re-synthesis. "Why?" accordion expanded reasoning persists.
- **D-16:** Footfall (`FOOT-03`): Prediction card displays predicted OPD volume, peak hour risk, and AI staffing recommendation.

### Code Quality Standards
- **D-17:** Follow SOLID principles throughout. Clean, modular, scalable, production-ready TypeScript.
- **D-18:** Write all repository interfaces with generic patterns where appropriate for reuse.

</decisions>

<canonical_refs>
## Canonical References

### Project Specs
- `prd.md` — Product requirement definitions.
- `ui.md` — UI screen structures and requirements.
- `DESIGN.md` — Spacing, color codes, and visual specifications.
- `.planning/REQUIREMENTS.md` — Requirement IDs and traceability.

### Prior Phase Context
- `.planning/phases/02-high-fidelity-feature-mock-uis/02-CONTEXT.md` — Phase 2 decisions on mock data schemas and Firestore alignment.

### Existing Code
- `src/types/store.ts` — Existing Firestore-aligned interfaces (Medicine, Doctor, FootfallRecord, HourlyLoad).
- `src/mocks/medicines.ts`, `src/mocks/doctors.ts`, `src/mocks/footfall.ts` — Mock seed data to initialize localStorage on first load.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/store.ts` — Medicine, Doctor, FootfallRecord, HourlyLoad interfaces already defined.
- `src/mocks/` — Seed data files that will serve as initial localStorage population.
- `src/app/medicines/page.tsx` — Static medicines grid to be wired with hooks.
- `src/app/attendance/page.tsx` — Static roster to be wired with toggle hooks.
- `src/app/dashboard/page.tsx` — Action checklist to be wired with checkbox state.
- `src/app/briefing/page.tsx` — Briefing page to be wired with regeneration state.
- `src/app/footfall/page.tsx` — Footfall charts to be wired with live data hooks.
- `src/app/settings/page.tsx` — Settings page to be updated with API mode toggle.

### Integration Points
- Repository layer goes in new `src/repositories/` directory.
- Custom hooks go in new `src/hooks/` directory.
- Pages import hooks, hooks import repositories — clean dependency chain.

</code_context>

<specifics>
## Specific Ideas
- Initialize localStorage with mock seed data on first visit (check for existence before seeding).
- Repository `storageAdapter` base could provide common get/set/remove JSON serialization.
- `daysRemaining` and `riskLevel` should be computed properties — recalculated on every stock or usage change, not stored as raw values.

</specifics>

<deferred>
## Deferred Ideas
- Actual Google Gemini API integration is deferred to Phase 4.
- Firestore cloud sync is deferred to Phase 5.
- Offline mode with background sync is deferred to v2 (OFFL-01).

</deferred>

---

*Phase: 3-Local Persistence & Interactive Prototype*
*Context gathered: 2026-07-06*
