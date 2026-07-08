# Testing Strategy & Guidelines

This document details the testing approach for the **PHC Copilot** project.

## Current State
At present, the project is structured as an MVP (Hackathon build) and **does not have a testing framework configured**. There are no unit, integration, or end-to-end tests, nor are there testing dependencies (such as Jest, Vitest, Cypress, or React Testing Library) listed in `package.json`.

## Proposed Testing Strategy
As the project transitions from MVP to a production-grade system, the following testing strategies should be adopted to ensure reliability for healthcare operations.

### 1. Unit Testing
- **Framework Recommendation:** [Vitest](https://vitest.dev/) or [Jest](https://jestjs.io/).
- **Scope:**
  - **Services:** High priority. Files in `src/services/` (like `GeminiService.ts` and `FirestoreSeeder.ts`) should be thoroughly tested to ensure AI prompts are constructed correctly and data seeding behaves as expected.
  - **Utilities:** Any data transformation logic, date formatting, and inventory prediction algorithms.
  - **Hooks:** Custom React hooks should be tested using `@testing-library/react-hooks`.

### 2. Component Testing
- **Framework Recommendation:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) paired with Vitest/Jest.
- **Scope:**
  - UI components in `src/components/` (e.g., `AppShell`, widgets, cards).
  - Ensure that conditional rendering works based on props (e.g., AI Alerts showing different states like "Critical" vs "Normal").
  - Assert that `lucide-react` icons and `recharts` graphs mount correctly.

### 3. End-to-End (E2E) Testing
- **Framework Recommendation:** [Playwright](https://playwright.dev/) or [Cypress](https://www.cypress.io/).
- **Scope:**
  - Simulate the main user journey of a Medical Officer: logging in, viewing the AI Daily Operations Dashboard, generating a Daily Briefing, and acknowledging Medicine Alerts.
  - Ensure routing via Next.js App Router works seamlessly between `/dashboard`, `/medicines`, `/footfall`, and `/attendance`.

### 4. Mocking Strategy
The project already contains a `src/mocks/` directory with representative data (`doctors.ts`, `footfall.ts`, `medicines.ts`).
- These mocks are currently used to seed the database and populate UI components.
- **Testing Reusability:** These exact same mock files should be imported into test suites to assert predictable UI outputs and to stub API/Firestore responses using tools like `msw` (Mock Service Worker) or Jest/Vitest's built-in mocking capabilities.

### 5. Future CI/CD Integration
Once testing frameworks are configured, tests should be integrated into a GitHub Actions (or similar) pipeline to automatically run:
- Linting (`npm run lint`)
- Type checking (`tsc --noEmit`)
- Unit and Component Tests
- E2E tests against preview deployments

By establishing these testing layers, the PHC Copilot can ensure the high standard of reliability required for a healthcare operational decision support system.
