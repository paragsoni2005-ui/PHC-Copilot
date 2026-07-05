---
phase: 02-high-fidelity-feature-mock-uis
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/AppShell.tsx
  - package.json
  - src/mocks/medicines.ts
  - src/mocks/doctors.ts
  - src/mocks/footfall.ts
  - src/types/store.ts
autonomous: true
requirements:
  - DASH-02
  - DASH-04
must_haves:
  truths:
    - package.json includes recharts dependency.
    - src/types/store.ts defines Firestore-aligned TypeScript interfaces for Medicine, Doctor, FootfallData.
    - AppShell.tsx activates `/medicines`, `/footfall`, `/attendance` and `/briefing` links without "Soon" badges.
  artifacts:
    - src/types/store.ts
    - src/mocks/medicines.ts
    - src/mocks/doctors.ts
    - src/mocks/footfall.ts
  key_links:
    - AppShell navLinks link to respective pages.
---

<objective>
Install recharts, establish Firestore-aligned mock data structures in src/mocks/, and activate navigation in AppShell to allow routing to all Phase 2 views.

Purpose: Provide the styling, mock data infrastructure, and page links required by the high-fidelity UI views.
Output: Initialized package dependencies, unified data models, and active navigation.
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
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install Recharts dependency</name>
  <files>package.json</files>
  <read_first>package.json</read_first>
  <action>
    Install recharts package for rendering analytics charts. Run command:
    npm install recharts
  </action>
  <acceptance_criteria>
    package.json contains "recharts" in its dependencies.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Define Firestore-aligned types & mock databases</name>
  <files>src/types/store.ts, src/mocks/medicines.ts, src/mocks/doctors.ts, src/mocks/footfall.ts</files>
  <read_first>src/app/globals.css</read_first>
  <action>
    Create src/types/store.ts and declare the interfaces matching future Firestore document collections:
    - Medicine: id, name, stock, dailyUsage, reorderLevel, daysRemaining, riskLevel ('critical' | 'warning' | 'safe'), lastReorderDate, dosageForm.
    - Doctor: id, name, department, status ('present' | 'absent' | 'on_leave'), contact, specialty.
    - FootfallRecord: date, patientCount, departmentBreakdown (e.g. Pediatrics, General, etc.), peakHour.
    
    Populate src/mocks/medicines.ts, src/mocks/doctors.ts, and src/mocks/footfall.ts with rich, realistic mock data records.
  </action>
  <acceptance_criteria>
    - src/types/store.ts exists and exports Medicine, Doctor, and FootfallRecord interfaces.
    - src/mocks/medicines.ts exports a mockMedicines array matching the Medicine interface.
    - src/mocks/doctors.ts exports a mockDoctors array matching the Doctor interface.
    - src/mocks/footfall.ts exports mockFootfallRecords and mockHourlyDistribution arrays.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Activate navigation links in AppShell</name>
  <files>src/components/AppShell.tsx</files>
  <read_first>src/components/AppShell.tsx</read_first>
  <action>
    Modify navItems in AppShell.tsx to remove `disabled: true` from Medicines, Footfall, and Attendance.
    Add a new navigation item for "Briefing" linking to `/briefing` with the Sparkles icon.
    Update the rendering logic to remove the "Soon" badge and disabled visual styles for these items.
  </action>
  <acceptance_criteria>
    - AppShell.tsx does not mark Medicines, Footfall, or Attendance nav items as disabled.
    - AppShell.tsx sidebar and bottom mobile rail render 5 items: Dashboard, Medicines, Footfall, Attendance, Settings, plus a route to Daily Briefing.
  </acceptance_criteria>
</task>

</tasks>

## Verification Plan

### Automated Tests
- `npm run build` to verify there are no compilation or typescript type errors.

### Manual Verification
- Launch local development server (`npm run dev`) and inspect sidebar navigation links. Ensure all items are clickable and point to the correct URL paths without "Soon" badges.

## Artifacts this phase produces
- `src/types/store.ts` (new types file)
- `src/mocks/medicines.ts` (new mock file)
- `src/mocks/doctors.ts` (new mock file)
- `src/mocks/footfall.ts` (new mock file)
