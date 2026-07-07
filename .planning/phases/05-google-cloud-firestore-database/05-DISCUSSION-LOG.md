# Phase 5: Google Cloud Firestore Database - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-07
**Phase:** 05-google-cloud-firestore-database
**Areas discussed:** Real-Time Listener Integration, Firebase Configuration Loading, Data Seeding Policy

---

## Real-Time Listener Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Add Subscription to Repositories | Extend contracts with subscription methods (e.g. listen) and update custom hooks' useEffect blocks to register listeners | ✓ |
| Global Repository Registry | Keep hooks 100% untouched; implement a non-standard event/callback registry inside repositories | |

**User's choice:** Add Subscription to Repositories
**Notes:** Keeps clean architecture separation while allowing hooks to react to Firestore collection updates in real-time.

---

## Firebase Configuration Loading

| Option | Description | Selected |
|--------|-------------|----------|
| Environment Variables (`.env.local`) | Load config properties via standard NEXT_PUBLIC_ env variables | ✓ |
| Manual Input in Settings UI | Input Firebase project config in Settings | |

**User's choice:** Environment Variables (`.env.local`)
**Notes:** Simple, standard Next.js config loading.

---

## Data Seeding Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Automatic Seeding | Populate Firestore with default mock data if collections are detected as empty on startup | ✓ |
| Manual Seed Button | Explicit user trigger button on settings or dashboard | |

**User's choice:** Automatic Seeding
**Notes:** Ensures instant out-of-the-box functionality for new installations without manual steps.

---

## the agent's Discretion
- Firestore document schema shapes, collection naming, collection structure, initialization modules (`src/lib/firebase.ts`).
- Seeding concurrency check logic.

## Deferred Ideas
- Phase 6 (Firebase Hosting, Cloud Run deployment, premium styling and micro-animations).

---

*Phase: 05-google-cloud-firestore-database*
*Discussion log generated: 2026-07-07*
