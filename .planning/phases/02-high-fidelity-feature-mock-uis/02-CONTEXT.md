# Phase 2: High-Fidelity Feature Mock UIs - Context

**Gathered:** 2026-07-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Builds the high-fidelity mock UI views and static data models for the core operational screens: Medicine Inventory (`/medicines`), Patient Footfall (`/footfall`), Doctor Attendance (`/attendance`), and AI Daily Briefing (`/briefing`). Wires up sidebar and mobile navigation for these pages, integrates the Recharts library for patient analytics, and sets up robust mock data models matching future Firestore schema requirements.

</domain>

<decisions>
## Implementation Decisions

### Navigation & Page Routing
- **D-01:** AI Daily Briefing will be added as a first-class route `/briefing` in the sidebar and bottom mobile navigation rail, in addition to being linked from the Dashboard's "Generate Detailed Recommendations" button.
- **D-02:** All other operational routes (`/medicines`, `/footfall`, `/attendance`) will be enabled in the navigation shell, removing their "Soon" badges and disabled status.

### Data Modeling & Schema Design
- **D-03:** Design mock data structures in `src/mocks/` to model Firestore collections. Components will consume data via standard mock hooks/getters so that in Phase 5, components don't require logic modifications to transition to Firestore.
- **D-04:** Establish specific mock collections:
  - `medicines` collection: `id`, `name`, `stock`, `dailyUsage`, `reorderLevel`, `daysRemaining`, `riskLevel` (low, medium, high), `lastReorderDate`, `dosageForm`.
  - `patient_footfall` collection: historical counts, daily trends, hourly patient load profiles.
  - `doctors` collection: `id`, `name`, `department`, `status` (present, absent, on_leave), `contact`, `specialty`.

### Analytics & Visuals (Recharts)
- **D-05:** Use the `recharts` library to render the historical line chart, weekly comparison bar chart, and peak hours area chart.
- **D-06:** Implement Recharts components with dynamic client-side mounting (`ssr: false` or `useEffect` mount gating) to eliminate Next.js server-side hydration mismatches.

### Design System & Layout
- **D-07:** Adhere strictly to the Stitch Design System tokens (M3 colors, 16px rounded borders, Glassmorphism panels, teal/blue/green/orange color scales).
- **D-08:** Maintain consistent column alignments and spacing (using spacing tokens `space-3`, `space-4`, etc.) to prevent layout overflows.

</decisions>

<canonical_refs>
## Canonical References

### Project Specs
- `prd.md` — Product requirement definitions.
- `ui.md` — UI screen structures and requirements.
- `DESIGN.md` — Spacing, color codes, and visual specifications.

### Stitch Design System
- Stitch Design System Asset ID: `36184f3b7f8347758613edbea3f6f675`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/AppShell.tsx` — Navigation wrapper to be updated to support the new pages.
- `src/app/globals.css` — Styling tokens for grids, glassmorphism, and color variables.

### Integration Points
- Update `navItems` in `src/components/AppShell.tsx` to enable `/medicines`, `/footfall`, `/attendance` and add `/briefing`.

</code_context>

<specifics>
## Specific Ideas
- Set up mock data schemas under `src/types/store.ts` or directly within `src/mocks/` with clear interfaces.
- Use dynamic components from Next.js (`next/dynamic`) to load charts cleanly:
  ```typescript
  const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
  ```

</specifics>

<deferred>
## Deferred Ideas
- Interactive state modifications (adding items, updating stock, toggling attendance) are deferred to Phase 3.
- Actual Google Gemini API integration is deferred to Phase 4.
- Actual Firestore integration is deferred to Phase 5.

</deferred>

---

*Phase: 2-High-Fidelity Feature Mock UIs*
*Context gathered: 2026-07-05*
