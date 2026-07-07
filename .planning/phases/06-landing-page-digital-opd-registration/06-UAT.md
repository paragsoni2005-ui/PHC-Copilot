---
status: pending
phase: 06-landing-page-digital-opd-registration
source:
  - 01-PLAN.md
  - 02-PLAN.md
started: 2026-07-07T15:40:00Z
updated: 2026-07-07T15:40:00Z
---

## Current Test

[ready for verification]

## Tests

### 1. Standalone Landing Page
expected: Navigating to the root route `/` shows the Landing Page without the standard App Shell (no sidebar, no mobile bottom nav). The page displays branding, taglines, problem/solution scrolls, features grid, technology stack, and CTA buttons.
result: pending

### 2. Role Selection & Authentication
expected: Clicking CTAs displays a Role Selection Sign-In modal:
- Receptionist role triggers anonymous authentication and redirects to `/opd-registration`.
- Medical Officer role displays email/password inputs, validates credentials, and redirects to `/dashboard`.
result: pending

### 3. Client-Side Route Guards
expected: Logged-in Receptionists trying to access `/dashboard`, `/medicines`, or `/attendance` are redirected back or blocked. Logged-in Medical Officers trying to edit/delete items on `/opd-registration` are prevented from doing so. Unauthenticated guests trying to access any internal route are redirected to `/`.
result: pending

### 4. Digital OPD Patient Registration
expected: Submitting the OPD intake form with valid fields (Age, Gender, Department, Symptoms, Visit Type, Village) saves the record to the `patients` Firestore collection and immediately appends it to the Today's Registrations table. Submitting with invalid fields highlights errors.
result: pending

### 5. Live Table Filters and Search
expected: Typing in the registrations search box filters rows dynamically by ID, Name, or Symptoms. Selecting filter drop-downs (Gender, Visit Type, Department) updates table rows instantly.
result: pending

### 6. Live Dashboard Count Updates
expected: With the dashboard open in Tab A and the OPD registration open in Tab B, registering a new patient in Tab B immediately increments the "Today's Patients" count on the Tab A dashboard without page refresh.
result: pending

### 7. Dynamic Footfall charts and Gemini surge forecast
expected: The Patient Footfall analytics charts display dynamic historical aggregations loaded from seeded patients. Generative briefings reference the actual symptoms and departments registered.
result: pending

### 8. Next.js Production Build compiler check
expected: Running `npm run build` compiles the Next.js application with zero TypeScript warnings or Turbopack errors.
result: pending

## Summary

total: 8
passed: 0
issues: 0
pending: 8
skipped: 0

## Gaps

[none]
