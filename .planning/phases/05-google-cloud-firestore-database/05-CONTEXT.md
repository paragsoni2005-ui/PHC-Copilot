# Phase 5: Google Cloud Firestore Database - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrates state persistence from client-side `localStorage` to Google Cloud Firestore database. The migration must strictly preserve the existing UI components and business logic, replacing only the data layer (the repositories) and updating React hooks to support Firestore real-time listeners (`onSnapshot`). If data is updated in one browser tab or by another user, all connected clients automatically reflect the changes without refreshing.

**Requirements in scope:** None (database migration and real-time synchronization)

</domain>

<decisions>
## Implementation Decisions

### Data Layer Architecture & Firestore Migration
- **D-01 (Repository Swap):** Preserving UI and Business Logic: Replace only the repository implementations. Do not modify UI components or the public API of the React hooks.
- **D-02 (Subscription Contracts):** Extend the repository contracts (e.g., `IMedicineRepository`, `IDoctorRepository`, `IChecklistRepository`, etc.) to support subscription callbacks. For example, add a `listen(callback: (data: T[]) => void): () => void` method.
- **D-03 (Real-time Synchronization):** Register `onSnapshot` real-time listeners in the custom hooks (`useMedicines`, `useDoctors`, `useChecklist`, etc.) inside their `useEffect` lifecycle blocks. When Firestore collections mutate, the listeners trigger React state setters to update the UI instantly across all active clients.
- **D-04 (Firebase Client SDK):** Initialize Firestore client-side using `firebase/app` and `firebase/firestore`. Ensure initialization is SSR-safe by guarding it against Next.js node runtime builds.

### Credentials & Security
- **D-05 (Firebase Configuration):** Load Firebase App configuration properties (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) from client-accessible environment variables in `.env.local` prefixed with `NEXT_PUBLIC_`.
- **D-06 (User Settings Persistence):** System Settings (mock/live mode and Gemini API Key) will continue to be stored in client-side `localStorage` via `LocalSettingsRepository` to allow different browser sessions/users to maintain independent provider choices and credentials.

### Initialization & Data Seeding
- **D-07 (Automatic Seeding):** When the application loads, if the Firestore collections (`medicines`, `doctors`, `checklist`, `footfall`, `briefing`) are detected as empty, the repository layer must automatically seed them with default operational mock datasets to ensure instant out-of-the-box functionality.
- **D-08 (Concurrency Guard):** When seeding data, implement a lightweight check or transaction to prevent concurrent client initialization sessions from writing duplicate default documents.

### the agent's Discretion
- The naming and structure of Firestore document subcollections/fields.
- The structure of the Firebase initialization helper file (`src/lib/firebase.ts`).
- Logging details for real-time connection status.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Firebase/Firestore SDK Docs
- `https://firebase.google.com/docs/firestore` — Client Firestore initialization, real-time updates via `onSnapshot`, reads, writes, and database rules.

### Project Specs
- `prd.md` — Project data structures and schema expectations.
- `src/repositories/` — The existing repository interfaces to be updated with subscription listener methods.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/repositories/Local*Repository.ts` — Existing local repositories from which default seeding data can be extracted.
- `src/types/store.ts` — Provides domain models and shapes for Firestore collections.

### Integration Points
- `src/lib/firebase.ts` [NEW] — Firebase initialization module.
- `src/repositories/` — Replace `Local*Repository` instantiations in hooks with client-side Firestore repositories (e.g. `FirestoreMedicineRepository`).

</code_context>

<specifics>
## Specific Ideas
- Use Firebase version 9+ or 10+ modular SDK syntax (e.g., `import { getFirestore, onSnapshot, collection } from 'firebase/firestore'`).
- Collection schemas should map 1-to-1 with existing interfaces in `src/types/store.ts`.

</specifics>

<deferred>
## Deferred Ideas
- Phase 6 (Firebase Hosting, Cloud Run deployment, responsive layout audit, premium micro-animations) is deferred.

</deferred>

---

*Phase: 05-google-cloud-firestore-database*
*Context gathered: 2026-07-07*
