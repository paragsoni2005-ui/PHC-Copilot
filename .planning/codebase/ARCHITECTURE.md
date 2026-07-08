# System Architecture

This document outlines the software design, patterns, state management, and data flow in the PHC Copilot application.

## High-Level Architecture
PHC Copilot is built as a **Next.js (App Router)** application. It primarily operates as a client-heavy dashboard that interfaces with a Firebase/Firestore backend and Google Gemini API for AI-driven operational insights.

## State Management and Data Flow
The application uses a decentralized approach to state management leveraging React's built-in Hooks and the **Repository Pattern**.

1. **Custom Hooks as Controllers:** 
   Instead of a global state store like Redux, domain-specific state is managed within custom hooks in `src/hooks/` (e.g., `useBriefing.ts`, `useDoctors.ts`, `useMedicines.ts`). These hooks handle component-level state (`useState`, `useEffect`) and expose clean, reactive interfaces to the UI components.
2. **Repository Pattern:**
   The application abstracts data fetching behind a repository layer (`src/repositories/`). Each domain model (Briefing, Doctor, Medicine, Footfall) has an interface (e.g., `IDoctorRepository`) with two concrete implementations:
   - `Local*Repository`: Uses local mock data for testing/offline scenarios.
   - `Firestore*Repository`: Interfaces directly with Firebase Firestore for real-time live data using `onSnapshot` listeners.
3. **Data Hydration Toggle:**
   The hooks dynamically inject the correct repository implementation based on the environment mode (Live vs. Local) read from `LocalSettingsRepository`.
4. **Context API:**
   Global cross-cutting concerns, such as Authentication and Route Protection, are handled via the React Context API (`src/context/AuthContext.tsx`).

## API and AI Integration (Data Flow)
The application integrates with Google Gemini to provide "Copilot" features (e.g., AI briefings, restocking predictions).

1. **Trigger:** A user action or mount in the UI calls a method exposed by a hook (e.g., `generateBriefing` in `useBriefing.ts`).
2. **Data Aggregation:** The hook gathers real-time current state across various repositories (Medicines, Doctors, Footfall).
3. **API Route:** The frontend posts this combined payload to the Next.js API route (`src/app/api/copilot/route.ts`).
4. **Service Layer:** The Next.js API route instantiates the `GeminiService` (`src/services/GeminiService.ts`) and sometimes executes supplementary queries directly against Firestore (e.g., fetching recent patient logs).
5. **AI Processing:** The `GeminiService` constructs the prompt using the aggregated data and calls the external Gemini API.
6. **Response Cycle:** The structured AI response is returned to the frontend, parsed, and updated in the hook's state, triggering a UI re-render.

## Core Patterns
- **Repository Pattern:** Separates the data access logic from the business logic/hooks.
- **Service Layer Pattern:** Encapsulates third-party API communication (Firebase Seeder, Gemini Service) within `src/services/`.
- **Smart Hooks / Dumb Components:** Pages and components mostly focus on layout and styling, delegating business logic and state orchestration to `src/hooks`.
