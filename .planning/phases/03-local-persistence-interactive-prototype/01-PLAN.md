---
phase: 03-local-persistence-interactive-prototype
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: []
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
    - Repository interfaces (IMedicineRepository, IDoctorRepository, IFootfallRepository, ISettingsRepository, IChecklistRepository, IBriefingRepository) define standard signatures for CRUD/getters matching future Firestore schemas (D-01, D-07, D-08, D-18).
    - LocalStorage implementations store and retrieve JSON collections, seeding from src/mocks if empty, with no direct access from UI (D-02, D-03).
    - Custom React hooks serve as the exclusive state access layer for UI components (D-04, D-05, D-06).
    - All code conforms to SOLID principles and is clean, modular, and scalable (D-17).
  artifacts:
    - src/repositories/IMedicineRepository.ts
    - src/repositories/LocalMedicineRepository.ts
    - src/repositories/IDoctorRepository.ts
    - src/repositories/LocalDoctorRepository.ts
    - src/repositories/IFootfallRepository.ts
    - src/repositories/LocalFootfallRepository.ts
    - src/repositories/ISettingsRepository.ts
    - src/repositories/LocalSettingsRepository.ts
    - src/repositories/IChecklistRepository.ts
    - src/repositories/LocalChecklistRepository.ts
    - src/repositories/IBriefingRepository.ts
    - src/repositories/LocalBriefingRepository.ts
    - src/hooks/useMedicines.ts
    - src/hooks/useDoctors.ts
    - src/hooks/useFootfall.ts
    - src/hooks/useSettings.ts
    - src/hooks/useChecklist.ts
    - src/hooks/useBriefing.ts
  key_links:
    - Hooks instantiate the local storage repositories.
    - UI components consume hooks rather than direct repositories or localStorage.
---

<objective>
Build the repository interface layer, their LocalStorage implementations, and custom React hooks to serve as the unified data access and state management layer for the application.
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
</context>

<tasks>

<task type="auto">
  <name>Task 1: Define repository contracts (interfaces)</name>
  <files>src/repositories/IMedicineRepository.ts, src/repositories/IDoctorRepository.ts, src/repositories/IFootfallRepository.ts, src/repositories/ISettingsRepository.ts, src/repositories/IChecklistRepository.ts, src/repositories/IBriefingRepository.ts</files>
  <read_first>src/types/store.ts</read_first>
  <action>
    Create interfaces for each domain defining standard CRUD operations to align with future Firestore structures:
    - `IMedicineRepository`:
      - `getAll(): Promise<Medicine[]>`
      - `getById(id: string): Promise<Medicine | null>`
      - `create(medicine: Omit<Medicine, 'id' | 'daysRemaining' | 'riskLevel'>): Promise<Medicine>`
      - `update(id: string, updates: Partial<Medicine>): Promise<Medicine>`
      - `delete(id: string): Promise<boolean>`
    - `IDoctorRepository`:
      - `getAll(): Promise<Doctor[]>`
      - `updateStatus(id: string, status: Doctor['status']): Promise<Doctor>`
    - `IFootfallRepository`:
      - `getHistoricalRecords(): Promise<FootfallRecord[]>`
      - `getHourlyLoad(): Promise<HourlyLoad[]>`
    - `ISettingsRepository`:
      - `getSettings(): Promise<{ mode: 'mock' | 'live'; apiKey: string }>`
      - `saveSettings(settings: { mode: 'mock' | 'live'; apiKey: string }): Promise<void>`
    - `IChecklistRepository`:
      - `getItems(): Promise<{ id: string; text: string; completed: boolean }[]>`
      - `toggleItem(id: string, completed: boolean): Promise<void>`
    - `IBriefingRepository`:
      - `getLatestBriefing(): Promise<string | null>`
      - `saveBriefing(briefing: string): Promise<void>`
  </action>
  <verify>
    <automated>node -e "require('fs').existsSync('src/repositories/IMedicineRepository.ts') && require('fs').existsSync('src/repositories/IDoctorRepository.ts') ? process.exit(0) : process.exit(1)"</automated>
  </verify>
  <done>All repository interfaces are created with TypeScript types and SOLID patterns.</done>
</task>

<task type="auto">
  <name>Task 2: Implement LocalStorage repositories</name>
  <files>src/repositories/LocalMedicineRepository.ts, src/repositories/LocalDoctorRepository.ts, src/repositories/LocalFootfallRepository.ts, src/repositories/LocalSettingsRepository.ts, src/repositories/LocalChecklistRepository.ts, src/repositories/LocalBriefingRepository.ts</files>
  <read_first>src/mocks/medicines.ts, src/mocks/doctors.ts, src/mocks/footfall.ts</read_first>
  <action>
    Implement each repository using browser `localStorage`:
    - Read initial seed data from `src/mocks/` if localStorage collections are empty.
    - Automatically compute properties in `LocalMedicineRepository` (e.g. `daysRemaining = stock / dailyUsage` and `riskLevel` status checks: `< 3` days is critical, `3-7` is warning, `> 7` is safe).
    - Save updated records back to `localStorage` as JSON strings.
    - Add safety checks to execute localStorage calls safely during server-side pre-rendering (use `typeof window !== 'undefined'` checks).
  </action>
  <verify>
    <automated>node -e "require('fs').existsSync('src/repositories/LocalMedicineRepository.ts') && require('fs').existsSync('src/repositories/LocalDoctorRepository.ts') ? process.exit(0) : process.exit(1)"</automated>
  </verify>
  <done>All LocalStorage repositories are implemented and initialize correctly from seed mock data.</done>
</task>

<task type="auto">
  <name>Task 3: Build Custom Hooks state layer</name>
  <files>src/hooks/useMedicines.ts, src/hooks/useDoctors.ts, src/hooks/useFootfall.ts, src/hooks/useSettings.ts, src/hooks/useChecklist.ts, src/hooks/useBriefing.ts</files>
  <read_first>src/repositories/LocalMedicineRepository.ts</read_first>
  <action>
    Create React hooks that wrap the repositories and manage component state:
    - `useMedicines()`:
      - Exposes state: `medicines: Medicine[]`, `loading: boolean`, `searchQuery: string`, `filterStatus: string`.
      - Exposes operations: `addMedicine()`, `updateStock()`, `setSearchQuery()`, `setFilterStatus()`.
      - Recalculates statistics reactively.
    - `useDoctors()`:
      - Exposes state: `doctors: Doctor[]`, `loading: boolean`, `stats: { presentCount: number; absentCount: number; coveragePercent: number }`.
      - Exposes operations: `toggleAttendance()`.
    - `useFootfall()`:
      - Exposes state: `records: FootfallRecord[]`, `hourlyLoad: HourlyLoad[]`, `loading: boolean`.
    - `useSettings()`:
      - Exposes state: `settings: { mode: 'mock' | 'live'; apiKey: string }`, `loading: boolean`.
      - Exposes operations: `updateSettings()`, `testConnection()`.
    - `useChecklist()`:
      - Exposes state: `items: { id: string; text: string; completed: boolean }[]`, `loading: boolean`.
      - Exposes operations: `toggleItem()`.
    - `useBriefing()`:
      - Exposes state: `briefing: string | null`, `loading: boolean`, `isGenerating: boolean`.
      - Exposes operations: `generateBriefing()`.
  </action>
  <verify>
    <automated>node -e "require('fs').existsSync('src/hooks/useMedicines.ts') && require('fs').existsSync('src/hooks/useDoctors.ts') ? process.exit(0) : process.exit(1)"</automated>
  </verify>
  <done>All React custom hooks are implemented and export standard interfaces for UI use.</done>
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
| T-03-01 | Information Disclosure | LocalStorage | mitigate | Never store plain-text API credentials on remote logs. Clear localStorage upon request. |
</threat_model>

<verification>
Run `npm run build` to confirm compilation of types, repositories, and hook files.
</verification>

<success_criteria>
- Repository interfaces created and implemented with LocalStorage adapter.
- Custom hooks wrap the local repositories and compile cleanly.
</success_criteria>

## Artifacts this phase produces

### New File Paths
- [IMedicineRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/IMedicineRepository.ts)
- [LocalMedicineRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/LocalMedicineRepository.ts)
- [IDoctorRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/IDoctorRepository.ts)
- [LocalDoctorRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/LocalDoctorRepository.ts)
- [IFootfallRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/IFootfallRepository.ts)
- [LocalFootfallRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/LocalFootfallRepository.ts)
- [ISettingsRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/ISettingsRepository.ts)
- [LocalSettingsRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/LocalSettingsRepository.ts)
- [IChecklistRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/IChecklistRepository.ts)
- [LocalChecklistRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/LocalChecklistRepository.ts)
- [IBriefingRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/IBriefingRepository.ts)
- [LocalBriefingRepository.ts](file:///c:/Users/ASUS/phc%20copilot/src/repositories/LocalBriefingRepository.ts)
- [useMedicines.ts](file:///c:/Users/ASUS/phc%20copilot/src/hooks/useMedicines.ts)
- [useDoctors.ts](file:///c:/Users/ASUS/phc%20copilot/src/hooks/useDoctors.ts)
- [useFootfall.ts](file:///c:/Users/ASUS/phc%20copilot/src/hooks/useFootfall.ts)
- [useSettings.ts](file:///c:/Users/ASUS/phc%20copilot/src/hooks/useSettings.ts)
- [useChecklist.ts](file:///c:/Users/ASUS/phc%20copilot/src/hooks/useChecklist.ts)
- [useBriefing.ts](file:///c:/Users/ASUS/phc%20copilot/src/hooks/useBriefing.ts)

<output>
After completion, create `.planning/phases/03-local-persistence-interactive-prototype/01-SUMMARY.md`
</output>
