---
phase: 01-project-setup-core-app-shell
plan: 02
type: execute
wave: 2
depends_on:
  - "01"
files_modified:
  - src/app/page.tsx
  - src/app/onboarding/page.tsx
  - src/app/dashboard/page.tsx
  - src/app/settings/page.tsx
  - src/components/SplashScreen.tsx
  - src/components/OnboardingSlides.tsx
  - src/components/AppShell.tsx
autonomous: true
requirements:
  - ONBD-01
  - ONBD-02
  - ONBD-03
  - ONBD-04
  - DASH-01
  - DASH-04
  - SETT-01
must_haves:
  truths:
    - Splash screen displays health cross + AI spark icon and transitions after 2s.
    - Onboarding slides display feature details with skip/next logic and persist to localStorage.
    - App Shell provides desktop sidebar and mobile bottom navigation with active routing states.
    - Dashboard page renders basic summary statistic boxes, and Settings page displays API Key input.
  artifacts:
    - src/components/SplashScreen.tsx
    - src/components/OnboardingSlides.tsx
    - src/components/AppShell.tsx
    - src/app/page.tsx
    - src/app/onboarding/page.tsx
    - src/app/dashboard/page.tsx
    - src/app/settings/page.tsx
  key_links:
    - page.tsx checks localStorage to route to Onboarding or Dashboard
    - AppShell wraps Dashboard and Settings pages
---

<objective>
Build the Splash Screen, Onboarding Flow, App Shell (navigation), static Dashboard page layout, and Settings page.

Purpose: Implement all Phase 1 screens and routing mechanisms.
Output: Dynamic Splash timeout, onboarding slides, sidebar/bottom nav bar, static dashboard shell, and settings page.
</objective>

<execution_context>
@~/.gemini/antigravity/get-shit-done/workflows/execute-plan.md
@~/.gemini/antigravity/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-project-setup-core-app-shell/01-CONTEXT.md
@.planning/phases/01-project-setup-core-app-shell/01-01-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create Splash Screen and Onboarding Slides</name>
  <files>src/components/SplashScreen.tsx, src/components/OnboardingSlides.tsx, src/app/onboarding/page.tsx, src/app/page.tsx</files>
  <read_first>src/app/page.tsx, ui.md</read_first>
  <action>
    - Build src/components/SplashScreen.tsx: Render the logo, health cross, AI spark icon, and subtitle. Add CSS keyframe animations for a smooth 2-second fade-in/fade-out transition.
    - Build src/components/OnboardingSlides.tsx: Create a 3-step slide layout displaying the illustrations, headings, and descriptions from ui.md.
      - Slide 1: Smarter PHC Operations
      - Slide 2: AI That Helps You Decide
      - Slide 3: Stay One Step Ahead
      - Implement slide transition state, 'Skip' button (goes to dashboard), and 'Next/Get Started' buttons.
      - When 'Get Started' or 'Skip' is clicked, save `phc_first_visit_complete = true` in localStorage and redirect to `/dashboard`.
    - Build src/app/onboarding/page.tsx: Page routing to render the Onboarding component.
    - Update src/app/page.tsx: If client-side check shows `phc_first_visit_complete` is true, redirect to `/dashboard`, otherwise redirect to `/onboarding`. Include a loading wrapper rendering the Splash Screen.
  </action>
  <verify>
    <automated>node -e "require('fs').existsSync('src/components/SplashScreen.tsx') && require('fs').existsSync('src/components/OnboardingSlides.tsx') ? process.exit(0) : process.exit(1)"</automated>
  </verify>
  <done>Splash Screen timeout works, Onboarding slide navigation operates, first-visit status is tracked in localStorage, and redirection matches visit status.</done>
</task>

<task type="auto">
  <name>Task 2: Build App Shell and static Dashboard/Settings screens</name>
  <files>src/components/AppShell.tsx, src/app/dashboard/page.tsx, src/app/settings/page.tsx</files>
  <read_first>src/app/globals.css, ui.md, DESIGN.md</read_first>
  <action>
    - Build src/components/AppShell.tsx: Responsive layout component with:
      - Desktop: Fixed left-hand sidebar (280px) with logo, navigation links (Dashboard, Medicines, Footfall, Attendance, Settings), and profile avatar.
      - Mobile: Bottom navigation rail with clear active-state styles.
      - Main Content Area: Responsive container with standard padding.
      - Greeting Header: "Good Morning, Doctor" with dynamic date.
    - Build src/app/dashboard/page.tsx: Renders the Dashboard layout with:
      - Gradient Hero Card: Today's AI Briefing teaser with a "Generate Briefing" button.
      - 4 Statistics Cards: Medicine Alerts, Patient Footfall, Doctors Present, and Critical Issues.
      - Timeline Alerts: Static alerts from ui.md (ORS stock low, doctor absent, etc.).
      - AI Action Plan Checklist: Static checklist.
      - Wrap dashboard content in the AppShell component.
    - Build src/app/settings/page.tsx: Settings screen displaying profile info, theme selector, and a form to save Gemini API Key to localStorage. Include a "Reset Onboarding" button that clears localStorage state. Wrap settings content in the AppShell component.
  </action>
  <verify>
    <automated>node -e "require('fs').existsSync('src/components/AppShell.tsx') && require('fs').existsSync('src/app/dashboard/page.tsx') ? process.exit(0) : process.exit(1)"</automated>
  </verify>
  <done>App Shell displays navigation correctly based on screen size, routing transitions display active navigation styles, dashboard renders statistics boxes, and settings key input works.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Client browser localStorage | User configuration and API keys are stored client-side |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-02 | Information Disclosure | Local Storage | mitigate | Gemini API Key must be stored locally in localStorage. The settings input field should use type="password" to mask key. |
</threat_model>

<verification>
Run `npm run build` to confirm compilation. Start the local server using `npm run dev` and navigate through all routes `/`, `/onboarding`, `/dashboard`, and `/settings` to confirm correct navigation and visual correctness.
</verification>

<success_criteria>
- Navigation layout and active route styles display correctly on mobile and desktop widths.
- Dashboard renders greeting header and static panels.
- Settings page allows inputting Gemini API Key and resetting onboarding visit flags.
</success_criteria>

<output>
After completion, create `.planning/phases/01-project-setup-core-app-shell/01-02-SUMMARY.md`
</output>
