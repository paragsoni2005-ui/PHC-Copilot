---
phase: 05-google-cloud-firestore-database
plan: 02
type: execute
wave: 2
depends_on:
  - "01"
files_modified:
  - src/repositories/LocalMedicineRepository.ts
  - src/repositories/LocalDoctorRepository.ts
  - src/repositories/LocalChecklistRepository.ts
  - src/repositories/LocalBriefingRepository.ts
  - src/hooks/useMedicines.ts
  - src/hooks/useDoctors.ts
  - src/hooks/useChecklist.ts
  - src/hooks/useBriefing.ts
  - src/hooks/useFootfall.ts
autonomous: true
requirements: []
must_haves:
  truths:
    - Firestore repositories (FirestoreMedicineRepository, FirestoreDoctorRepository, FirestoreChecklistRepository, FirestoreBriefingRepository, FirestoreFootfallRepository) are fully implemented.
    - All local repositories implement the extended I*Repository listen contracts.
    - React hooks instantiate Firestore repositories and subscribe to data changes using `listen` inside useEffect.
    - UI continues to render properly in both simulated mock and Firestore-backed live mode.
  artifacts:
    - src/repositories/FirestoreMedicineRepository.ts
    - src/repositories/FirestoreDoctorRepository.ts
    - src/repositories/FirestoreChecklistRepository.ts
    - src/repositories/FirestoreBriefingRepository.ts
    - src/repositories/FirestoreFootfallRepository.ts
  key_links:
    - Hooks import and use Firestore repositories in place of Local repositories when mode is live, setting up subscriptions.
---

<objective>
Implement Firestore repository classes, add dummy listener contracts to Local repositories to maintain type safety, and wire hooks to register real-time listeners for all core operations (medicines, doctors, checklist, briefing, footfall).
</objective>

<execution_context>
@~/.gemini/antigravity/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/05-google-cloud-firestore-database/05-CONTEXT.md
@.planning/phases/05-google-cloud-firestore-database/01-PLAN.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add listener implementations to Local repositories</name>
  <files>
    src/repositories/LocalMedicineRepository.ts
    src/repositories/LocalDoctorRepository.ts
    src/repositories/LocalChecklistRepository.ts
    src/repositories/LocalBriefingRepository.ts
  </files>
  <read_first>
    src/repositories/LocalMedicineRepository.ts
    src/repositories/LocalDoctorRepository.ts
    src/repositories/LocalChecklistRepository.ts
    src/repositories/LocalBriefingRepository.ts
  </read_first>
  <action>
    - Add a `listen(callback: (data: T[]) => void): () => void` method to `LocalMedicineRepository`, `LocalDoctorRepository`, `LocalChecklistRepository`, and `LocalBriefingRepository`.
    - For simplicity, the local repository implementation of `listen` will trigger the callback immediately with current localStorage values and return a dummy no-op unsubscribe function `() => {}`.
  </action>
  <acceptance_criteria>
    - Local repository classes compile successfully after interface updates.
    - Each has a `listen` method that returns an unsubscribe function.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Implement Firestore repository classes</name>
  <files>
    [NEW] src/repositories/FirestoreMedicineRepository.ts
    [NEW] src/repositories/FirestoreDoctorRepository.ts
    [NEW] src/repositories/FirestoreChecklistRepository.ts
    [NEW] src/repositories/FirestoreBriefingRepository.ts
    [NEW] src/repositories/FirestoreFootfallRepository.ts
  </files>
  <read_first>
    src/repositories/IMedicineRepository.ts
    src/repositories/IDoctorRepository.ts
    src/repositories/IChecklistRepository.ts
    src/repositories/IBriefingRepository.ts
    src/repositories/IFootfallRepository.ts
  </read_first>
  <action>
    - Create repository classes implementing corresponding contracts using Firestore modular SDK (`firebase/firestore`):
      - Import `db` from `src/lib/firebase.ts`.
      - In `listen(callback)` methods, use Firestore's `onSnapshot(collection(...), (snapshot) => ...)` to map documents to type-safe arrays, calling `FirestoreSeeder.seedIfEmpty` if snapshot is empty, and invoke the callback.
      - In mutation methods (`create`, `update`, `delete`, etc.), write changes back using `addDoc`, `setDoc`, `updateDoc`, or `deleteDoc`.
  </action>
  <acceptance_criteria>
    - New Firestore repository files compile successfully.
    - Mutation operations correctly target Firestore collection document paths.
    - Real-time listeners map Firestore QueryDocumentSnapshots to domain data shapes.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Update React Hooks to bind to Firestore real-time listeners</name>
  <files>
    src/hooks/useMedicines.ts
    src/hooks/useDoctors.ts
    src/hooks/useChecklist.ts
    src/hooks/useBriefing.ts
    src/hooks/useFootfall.ts
  </files>
  <read_first>
    src/hooks/useMedicines.ts
    src/hooks/useDoctors.ts
    src/hooks/useChecklist.ts
    src/hooks/useBriefing.ts
    src/hooks/useFootfall.ts
  </read_first>
  <action>
    - Modify hooks to dynamically resolve the repository implementation based on settings (`mode === 'live' ? new Firestore*Repository() : new Local*Repository()`).
    - Inside `useEffect` blocks, set up real-time sync subscription:
      ```typescript
      useEffect(() => {
        setLoading(true);
        const unsubscribe = repo.listen((data) => {
          setData(data);
          setLoading(false);
        });
        return () => unsubscribe();
      }, [repo]);
      ```
    - Remove local state mutation inside hooks' action callbacks (e.g. in `addMedicine`, `updateStock`, `toggleAttendance`, etc.), instead just calling repository mutation methods. The real-time listener will automatically update React state on snapshot callback.
  </action>
  <acceptance_criteria>
    - React hooks compile with no type errors.
    - Active hooks bind real-time snapshot listeners on mount and properly unsubscribe on unmount.
  </acceptance_criteria>
</task>

</tasks>

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm that all TypeScript compiles with zero compilation errors and Next.js static page generation succeeds.
