# Phase 4: Google Gemini API Integration - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Establishes secure, server-side Next.js Route Handlers to call Gemini 2.5 Flash to dynamically generate the PHC daily briefing, medicine reorder reasoning, and doctor absenteeism staffing impact. Integrates a reusable AI service layer, modular prompt templates, and structured JSON output schemas, while preserving a robust client-side fallback to the local simulator.

**Requirements in scope:** BRIEF-01, BRIEF-02, BRIEF-03, BRIEF-04, MED-04, ATT-03, SETT-02

</domain>

<decisions>
## Implementation Decisions

### API Architecture & Server-Side Security
- **D-01:** Never expose Gemini API keys to the client browser or bundle them in the client-side code. All API calls to Google Gemini run server-side in Next.js App Router Route Handlers.
- **D-02:** Implement a consolidated Route Handler at `src/app/api/copilot/route.ts` that handles POST requests. It accepts an `action` body parameter (`'briefing' | 'reorder' | 'attendance'`) and the corresponding operational data payload (`state`).
- **D-03:** Secure Key Proxying: The route handler checks for a custom request header `x-gemini-api-key`. If the client passes a key, the handler uses it for the request. If not, it falls back to the server-side environment variable `GEMINI_API_KEY`. If neither is available, it returns a configuration error.

### Reusable AI Service Layer (GeminiService)
- **D-04:** Implement a server-side `GeminiService` (at `src/services/GeminiService.ts`) to centralize prompt templates, structured output schema definitions, Google Gemini API endpoints, and connection logic.
- **D-05:** Structured Output Mode: Force Gemini to return strictly typed JSON objects using the `responseSchema` parameter in the API call. No regex parsing of markdown on the client.
- **D-06:** Centralized Prompt Templates: Define modular, structured system prompts for:
  - **Daily Briefing**: Synthesizes the overall health centre state (medicines, doctors, footfall predictions) into sections and generates checklists.
  - **Medicine Reorder**: Explains reorder quantities and risks based on stock, daily use, and footfall trends.
  - **Staffing Impact**: Recommends department coverage options and lists wait time adjustments based on which doctors are absent.

### Error Handling & UI Fallbacks
- **D-07:** Implement robust server-side error handling (network timeout, invalid key, rate limiting) returning a structured error response: `{ success: false, error: string }`.
- **D-08:** Client Fallback: Custom hooks (`useBriefing`, etc.) intercept API errors. If the backend fails, the hooks display an inline warning badge in the UI (e.g. "Live API offline, showing simulated briefing") and fall back to the offline simulator data rather than breaking the application.

### the agent's Discretion
- The exact prompt phrasing, templates, and temperature settings for Gemini.
- Styling of the error warning banners/badges in the UI pages.
- Log formats and debug print levels in the API route.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Next.js Route Handlers
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` — Route handler structure, params, cookies/headers, request body handling, and caching.

### Project Specs
- `prd.md` § BRIEF, § MED-04, § ATT-03 — Functional specifications for AI integrations.
- `ui.md` § Briefing Page, § Medicines, § Attendance — Interactive layouts and expected AI widget slots.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/store.ts` — Provides standard TypeScript interfaces to define Gemini's `responseSchema`.
- `src/repositories/LocalSettingsRepository.ts` — Contains client settings to read user-saved API keys and pass them in headers.
- `src/hooks/useBriefing.ts`, `src/hooks/useMedicines.ts`, `src/hooks/useDoctors.ts` — Hook interfaces to be updated with backend fetch requests.

### Integration Points
- `/api/copilot` (at `src/app/api/copilot/route.ts`) — New endpoint where client hooks will make POST calls.
- `src/services/GeminiService.ts` — New backend service executing Gemini requests.

</code_context>

<specifics>
## Specific Ideas
- Prompt templates should instruct Gemini to write responses in a concise, medical/operational tone suitable for a busy PHC doctor.
- In `Google Gemini Live` mode, settings validation ("Test Connection" button) will hit the backend route handler with a lightweight action to verify the key.

</specifics>

<deferred>
## Deferred Ideas
- Firestore database migration is deferred to Phase 5.
- Real-time multi-device sync is deferred to Phase 5.

</deferred>

---

*Phase: 04-google-gemini-api-integration*
*Context gathered: 2026-07-06*
