# Technology Stack

## Core Framework & Language
* **Next.js (16.2.10)**: The core framework for the application, utilizing the App Router (`src/app` directory) and API routes (`src/app/api`).
* **React (19.2.4)**: The underlying UI library.
* **TypeScript (v5)**: The primary programming language used across the codebase, ensuring type safety.

## Styling & UI
* **Vanilla CSS**: The project primarily uses standard CSS with custom CSS variables (defined in `globals.css`). It implements a design system with a Glassmorphism aesthetic and custom utility classes (e.g., `.glass-container`, `.text-body-sm`).
* **Lucide-React (^1.23.0)**: Used for iconography throughout the application.
* **Recharts (^3.9.2)**: Used for data visualization, specifically for rendering footfall trends and charts.
* **Framer Motion (^12.42.2)**: Used for UI animations and transitions.

## Data Management & Architecture
* **Repository Pattern**: The application abstracts data access using a repository pattern (located in `src/repositories`), with interfaces (e.g., `IMedicineRepository`) implemented by both local storage and remote database providers.
* **Custom React Hooks**: Data fetching, state management, and business logic are encapsulated in custom hooks (e.g., `useBriefing.ts`, `useMedicines.ts`) found in `src/hooks`.

## Linting & Build Tools
* **ESLint (v9)**: Configured for code linting to maintain code quality.
