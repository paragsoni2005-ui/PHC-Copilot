# Codebase Concerns & Technical Debt

This document outlines potential issues, technical debt, performance bottlenecks, and security risks discovered during a review of the codebase.

## 1. Performance Bottlenecks

**Redundant Firestore Seeder Checks**
Every read operation (e.g., `getAll`, `listen`) across all Firestore repositories (`FirestorePatientRepository`, `FirestoreMedicineRepository`, etc.) calls `await FirestoreSeeder.seedIfEmpty(db)`. 
This function performs an un-cached `getDoc(doc(db, "system", "metadata"))` request before running the actual query. When a page (like a dashboard) initializes and calls multiple repository methods (e.g., fetching patients, footfall, doctors, medicines), it triggers multiple sequential, redundant round-trips to Firestore, severely degrading application load times and multiplying Firestore read costs unnecessarily.

## 2. Missing Pagination & Bounded Queries

**Unbounded Data Fetching**
The repository methods like `FirestorePatientRepository.getAll()` and `FirestoreDoctorRepository.getAll()` retrieve the entire collections without pagination or bounding limits. 
For a clinic capturing daily patient data, this collection will grow indefinitely. Retrieving the entire dataset client-side will eventually crash the browser, exhaust memory, and incur massive Firestore read costs.

## 3. Data Integrity & Race Conditions

**Anti-Pattern ID Generation**
New records are created using `Date.now()` (e.g., `const id = \`med-${Date.now()}\``). In a multi-user environment (e.g., multiple receptionists), this guarantees ID collisions for concurrent creations. 
*Recommendation*: Use Firestore's built-in ID generation via `addDoc(collection(db, '...'))` or `doc(collection(db, '...'))`.

**Overwriting Documents on Update**
The repositories use `setDoc(docRef, { ...current, ...updates })` for partial updates. This reads the client state and overwrites the entire document. If two users attempt to update different fields on the same document simultaneously, the latter update will overwrite and destroy the former's changes.
*Recommendation*: Use `updateDoc` for atomic partial updates.

## 4. Missing Error Handling & Silent Degradation

**Swallowing AI Failures**
In `src/hooks/useMedicines.ts`, if the call to `/api/copilot` fails to fetch the AI Reorder Prediction, the error is swallowed and the application silently returns a hardcoded "simulator fallback" string. The user is not informed that the AI failed or that they are reading simulated fallback data.

**Swallowing API Errors**
In `src/app/api/copilot/route.ts`, if querying the `patients` collection for recent patient data fails, the error is just logged to the console and the briefing proceeds without patient data. This results in degraded AI outputs without the user knowing data was omitted.

## 5. Security Risks

**Missing Firebase Security Rules**
There are no `firestore.rules` or `firebase.json` configuration files in the project. Since the application accesses Firestore directly from the client (via `src/lib/firebase.ts`), it must have robust security rules to prevent unauthorized reads and writes. If the project is currently using "Test Mode" rules (`allow read, write: if true;`), it is completely open to tampering and data theft.

**API Key Transmission**
The `/api/copilot` route reads the `x-gemini-api-key` from the request headers to perform backend operations. While it falls back to the environment variable, accepting sensitive keys from the client-side network request without strict authentication and authorization checks could lead to abuse if a malicious actor discovers the endpoint structure.
