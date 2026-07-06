---
phase: 04-google-gemini-api-integration
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements:
  - BRIEF-01
  - BRIEF-02
  - BRIEF-03
  - MED-04
  - ATT-03
  - SETT-02
must_haves:
  truths:
    - src/services/GeminiService.ts exists and exports a GeminiService class (D-04, D-05, D-06).
    - src/app/api/copilot/route.ts exists and exports a POST Route Handler (D-01, D-02).
    - Route Handler extracts the x-gemini-api-key request header and falls back to GEMINI_API_KEY environment variable (D-03).
    - Route Handler returns a structured JSON payload for briefing, reorder, and attendance actions (D-05).
    - Server-side error handling catches Gemini API request errors and returns structured error responses (D-07).
  artifacts:
    - src/services/GeminiService.ts
    - src/app/api/copilot/route.ts
  key_links:
    - Route Handler delegates actual LLM invocation to GeminiService.
---

<objective>
Build the secure, server-side AI integration layer by creating the GeminiService and a consolidated Next.js API Route Handler at /api/copilot.

Purpose: Avoid API key exposure by performing all LLM queries server-side, using structured response schemas to return clean JSON to the client.
Output: Server-side Gemini service and proxy route handler ready to process client requests.
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
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement GeminiService class</name>
  <files>src/services/GeminiService.ts</files>
  <read_first>src/types/store.ts, .planning/phases/04-google-gemini-api-integration/04-CONTEXT.md</read_first>
  <action>
    Create src/services/GeminiService.ts:
    - Implement methods:
      - `generateBriefing(apiKey: string, medicines: any[], doctors: any[], footfall: any): Promise<any>`
      - `generateReorderPrediction(apiKey: string, medicine: any): Promise<any>`
      - `generateStaffingImpact(apiKey: string, absentDoctors: any[]): Promise<any>`
      - `testConnection(apiKey: string): Promise<boolean>`
    - Define prompt templates and output schemas for each action using standard JSON schema structure.
    - Construct standard HTTP POST requests to the Google Gemini API `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`.
    - Use `generationConfig: { responseMimeType: "application/json", responseSchema: ... }` in the request body to enforce JSON structure.
  </action>
  <acceptance_criteria>
    - src/services/GeminiService.ts exists and compiles without errors.
    - GeminiService implements generateBriefing, generateReorderPrediction, generateStaffingImpact, and testConnection.
    - Requests use native fetch to call the official gemini-2.5-flash generateContent endpoint.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Implement consolidated API route handler</name>
  <files>src/app/api/copilot/route.ts</files>
  <read_first>src/services/GeminiService.ts, node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md</read_first>
  <action>
    Create src/app/api/copilot/route.ts:
    - Implement a POST Route Handler using App Router convention (`export async function POST(request: Request)`).
    - Extract user key from `x-gemini-api-key` request header. Fall back to process.env.GEMINI_API_KEY if missing.
    - Parse request JSON body for `action` ('briefing' | 'reorder' | 'attendance' | 'test') and `payload`.
    - If neither key is present, return 401 response: `{ success: false, error: 'Gemini API Key is not configured. Please set it in Settings.' }`.
    - Delegate processing based on action type to the GeminiService and return Response.json() with the results.
    - Wrap the call in try/catch to return `{ success: false, error: error.message }` on failures.
  </action>
  <acceptance_criteria>
    - src/app/api/copilot/route.ts exists and compiles.
    - It exports an async POST function.
    - It reads headers and JSON payload correctly.
  </acceptance_criteria>
</task>

</tasks>

## Verification Plan

### Automated Tests
- Run `npm run build` to verify compiling.

### Manual Verification
- We will verify the API routes in Plan 2 when client integrations are wired up.

## Artifacts this phase produces
- `src/services/GeminiService.ts`
- `src/app/api/copilot/route.ts`
