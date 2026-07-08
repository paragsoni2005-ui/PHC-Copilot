---
phase: 03-local-persistence-interactive-prototype
plan: 02
type: execute
wave: 2
depends_on:
  - "01"
files_modified:
  - src/app/dashboard/page.tsx
  - src/app/medicines/page.tsx
  - src/app/footfall/page.tsx
  - src/app/attendance/page.tsx
  - src/app/briefing/page.tsx
  - src/app/settings/page.tsx
autonomous: true
requirements:
  - DASH-03
  - MED-03
  - MED-04
  - FOOT-03
  - ATT-03
  - BRIEF-02
  - BRIEF-03
  - SETT-02
must_haves:
  truths:
    - Dashboard checklist items are tickable and persist status across page reloads (D-14).
    - Medicines inventory supports search, status filtering, adding new items, and stock adjustments (D-12).
    - Roster attendance toggling dynamically updates Present/Absent counts, department coverage percentages, and staffing recommendations (D-13).
    - Briefing page simulates loading, shows live mock operational briefs, and has expandable accordions (D-15).
    - Footfall page displays patient counts, peak risks, and staffing suggestions (D-16).
    - Settings page dropdown switches modes (Mock / Live), accepts API keys, supports connection test, and persists preferences (D-09, D-10, D-11).
  artifacts:
    - src/app/dashboard/page.tsx
    - src/app/medicines/page.tsx
    - src/app/footfall/page.tsx
    - src/app/attendance/page.tsx
    - src/app/briefing/page.tsx
    - src/app/settings/page.tsx
  key_links:
    - Pages import the custom hooks layer to retrieve reactive states and callback actions.
---

<objective>
Wire the custom React hooks into the user interface components to make all pages (Dashboard, Medicines, Footfall, Attendance, Briefing, and Settings) fully interactive and reactive.
</objective>

<execution_context>
@~/.gemini/antigravity/get-shit-done/workflows/execute-plan.md
@~/.gemini/antigravity/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/03-local-persistence-interactive-prototype/03-CONTEXT.md
@.planning/phases/03-local-persistence-interactive-prototype/01-PLAN.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Wire Dashboard checklist and settings page</name>
  <files>src/app/dashboard/page.tsx, src/app/settings/page.tsx</files>
  <read_first>src/app/dashboard/page.tsx, src/app/settings/page.tsx, src/hooks/useChecklist.ts, src/hooks/useSettings.ts</read_first>
  <action>
    - Update src/app/dashboard/page.tsx:
      - Replace static checklist with `useChecklist` data.
      - Make checkboxes checkable, triggering the toggle action.
      - Persist checklist state in localStorage.
    - Update src/app/settings/page.tsx:
      - Wire settings form to `useSettings` hook.
      - Add a Dropdown select menu with Options: "Mock Mode" and "Live API Mode".
      - Add API key input field. When Mode is "Live API Mode", show/enable input field.
      - Bind "Test Connection" button: When clicked, simulate connection test to Gemini (success/error notification based on if API key looks valid like starting with AIza).
      - Ensure settings successfully load/persist to localStorage settings repository.
  </action>
  <verify>
    <automated>node -e "const content = require('fs').readFileSync('src/app/settings/page.tsx', 'utf8'); process.exit(content.includes('useSettings') ? 0 : 1)"</automated>
  </verify>
  <done>Dashboard checklist is fully interactive and settings page Mode/API key inputs work and persist successfully.</done>
</task>

<task type="auto">
  <name>Task 2: Wire Medicines Inventory and Reorder Modal</name>
  <files>src/app/medicines/page.tsx</files>
  <read_first>src/app/medicines/page.tsx, src/hooks/useMedicines.ts</read_first>
  <action>
    - Update src/app/medicines/page.tsx:
      - Bind search input text state to hook's `setSearchQuery` callback.
      - Bind status tabs (All/Critical/Warning/Safe) to hook's `setFilterStatus` callback.
      - Wire the Add Medicine form: Include name, dosage form, stock count, and average daily usage. Validate inputs. On submit, trigger `addMedicine` and close form drawer/modal.
      - Wire the Edit/Update Stock action: Inside each card, add controls to increment/decrement/update stock count directly, instantly recalculating status.
      - Wire the Reorder Modal: Display stockout risk and recommended order quantity derived from active medicine data.
  </action>
  <verify>
    <automated>node -e "const content = require('fs').readFileSync('src/app/medicines/page.tsx', 'utf8'); process.exit(content.includes('useMedicines') ? 0 : 1)"</automated>
  </verify>
  <done>Medicines inventory page handles reactive searching, filtering, adding new items, and adjusting stock quantities.</done>
</task>

<task type="auto">
  <name>Task 3: Wire Footfall, Attendance, and Briefing pages</name>
  <files>src/app/footfall/page.tsx, src/app/attendance/page.tsx, src/app/briefing/page.tsx</files>
  <read_first>src/app/footfall/page.tsx, src/app/attendance/page.tsx, src/app/briefing/page.tsx</read_first>
  <action>
    - Update src/app/footfall/page.tsx:
      - Wire charts and predicted statistics to `useFootfall` data.
    - Update src/app/attendance/page.tsx:
      - Wire doctor cards status badges to toggle between 'Present', 'Absent', and 'On Leave' on click.
      - Wire summary stats cards (Present, Absent, Coverage %) to recalculate instantly based on active status values.
      - Wire the AI Operational Staffing Impact card: Suggest departments matching absent doctors.
    - Update src/app/briefing/page.tsx:
      - Wire briefing content and loading state to `useBriefing` hook.
      - Bind the "Regenerate Briefing" button to refresh briefing simulation.
  </action>
  <verify>
    <automated>node -e "const content = require('fs').readFileSync('src/app/attendance/page.tsx', 'utf8'); process.exit(content.includes('useDoctors') ? 0 : 1)"</automated>
  </verify>
  <done>Attendance roster toggling, Footfall analytics data loading, and Briefing generation features are active and connected to custom hooks.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Client Browser LocalStorage | Local state storage. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-02 | Information Disclosure | UI Display | mitigate | API key in input field must use type="password" to mask output. |
</threat_model>

<verification>
Run `npm run build` to confirm compilation. Run local dev server with `npm run dev` and test interactive states (check checkboxes, add new medicines, adjust stocks, toggle doctor attendance) to verify local persistence works.
</verification>

<success_criteria>
- Dashboard checklist items persist checked state.
- Adding medicines recalculates stats and updates inventory list.
- Attendance roster toggling updates coverage ratios instantly.
- Settings page API key toggle is fully active.
</success_criteria>

## Artifacts this phase produces

### Modified File Paths
- [src/app/dashboard/page.tsx](file:///c:/Users/ASUS/phc%20copilot/src/app/dashboard/page.tsx)
- [src/app/medicines/page.tsx](file:///c:/Users/ASUS/phc%20copilot/src/app/medicines/page.tsx)
- [src/app/footfall/page.tsx](file:///c:/Users/ASUS/phc%20copilot/src/app/footfall/page.tsx)
- [src/app/attendance/page.tsx](file:///c:/Users/ASUS/phc%20copilot/src/app/attendance/page.tsx)
- [src/app/briefing/page.tsx](file:///c:/Users/ASUS/phc%20copilot/src/app/briefing/page.tsx)
- [src/app/settings/page.tsx](file:///c:/Users/ASUS/phc%20copilot/src/app/settings/page.tsx)

<output>
After completion, create `.planning/phases/03-local-persistence-interactive-prototype/02-SUMMARY.md`
</output>
