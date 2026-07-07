---
phase: 05-google-cloud-firestore-database
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - .env.example
  - src/repositories/IMedicineRepository.ts
  - src/repositories/IDoctorRepository.ts
  - src/repositories/IChecklistRepository.ts
  - src/repositories/IBriefingRepository.ts
autonomous: true
requirements: []
must_haves:
  truths:
    - Firebase package is installed and added to dependencies.
    - .env.example contains Firebase configuration templates.
    - src/lib/firebase.ts initializes SSR-safe Firebase app and Firestore instance.
    - Repository interfaces (IMedicineRepository, IDoctorRepository, IChecklistRepository, IBriefingRepository) define the `listen` subscription method.
  artifacts:
    - src/lib/firebase.ts
    - src/repositories/IMedicineRepository.ts
    - src/repositories/IDoctorRepository.ts
    - src/repositories/IChecklistRepository.ts
    - src/repositories/IBriefingRepository.ts
    - src/services/FirestoreSeeder.ts
  key_links:
    - Repository interfaces update to define subscription listener methods that hooks will call.
---

<objective>
Install Firebase SDK, configure environment variables, initialize SSR-safe Firebase and Firestore, update repository contracts to support real-time subscriptions, and build a Firestore seeder service for empty collections.
</objective>

<execution_context>
@~/.gemini/antigravity/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/05-google-cloud-firestore-database/05-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install Firebase SDK dependency</name>
  <files>package.json</files>
  <read_first>package.json</read_first>
  <action>
    - Run `npm install firebase` to add firebase library as a production dependency.
  </action>
  <acceptance_criteria>
    - package.json contains "firebase" in the dependencies list.
    - `npm list firebase` exits with code 0.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Configure environment variables for Firebase configuration</name>
  <files>.env.example</files>
  <read_first>.env.example</read_first>
  <action>
    - Append client-accessible Firebase Config parameters to `.env.example` using `NEXT_PUBLIC_` prefixes.
    - Copy the keys into `.env.local` ready for the user's config injection.
  </action>
  <acceptance_criteria>
    - .env.example contains NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Initialize SSR-safe Firebase client & Firestore</name>
  <files>[NEW] src/lib/firebase.ts</files>
  <read_first>src/repositories/LocalSettingsRepository.ts</read_first>
  <action>
    - Create `src/lib/firebase.ts`.
    - Check if firebase app is already initialized (`getApps().length ? getApp() : initializeApp(config)`).
    - Guard initialization against server-side rendering (check `typeof window !== 'undefined'`).
    - Initialize and export `app` and `db = getFirestore(app)`.
  </action>
  <acceptance_criteria>
    - src/lib/firebase.ts exports initialized firebase App and Firestore database instance.
    - Next.js development build does not fail during server-side build.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 4: Update Repository Contracts (Interfaces) for real-time subscription support</name>
  <files>
    src/repositories/IMedicineRepository.ts
    src/repositories/IDoctorRepository.ts
    src/repositories/IChecklistRepository.ts
    src/repositories/IBriefingRepository.ts
  </files>
  <read_first>
    src/repositories/IMedicineRepository.ts
    src/repositories/IDoctorRepository.ts
    src/repositories/IChecklistRepository.ts
    src/repositories/IBriefingRepository.ts
  </read_first>
  <action>
    - Update `IMedicineRepository.ts` to add: `listen(callback: (data: Medicine[]) => void): () => void;`
    - Update `IDoctorRepository.ts` to add: `listen(callback: (data: Doctor[]) => void): () => void;`
    - Update `IChecklistRepository.ts` to add: `listen(callback: (data: ChecklistItem[]) => void): () => void;`
    - Update `IBriefingRepository.ts` to add: `listen(callback: (data: string | null) => void): () => void;`
  </action>
  <acceptance_criteria>
    - IMedicineRepository, IDoctorRepository, IChecklistRepository, and IBriefingRepository declare `listen` methods returning unsubscribe functions.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 5: Implement central Firestore database seeder service</name>
  <files>[NEW] src/services/FirestoreSeeder.ts</files>
  <read_first>
    src/repositories/LocalMedicineRepository.ts
    src/repositories/LocalDoctorRepository.ts
    src/repositories/LocalChecklistRepository.ts
    src/repositories/LocalFootfallRepository.ts
    src/repositories/LocalBriefingRepository.ts
  </read_first>
  <action>
    - Implement a `FirestoreSeeder` service.
    - Include a method `seedIfEmpty(db: Firestore): Promise<void>` that checks if the collections are empty, and if so, seeds them with default mock data arrays extracted from local mocks.
    - Guard writing by checking checkmarks (metadata doc or query limit) to prevent concurrent client seeding.
  </action>
  <acceptance_criteria>
    - src/services/FirestoreSeeder.ts exports a seeder class/helper.
    - Seeder safely seeds medicines, doctors, checklist, footfall, and briefing collections.
  </acceptance_criteria>
</task>

</tasks>

## Verification Plan

### Automated Tests
- Build verification check `npm run build` succeeds (with interface changes, compile will fail temporarily on local repositories, which will be fixed in Plan 2, so build verify is deferred to Plan 2).
