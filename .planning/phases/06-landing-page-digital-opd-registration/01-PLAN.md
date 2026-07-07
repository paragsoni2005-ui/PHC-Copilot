---
phase: 06-landing-page-digital-opd-registration
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/firebase.ts
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/components/AppShell.tsx
  - package.json
autonomous: true
requirements:
  - LND-01
  - LND-02
  - LND-03
  - LND-04
  - LND-05
  - LND-06
must_haves:
  truths:
    - package.json includes framer-motion as a dependency (D-02).
    - src/lib/firebase.ts exports the auth instance from getAuth(app).
    - src/context/AuthContext.tsx exists and exposes AuthContext with role, user, loading, and action helpers (D-02).
    - src/app/layout.tsx wraps children in AuthProvider.
    - src/app/page.tsx renders the public standalone landing page with top navigation, Framer Motion animations, and role selection modal (D-01).
    - src/components/AppShell.tsx implements client-side role guards and hides/shows navigation items based on role (D-03).
  artifacts:
    - src/context/AuthContext.tsx
    - src/app/page.tsx
  key_links:
    - AppShell queries AuthContext to restrict views and adapt navigation options.
---

<objective>
Build the Landing Page entry experience, central authentication service, and client-side role-based routing guards.
This creates a standalone public portal at / that allows Receptionists and Medical Officers to select their roles, sign in, and access their respective dashboard and registration routes securely.
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
  <name>Task 1: Install dependencies and update Firebase configuration</name>
  <files>package.json, src/lib/firebase.ts</files>
  <read_first>package.json, src/lib/firebase.ts</read_first>
  <action>
    - Add `"framer-motion": "^11.18.0"` to dependencies in package.json.
    - Run npm install.
    - Modify src/lib/firebase.ts to import `getAuth` from `firebase/auth`.
    - Initialize and export `auth` (e.g. `const auth = getAuth(app); export { app, db, auth };`).
  </action>
  <acceptance_criteria>
    - framer-motion is installed and compiles.
    - src/lib/firebase.ts exports auth instance.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Build Centralized AuthContext and Provider</name>
  <files>src/context/AuthContext.tsx, src/app/layout.tsx</files>
  <read_first>src/lib/firebase.ts, src/app/layout.tsx</read_first>
  <action>
    - Create src/context/AuthContext.tsx.
    - Define user states: `user` (Firebase User | null), `role` ('receptionist' | 'medical_officer' | null), and `loading` (boolean).
    - Use `onAuthStateChanged` to listen to auth updates.
    - If user is anonymous or signed in, retrieve their role from `/users/{uid}` in Firestore. If the document doesn't exist, check a localStorage override or default anonymous to 'receptionist'.
    - Implement `signInAsReceptionist()`: uses Firebase `signInAnonymously(auth)` and sets role to 'receptionist'.
    - Implement `signInAsMedicalOfficer(email, password)`: uses Firebase `signInWithEmailAndPassword(auth, email, password)` and verifies they have the 'medical_officer' role from Firestore.
    - Implement `signOut()`: signs out from Firebase and clears role state.
    - Implement `hasAccess(path)`: returns true if the user's role is allowed on that path.
    - Wrap the children in layout.tsx with `<AuthProvider>`.
  </action>
  <acceptance_criteria>
    - src/context/AuthContext.tsx compiles without errors.
    - AuthProvider is registered in layout.tsx.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Implement Standalone Public Landing Page</name>
  <files>src/app/page.tsx</files>
  <read_first>src/app/page.tsx, prd2.md</read_first>
  <action>
    - Rewrite src/app/page.tsx to render the public Landing Page.
    - Remove the automatic redirect logic.
    - Build sections: Hero, Problem statement, Our Solution, Animated timeline workflow, Features highlights cards, Tech stack logos, Expected Clinic impacts, and Footer.
    - Use Framer Motion for fade-in animations on sections and slide-ups on timeline.
    - Implement a responsive top navigation bar with smooth-scroll section links.
    - Add a Sign In Modal overlay triggered by CTAs ("Register Patients" or "Medical Officer Dashboard"):
      - Receptionists: One-click "Enter as Receptionist" which calls signInAsReceptionist() and navigates to `/opd-registration`.
      - Medical Officers: Email & Password forms that authenticate via signInAsMedicalOfficer() and navigate to `/dashboard`.
  </action>
  <acceptance_criteria>
    - page.tsx compiles successfully.
    - Root page displays landing page content and doesn't redirect automatically.
    - Modals trigger authentication successfully.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 4: Add Navigation Guards & Route Restriction to AppShell</name>
  <files>src/components/AppShell.tsx</files>
  <read_first>src/components/AppShell.tsx, src/context/AuthContext.tsx</read_first>
  <action>
    - Modify src/components/AppShell.tsx to import `useAuth` context.
    - If auth loading is true, render a fullscreen loading spinner.
    - If user is not authenticated, redirect them to `/`.
    - Check if current path matches role access permissions. If blocked, render an "Access Denied" view or redirect.
    - Dynamically render sidebar items and mobile bottom nav:
      - If role is 'receptionist', hide all standard dashboard nav links (Dashboard, Briefing, Medicines, Footfall, Attendance, Settings) and show only a "OPD Registration" navigation item and a "Sign Out" button.
      - If role is 'medical_officer', show the standard navigation sidebar but hide any patient edit/delete action items (handled in wave 2 forms).
  </action>
  <acceptance_criteria>
    - AppShell compiles successfully.
    - AppShell blocks unauthenticated users.
    - AppShell adjusts navigation links based on roles.
  </acceptance_criteria>
</task>

</tasks>

## Verification Plan

### Automated Tests
- Run `npm run build` to verify Next.js builds successfully.

### Manual Verification
- Navigate to `/` and verify the premium Landing Page, Framer Motion animations, and scroll links.
- Click "Enter as Receptionist" and verify redirects to `/opd-registration` and check if AppShell navigation sidebar is hidden.
- Try accessing `/dashboard` as a Receptionist and verify redirect or access denied blocks.
- Sign out, and login as a Medical Officer to confirm dashboard access.
