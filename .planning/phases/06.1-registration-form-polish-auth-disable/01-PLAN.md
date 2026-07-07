# Phase 6.1 Implementation Plan: OPD Registration Form Polish & Auth Disable

This plan details the steps to disable the authentication gate, refactor the Landing Page layout, and implement the high-fidelity Quick Registration form with interactive symptom chips.

## Proposed Changes

### 1. Unified Authentication Bypass
- **Modify** [`src/context/AuthContext.tsx`](file:///c:/Users/ASUS/phc%20copilot/src/context/AuthContext.tsx)
  - Hardcode authentication state to a default mock user (`{ uid: 'demo-user', email: 'mo@phc.gov.in' }`) and role (`'medical_officer'`).
  - Disable any route checking or `onAuthStateChanged` Firebase listeners so internal pages can be browsed without login barriers.
  - Set `hasAccess` to always return `true`.

### 2. AppShell Navigation Update
- **Modify** [`src/components/AppShell.tsx`](file:///c:/Users/ASUS/phc%20copilot/src/components/AppShell.tsx)
  - Merge sidebar and mobile navigation lists to show both `OPD Intake` (pointing to `/opd-registration`) and all standard Medical Officer dashboard routes.
  - Disable the client-side redirect gate in the `useEffect`.

### 3. Landing Page Cleanup
- **Modify** [`src/app/page.tsx`](file:///c:/Users/ASUS/phc%20copilot/src/app/page.tsx)
  - Remove the "No real-time visibility" card from the problem grid, adjusting the layout columns accordingly.
  - Remove the "OPD Patient Registration" mock form preview entirely, centering the solution text block.
  - Update hero section CTAs: "Register Patients (Receptionist)" routes directly to `/opd-registration`, and "Medical Officer Dashboard" routes directly to `/dashboard`.
  - Delete unused auth modal states and modal layout JSX.

### 4. Quick Registration Form & Symptom Chips
- **Modify** [`src/app/opd-registration/page.tsx`](file:///c:/Users/ASUS/phc%20copilot/src/app/opd-registration/page.tsx)
  - Update layout title to "Quick Registration Form".
  - Change the Department selector options to: `General OPD`, `Pediatrics`, `ANC`, `Immunization`.
  - Replace the "Symptoms" textarea with interactive chips: `Fever`, `Cough`, `Cold`, `Headache`, `Body Pain`, `Stomach Pain`, `Injury`, and `Other`.
  - Add state management to toggle active chips. If `Other` is selected, display a text input field for custom symptoms.
  - Upon submission, concatenate active chips and the custom text into a unified comma-separated symptoms string and write to Firestore.
