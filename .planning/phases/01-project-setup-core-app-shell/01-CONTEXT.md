# Phase 1: Project Setup & Core App Shell - Context

**Gathered:** 2026-07-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Builds the foundational Next.js App Router workspace, scaffolding the App Shell with desktop sidebar / mobile bottom navigation, and implements the static visual screens for Onboarding, Splash, basic Dashboard layout, and Settings.

</domain>

<decisions>
## Implementation Decisions

### Frontend Architecture & Navigation
- **D-01:** Next.js App Router will be used as the core framework.
- **D-02:** Use Next.js Link and file-based App Router structure (e.g. `/onboarding`, `/dashboard`, `/settings`) with a global `layout.tsx` serving as the App Shell.

### Mock Data & Initial State Strategy
- **D-03:** All mock data will be stored centrally in `src/mocks/` (e.g. `medicines.ts`, `doctors.ts`) to allow easy imports and seamless transition to Firestore database in later phases.
- **D-04:** Use pre-defined static mock arrays for patient footfall trends representing realistic daily and weekly OPD counts to ensure consistent presentation in demo flows.

### Onboarding & Splash Screen Behavior
- **D-05:** Splash Screen transitions automatically via a 2-second timeout and fade-out animation.
- **D-06:** Skip onboarding on subsequent visits using a `first_visit` flag in `localStorage`, but provide a reset button in Settings for easy demo resets.

### Design System & Styling Setup
- **D-07:** Stitch design tokens (Material 3 colors, typography, rounded sizes) will be mapped as CSS custom properties (variables) in `src/app/globals.css`.
- **D-08:** Use premium Glassmorphism (backdrop-filter blurs and translucent colors) and subtle glowing accents.

### the agent's Discretion
- Code organization, typescript types setup, file naming structure.
- Details of Splash Screen fade animation curves and CSS keyframes.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `prd.md` — Core product vision, features, and success criteria.
- `ui.md` — Detailed screen layout descriptions and UI properties.
- `DESIGN.md` — Color palette, typography, layout grid, and spacing.

### Stitch Design System
- Stitch Design System Asset ID: `36184f3b7f8347758613edbea3f6f675` (created from DESIGN.md).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None (Greenfield project).

### Established Patterns
- None (Greenfield project).

### Integration Points
- None (First phase).

</code_context>

<specifics>
## Specific Ideas

- Provide a "Reset Onboarding" button on the Settings page to clear `first_visit` from `localStorage`, allowing the hackathon presentation team to easily show the onboarding sequence repeatedly.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Project Setup & Core App Shell*
*Context gathered: 2026-07-05*
