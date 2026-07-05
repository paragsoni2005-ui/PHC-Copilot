# PHC Copilot

## What This Is

PHC Copilot is an AI-powered operational decision support system for Primary Health Centres (PHCs). It processes daily operational metrics (medicine usage, patient attendance, doctor shifts) using Google Gemini to provide actionable staffing and supply recommendations to healthcare workers, moving beyond passive record management to active operational guidance.

## Core Value

Provide clear, actionable operational recommendations (such as medicine reordering alerts, patient footfall staffing adjustments, and doctor absence coverage plans) within 30 seconds of opening the dashboard.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **ONBD**: Splash screen & 3-step onboarding system for PHC staff.
- [ ] **DASH**: Central AI Operations Dashboard with summary statistics, timeline alerts, and checklist action plans.
- [ ] **MED**: Smart Medicine Inventory tracking stock, usage, and prediction of remaining days with reorder suggestions.
- [ ] **FOOT**: Patient Footfall Analytics visualizing historical data, peak hours, and workload risk predictions.
- [ ] **ATT**: Doctor Attendance Monitor displaying daily status and operational reallocation recommendations.
- [ ] **BRIEF**: One-click AI Daily Operations Briefing with natural language summaries and reasoning.
- [ ] **SETT**: Settings panel for profile and API key configuration.

### Out of Scope

- **Real-time Patient Chat** — Out of scope for MVP to minimize operational distractions for clinic staff.
- **Disease Trend Mapping / Epidemic Prediction** — Defer to v2; requires integration with external epidemiological datasets.
- **Mobile Native Application** — Web-first responsive layout is sufficient for PHC computer systems and tablets.
- **Multi-PHC Dashboard** — Deferred to v2; initial scope focuses on single-centre operations.

## Context

- Hackathon track: Google Build with AI - Code for Communities (Smart Health).
- Government healthcare data is private; the application uses representative mock datasets simulating PHC operations.
- Architecture must allow swapping the mock data layer for live integrations without modifying core AI prompts.

## Constraints

- **Tech Stack**: Next.js (React, TypeScript), Vanilla CSS (M3 styling).
- **Styling Guidelines**: Vanilla CSS using Material 3 specifications (from Stitch Design System). Avoid Tailwind unless explicitly requested.
- **AI Service**: Google Vertex AI & Google AI Studio (Gemini 2.5 Flash / 1.5 Flash).
- **Database**: Firestore (for late-phase persistent storage).
- **Execution Strategy**: Local Storage prototype first.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Local Storage First | Fast prototyping, enabling full frontend iteration before database configuration. | — Pending |
| Vanilla CSS Styling | High-fidelity control over Material 3 tokens without Tailwind version mismatch. | — Pending |
| Stitch Design System | Registered Design System ID `36184f3b7f8347758613edbea3f6f675` for visual tokens. | — Pending |

---
*Last updated: 2026-07-05 after initial setup*
