# Directory Structure

This document details the layout of the PHC Copilot application and explains the purpose of each major directory.

## Root Directory
- **`src/`**: The core source code of the application.
- **`public/`**: Static assets like images and icons.
- **`.planning/`**: Agent planning and documentation directory (where this file resides).
- **Configuration files**: Standard Node.js and Next.js configuration files (`package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, etc.).
- **Requirement Specs**: Files like `prd.md`, `prd2.md`, `ui.md`, `DESIGN.md` outline product requirements and specifications.

## `src/` Layout

### `src/app/`
The Next.js App Router directory. Defines the application's routing structure and API endpoints.
- **`api/copilot/route.ts`**: The backend API endpoint for communicating with the Gemini AI service.
- **Pages**: Subdirectories for each route containing `page.tsx` files.
  - `attendance/`: Staff attendance and rostering page.
  - `briefing/`: AI-generated daily briefings.
  - `dashboard/`: The main overview screen.
  - `footfall/`: Patient volume and surge analytics.
  - `medicines/`: Inventory and stock management.
  - `onboarding/`: Initial user onboarding flow.
  - `opd-registration/`: Patient registration interface for OPD.
  - `settings/`: App configuration (API keys, Live vs Local mode).
- **`layout.tsx`**: The root layout wrapper including global providers.

### `src/components/`
Reusable React UI components used across the application pages.
- Contains primary layout shells such as `AppShell.tsx` and `ReceptionistShell.tsx`.
- Contains view-specific components like `OnboardingSlides.tsx` and `SplashScreen.tsx`.

### `src/context/`
React Context definitions for global state that needs to be accessed anywhere in the component tree.
- **`AuthContext.tsx`**: Provides user authentication state, roles, and route protection logic.

### `src/hooks/`
Custom React hooks that encapsulate business logic, state management, and repository interactions.
- Examples: `useBriefing.ts`, `useDoctors.ts`, `useMedicines.ts`, `useFootfall.ts`.
- These hooks act as the primary interface between the UI components and the data repositories.

### `src/lib/`
Utility modules and third-party initializations.
- **`firebase.ts`**: Initializes the Firebase app and exports the Firestore database instance (`db`).

### `src/mocks/`
Mock data definitions used when the application is running in "Local" simulator mode.
- Contains files like `doctors.ts`, `footfall.ts`, and `medicines.ts` providing static fallback data.

### `src/repositories/`
The Data Access Layer. Implements the Repository Pattern to abstract the origin of data.
- **Interfaces**: Definitions of the contracts (e.g., `IDoctorRepository.ts`).
- **Firestore Repositories**: Implementations that connect to Firebase Firestore for real-time syncing (`FirestoreDoctorRepository.ts`).
- **Local Repositories**: Implementations that return mock data or utilize local storage (`LocalDoctorRepository.ts`).

### `src/services/`
Complex business logic and external service integrations that sit outside of standard data fetching.
- **`GeminiService.ts`**: Handles prompt engineering and interaction with the Google Gemini API.
- **`FirestoreSeeder.ts`**: Automatically seeds an empty Firestore database with initial mock data.

### `src/types/`
TypeScript type definitions and interfaces for the domain models.
- **`store.ts`**: Defines the shapes of primary data entities like `Medicine`, `Doctor`, `Patient`, and `FootfallRecord`.
