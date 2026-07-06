# Phase 4: Google Gemini API Integration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-06
**Phase:** 04-google-gemini-api-integration
**Areas discussed:** API Route Architecture, Client-to-Server State Payload, Structured Output Mode, API Key Validation & Error Fallback

---

## API Route Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Consolidated Route Handler `/api/copilot` | Single handler parsing action types and calling GeminiService methods | ✓ |
| Individual Route Handlers | Multiple files (e.g. `/api/briefing`, `/api/reorder`) | |

**User's choice:** Consolidated Route Handler `/api/copilot`
**Notes:** User requested to keep all Gemini integration server-side, never expose keys, and design prompts to be modular so additional features can be added without changing the API architecture.

---

## Client-to-Server State Payload

| Option | Description | Selected |
|--------|-------------|----------|
| Full Client State | Client sends complete inventory, roster, and footfall lists in payload | ✓ |
| Filtered Anomalies | Client pre-filters and sends only warning/critical items | |

**User's choice:** Full Client State
**Notes:** Reuses existing types, simplifies client-side logic, and allows the server-side LLM to perform full reasoning.

---

## Structured Output Mode

| Option | Description | Selected |
|--------|-------------|----------|
| Gemini responseSchema JSON | Server enforces structured JSON responses via the official SDK parameter | ✓ |
| Raw Text / Markdown Parsing | Server gets raw text and client uses regex/heuristics to parse sections | |

**User's choice:** Gemini responseSchema JSON
**Notes:** Reusable AI service layer will return structured JSON responses, ensuring reliability and robust types.

---

## API Key Validation & Error Fallback

| Option | Description | Selected |
|--------|-------------|----------|
| Local Simulator Fallback | Gracefully fallback to simulated data with warning badges in the UI | ✓ |
| Hard Blocking Error | Show error screens blocking the app until key/connection is resolved | |

**User's choice:** Local Simulator Fallback
**Notes:** Catch errors in custom hooks, show a banner, and fall back to local mock data to prevent app crashes.

---

## the agent's Discretion
- Phrasing of prompts, schema structures in TypeScript, configuration of model parameters (temperature, topP).
- Visual presentation of inline warning banners/badges.

## Deferred Ideas
- Firestore database migration (Phase 5).

---

*Phase: 04-google-gemini-api-integration*
*Discussion log generated: 2026-07-06*
