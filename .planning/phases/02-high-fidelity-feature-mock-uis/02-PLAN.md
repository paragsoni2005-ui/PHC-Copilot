---
phase: 02-high-fidelity-feature-mock-uis
plan: 02
type: execute
wave: 2
depends_on:
  - "01"
files_modified:
  - src/app/medicines/page.tsx
  - src/app/footfall/page.tsx
  - src/app/attendance/page.tsx
  - src/app/briefing/page.tsx
autonomous: true
requirements:
  - MED-01
  - MED-02
  - FOOT-01
  - FOOT-02
  - ATT-01
  - ATT-02
  - BRIEF-01
  - BRIEF-04
must_haves:
  truths:
    - medicines page displays inventory grid with Days Remaining prediction.
    - footfall page renders historical line chart, weekly comparison bar chart, and peak hours area chart using recharts.
    - attendance page shows coverage percentage, doctor roster, and AI staff allocation suggestions.
    - briefing page displays a typing-effect simulation, natural operations summary, and PDF download controls.
  artifacts:
    - src/app/medicines/page.tsx
    - src/app/footfall/page.tsx
    - src/app/attendance/page.tsx
    - src/app/briefing/page.tsx
  key_links:
    - Components import and display mock data from src/mocks/
---

<objective>
Implement the high-fidelity mock UI views for Medicines, Footfall Analytics, Doctor Attendance, and AI Daily Briefing, fully styled with the Stitch glassmorphism theme and populated with our Firestore-ready mock databases.

Purpose: Provide the visual and functional prototype screens for core PHC operational workflows.
Output: Active user screens for `/medicines`, `/footfall`, `/attendance`, and `/briefing`.
</objective>

<execution_context>
@~/.gemini/antigravity/get-shit-done/workflows/execute-plan.md
@~/.gemini/antigravity/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-high-fidelity-feature-mock-uis/02-CONTEXT.md
@.planning/phases/02-high-fidelity-feature-mock-uis/01-PLAN.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Build Medicine Inventory Page</name>
  <files>src/app/medicines/page.tsx</files>
  <read_first>src/mocks/medicines.ts</read_first>
  <action>
    Create src/app/medicines/page.tsx:
    - Implement a grid of medicine stock cards showing Medicine Name, Stock Quantity, Daily Usage, and Days Remaining.
    - Days Remaining must be calculated: Stock / Daily Usage.
    - Display color-coded status chips: Critical (Red, < 3 days), Warning (Amber, 3-7 days), Safe (Green, > 7 days).
    - Include a search input and status filter dropdown.
    - Include a detailed "AI Reorder Prediction Modal" showing mock stockout risk level, reorder quantity recommendation, and AI confidence percentage.
  </action>
  <acceptance_criteria>
    - `/medicines` renders a search bar, status filters, and stock cards grid.
    - Stock cards correctly compute days remaining and render critical/warning/safe chips.
    - Clicking "AI Prediction" on any card opens the modal with realistic metrics.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Build Patient Footfall Analytics Page</name>
  <files>src/app/footfall/page.tsx</files>
  <read_first>src/mocks/footfall.ts</read_first>
  <action>
    Create src/app/footfall/page.tsx:
    - Import Recharts components dynamically (using next/dynamic with ssr: false) to prevent hydration errors.
    - Implement a historical Daily Patients line chart, a weekly bar chart comparing departments, and a Peak Hours area chart showing workload distribution.
    - Render a Prediction Card displaying predicted patient count, peak time, and risk level.
  </action>
  <acceptance_criteria>
    - `/footfall` renders three Recharts charts (Line, Bar, Area) without console errors or server-side hydration mismatches.
    - Historical trends and hourly workload predictions match the mock data configurations.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Build Doctor Attendance Monitor Page</name>
  <files>src/app/attendance/page.tsx</files>
  <read_first>src/mocks/doctors.ts</read_first>
  <action>
    Create src/app/attendance/page.tsx:
    - Display summary metrics at the top: Present count, Absent count, and Coverage Percentage.
    - Render a roster of doctor cards with specialty, contact info, shift timings, and current status badges (Present, Absent, On Leave).
    - Include an AI Impact Card recommending staff reallocations based on who is absent (e.g., reallocating nurses or shifts to cover empty departments).
  </action>
  <acceptance_criteria>
    - `/attendance` renders the present/absent summary stats.
    - Doctor card roster displays accurate information from the mock database.
    - AI Impact Card shows clear, actionable staffing suggestions.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 4: Build AI Daily Briefing Page</name>
  <files>src/app/briefing/page.tsx</files>
  <read_first>src/app/dashboard/page.tsx</read_first>
  <action>
    Create src/app/briefing/page.tsx:
    - Render a simulated typing effect for briefing generation with the Gemini logo.
    - Display natural language operational briefing summaries highlighting today's drug shortages, absenteeism, and surge risk.
    - Display a confidence score indicator circle and a "Why this recommendation?" reasoning accordion.
    - Add Action buttons to Download Report, Copy Summary, and Regenerate.
  </action>
  <acceptance_criteria>
    - `/briefing` is fully styled, showing the briefing generated sections.
    - Accordions and action buttons are interactive.
  </acceptance_criteria>
</task>

</tasks>

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure Next.js outputs a production bundle without errors.

### Manual Verification
- Start `npm run dev` and click through each activated route to verify look, responsiveness, Recharts scaling, modals, and accordions.

## Artifacts this phase produces
- `src/app/medicines/page.tsx` (new page)
- `src/app/footfall/page.tsx` (new page)
- `src/app/attendance/page.tsx` (new page)
- `src/app/briefing/page.tsx` (new page)
