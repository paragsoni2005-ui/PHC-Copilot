---
phase: 06-landing-page-digital-opd-registration
plan: 02
type: execute
wave: 2
depends_on:
  - 01-PLAN.md
files_modified:
  - src/services/FirestoreSeeder.ts
  - src/hooks/useFootfall.ts
  - src/app/api/copilot/route.ts
autonomous: true
requirements:
  - OPD-01
  - OPD-02
  - OPD-03
  - OPD-04
  - OPD-05
  - OPD-06
must_haves:
  truths:
    - src/repositories/IPatientRepository.ts defines the patient repository contract.
    - src/repositories/FirestorePatientRepository.ts implements IPatientRepository with Firestore collection 'patients' (D-05).
    - src/hooks/usePatients.ts provides registering, listing, searching, filtering, and real-time syncing of patient documents (D-07, D-08).
    - src/app/opd-registration/page.tsx contains the registration card form, filters, search inputs, and live registrations table (D-07).
    - src/services/FirestoreSeeder.ts seeds 50-100 dummy patient records over the last 7 days when empty (D-05).
    - src/hooks/useFootfall.ts aggregates stats dynamically from patients collection registeredAt timestamps (D-06).
    - src/app/api/copilot/route.ts queries patients collection to supply Gemini with actual patient numbers, departments, and symptoms (D-09).
  artifacts:
    - src/repositories/IPatientRepository.ts
    - src/repositories/FirestorePatientRepository.ts
    - src/hooks/usePatients.ts
    - src/app/opd-registration/page.tsx
  key_links:
    - useFootfall and Gemini API proxy read from patients collection instead of static seeder or footfall collection.
---

<objective>
Build the Digital OPD Registration workflow, table, search/filters, and integrate the patients collection as the unified database source of truth.
This refactors the patient footfall dashboard metrics and Gemini daily briefing API to query actual patient registration records.
</objective>

<execution_context>
@~/.gemini/antigravity/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/06-landing-page-digital-opd-registration/06-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Define Patient Model and Implement Firestore Repository</name>
  <files>src/repositories/IPatientRepository.ts, src/repositories/FirestorePatientRepository.ts</files>
  <read_first>src/types/store.ts, src/repositories/IMedicineRepository.ts</read_first>
  <action>
    - Define Patient type inside src/types/store.ts:
      - `patientId: string`, `name?: string`, `age: number`, `gender: string`, `village: string`, `phone?: string`, `department: string`, `symptoms: string`, `visitType: 'new' | 'follow-up'`, `registeredAt: any`, `createdBy: string`, `status: string`.
    - Create src/repositories/IPatientRepository.ts with CRUD and subscription listener signatures.
    - Create src/repositories/FirestorePatientRepository.ts:
      - Implement reads, writes, and real-time listens (`onSnapshot`) on the `patients` Firestore collection.
      - Add filters and date queries in repository methods where appropriate.
  </action>
  <acceptance_criteria>
    - Files compile successfully.
    - Patient types are fully declared.
    - FirestorePatientRepository successfully communicates with firestore `patients` collection.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Build the usePatients Custom React Hook</name>
  <files>src/hooks/usePatients.ts</files>
  <read_first>src/repositories/FirestorePatientRepository.ts</read_first>
  <action>
    - Create src/hooks/usePatients.ts.
    - Instantiate the FirestorePatientRepository.
    - Implement state management: `patients` (list of registered patients for today), `loading` (boolean), `error` (string | null).
    - Implement `registerPatient(data)`: validates required fields, generates a unique ID, writes the record, and handles states.
    - Register a real-time `listenToTodayPatients` subscription inside `useEffect`.
    - Expose client-side search and filtering helpers (searching by ID, Name, or Symptoms, and filtering by gender, department, visitType, etc.).
  </action>
  <acceptance_criteria>
    - usePatients.ts compiles without errors.
    - Exposes registerPatient, today's list, search, and filtering hooks.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Build the Digital OPD Registration View</name>
  <files>src/app/opd-registration/page.tsx</files>
  <read_first>src/hooks/usePatients.ts, src/components/AppShell.tsx</read_first>
  <action>
    - Create src/app/opd-registration/page.tsx.
    - Wrap the viewport with `<AppShell>`.
    - Build the Intake Form on the left side: inputs for Age, Gender, Department, Symptoms, Village, Name (optional), Phone (optional), and Visit Type (New / Follow-up). Include form validations.
    - Build the Today's Patients Table on the right side: columns for ID, Time, Age, Gender, Department, Symptoms, Visit Type, Status, Actions (View details modal).
    - Add Table Search box (by ID, Name, Symptoms) and filter select options (Gender, Department, Visit Type).
    - Restrict action items: hide/disable delete/edit buttons if current user role is 'receptionist'.
  </action>
  <acceptance_criteria>
    - /opd-registration compiles.
    - Form successfully submits, writing records to Firestore.
    - Live table immediately displays the newly registered patient.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 4: Expand Seeder and Refactor Footfall Analytics</name>
  <files>src/services/FirestoreSeeder.ts, src/hooks/useFootfall.ts</files>
  <read_first>src/services/FirestoreSeeder.ts, src/hooks/useFootfall.ts</read_first>
  <action>
    - Modify src/services/FirestoreSeeder.ts:
      - Add a seed check for the `patients` collection.
      - If empty, write 50–100 dummy patient records with varied registration dates spanning the last 7 days.
    - Modify src/hooks/useFootfall.ts:
      - Refactor queries to pull all records from `patients` collection instead of `footfall`.
      - Aggregate patient documents dynamically by day of week, hour of day (extracting hour from registration timestamp), and department.
      - Map aggregates to Recharts chart data schemas and return them in hooks.
  </action>
  <acceptance_criteria>
    - Seeder generates realistic historical records.
    - useFootfall charts render accurate data based on aggregated patient records.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 5: Update Gemini Daily Briefing Backend Proxy</name>
  <files>src/app/api/copilot/route.ts</files>
  <read_first>src/app/api/copilot/route.ts, src/services/GeminiService.ts</read_first>
  <action>
    - Modify src/app/api/copilot/route.ts:
      - In the 'briefing' action, fetch the recent patient documents from Firestore `patients` collection.
      - Summarize key trends (e.g. total patients, department distributions, most common symptoms) and pass this aggregated summary directly in the prompt payload to the Gemini API call.
  </action>
  <acceptance_criteria>
    - API route handler compiles and resolves briefing queries.
    - Prompt contains actual clinical numbers and trends.
  </acceptance_criteria>
</task>

</tasks>

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm compiler builds without warnings.

### Manual Verification
- Register a patient at `/opd-registration` and verify they appear instantly in the right-side table.
- Open the Medical Officer dashboard and verify today's patient count updates dynamically.
- Check the Footfall charts and confirm they render lines and bars matching the seeded data.
- Click "Generate Briefing" and verify the generated response references the actual symptoms (e.g., Fever, Cough) registered in the OPD module.
