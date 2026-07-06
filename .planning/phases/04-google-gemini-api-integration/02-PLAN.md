---
phase: 04-google-gemini-api-integration
plan: 02
type: execute
wave: 2
depends_on:
  - "01"
files_modified:
  - src/hooks/useBriefing.ts
  - src/hooks/useMedicines.ts
  - src/hooks/useDoctors.ts
  - src/hooks/useSettings.ts
  - src/app/briefing/page.tsx
  - src/app/medicines/page.tsx
  - src/app/attendance/page.tsx
autonomous: true
requirements:
  - BRIEF-01
  - BRIEF-02
  - BRIEF-03
  - BRIEF-04
  - MED-04
  - ATT-03
  - SETT-02
must_haves:
  truths:
    - useBriefing hook retrieves dynamic briefings, confidence scores, and reasoning from the backend API.
    - useMedicines hook exposes getAIReorderPrediction which returns recommendations.
    - Briefing page displays live AI summaries, warning badges, and dynamic reasoning accordion blocks (D-08).
    - Medicines page Reorder Prediction modal shows dynamic quantities and reasoning with loading shimmers (D-08).
    - Attendance page Staffing Impact section fetches and renders live wait time estimates and coverage advice (D-08).
    - Settings page connection test hits the API validation route.
  artifacts:
    - src/hooks/useBriefing.ts
    - src/hooks/useMedicines.ts
    - src/hooks/useDoctors.ts
    - src/hooks/useSettings.ts
    - src/app/briefing/page.tsx
    - src/app/medicines/page.tsx
    - src/app/attendance/page.tsx
  key_links:
    - Pages use updated hooks to call backend Route Handlers and display loading / dynamic responses.
---

<objective>
Wire backend API calls into the React hooks (useBriefing, useMedicines, useDoctors, useSettings) and update the corresponding frontend pages (Briefing, Medicines, Attendance, Settings) to render dynamic operational advice with loader shimmers and simulator fallbacks.

Purpose: Bring the AI features to life in the user interface, providing real operational intelligence based on live local data.
Output: Dynamic UI elements, live briefing generation, reactive reorder modal, dynamic absenteeism impact reports, and connection test validations.
</objective>

<execution_context>
@~/.gemini/antigravity/get-shit-done/workflows/execute-plan.md
@~/.gemini/antigravity/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/04-google-gemini-api-integration/04-CONTEXT.md
@.planning/phases/04-google-gemini-api-integration/01-PLAN.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update useSettings hook & connection test page</name>
  <files>src/hooks/useSettings.ts, src/app/settings/page.tsx</files>
  <read_first>src/hooks/useSettings.ts, src/app/settings/page.tsx</read_first>
  <action>
    - Update `useSettings.ts`:
      - In `testConnection(apiKey)`, instead of mock check, fetch POST `/api/copilot` with `action: 'test'` passing `apiKey` in headers or body.
    - Update `src/app/settings/page.tsx` to handle the response correctly and show validation messages based on backend success.
  </action>
  <acceptance_criteria>
    - useSettings testConnection makes a fetch request to /api/copilot.
    - Settings page connection button displays real API key verification feedback.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Wire useBriefing hook and Daily Briefing page</name>
  <files>src/hooks/useBriefing.ts, src/app/briefing/page.tsx</files>
  <read_first>src/hooks/useBriefing.ts, src/app/briefing/page.tsx, src/repositories/LocalBriefingRepository.ts</read_first>
  <action>
    - Update `useBriefing.ts`:
      - Retrieve active settings (`mode` and `apiKey`) from LocalSettingsRepository.
      - If mode is `'live'` and an API key is available, fetch POST `/api/copilot` with `action: 'briefing'` and payload containing the current state of medicines, doctors, and footfall.
      - Save the returned formatted briefing text string via the repository. If it fails, catch the error, set a `fallbackActive` state flag to true, and generate/save simulator data.
      - Expose `confidence` and `reasoning` details parsed from the response.
    - Update `src/app/briefing/page.tsx`:
      - Render an inline warning badge (e.g. "Offline Mode: Showing Simulated Data") if `fallbackActive` is true or mode is `'mock'`.
      - Bind confidence percentage and circular SVGs to the dynamic value from the hook.
      - Render the dynamic reasoning accordion text blocks.
  </action>
  <acceptance_criteria>
    - useBriefing makes API call when in live mode.
    - Briefing page displays warning badge on mock mode or connection failure.
    - Circular dial and reasoning accordion are dynamic.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Update useMedicines hook & Medicines page Reorder Prediction</name>
  <files>src/hooks/useMedicines.ts, src/app/medicines/page.tsx</files>
  <read_first>src/hooks/useMedicines.ts, src/app/medicines/page.tsx</read_first>
  <action>
    - Update `useMedicines.ts`:
      - Expose `getAIReorderPrediction(medicine: Medicine): Promise<{ recommendedOrderQuantity: number, urgency: string, reasoning: string, fallback: boolean }>`:
        - Fetch POST `/api/copilot` with `action: 'reorder'` passing the medicine details.
        - Catch errors to return a fallback simulated recommendation.
    - Update `src/app/medicines/page.tsx`:
      - In the reorder prediction modal, trigger the hook's prediction request on mount/select.
      - Show a clean loading skeleton / shimmer while fetching.
      - Render the returned dynamic recommendation, stockout risk level, and predictive reasoning. Show a warning badge if it fell back to simulation.
  </action>
  <acceptance_criteria>
    - useMedicines hook exports getAIReorderPrediction.
    - Medicines modal fetches and displays dynamic recommendations and reasoning.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 4: Update useDoctors hook & Attendance page Staffing Impact</name>
  <files>src/hooks/useDoctors.ts, src/app/attendance/page.tsx</files>
  <read_first>src/hooks/useDoctors.ts, src/app/attendance/page.tsx</read_first>
  <action>
    - Update `useDoctors.ts`:
      - Expose `getAIStaffingImpact(absentDoctors: Doctor[]): Promise<{ waitTimeIncrease: number, riskAreas: string, recommendations: string[], fallback: boolean }>`:
        - Fetch POST `/api/copilot` with `action: 'attendance'` passing the absent doctors roster.
        - Catch errors and return simulated cover details.
    - Update `src/app/attendance/page.tsx`:
      - In the "AI Operational Staffing Impact" card, trigger the staffing impact query when `absentDoctors` change.
      - Add a loading state / spinner inside this card.
      - Render the live wait times, risk areas, and cover recommendations, with a fallback badge if simulated.
  </action>
  <acceptance_criteria>
    - useDoctors hook exports getAIStaffingImpact.
    - Attendance page displays dynamic staffing advice based on absent doctors, with loading indicators.
  </acceptance_criteria>
</task>

</tasks>

## Verification Plan

### Automated Tests
- Run `npm run build` to verify Next.js builds successfully.

### Manual Verification
- Configure "Local Simulator (Offline Mode)" in settings, navigate to pages, and verify warning fallback badges are visible and mock data displays.
- Switch settings to "Google Gemini Live (API Mode)", enter a valid Gemini API key, click Test Connection to confirm success.
- Perform daily briefing generation, medicine reorder prediction, and roster toggling. Inspect browser developer tools Network tab to verify POST requests hit `/api/copilot` and return live JSON.
