# Codebase Conventions

This document outlines the coding standards, naming conventions, architectural patterns, and styling approaches used in the **PHC Copilot** Next.js project.

## 1. Architectural Patterns
- **Framework:** Next.js (App Router, v14/v15+ compatible) with React 19.
- **Directory Structure (Feature/Layer based):**
  - `src/app/`: Next.js routing (pages, layouts, API routes).
  - `src/components/`: Reusable UI components (e.g., `AppShell`, `OnboardingSlides`).
  - `src/context/`: React Context providers (e.g., `AuthContext`).
  - `src/hooks/`: Custom React hooks.
  - `src/lib/`: Third-party configuration and lightweight utilities (e.g., `firebase.ts`).
  - `src/mocks/`: Representative mock data files to simulate PHC operations.
  - `src/repositories/`: Data access layers (if abstracted from components).
  - `src/services/`: Core business logic and external service integrations (e.g., `GeminiService.ts`, `FirestoreSeeder.ts`).
  - `src/types/`: TypeScript interface and type definitions.

## 2. Coding Standards & TypeScript
- **Strict Typing:** TypeScript is configured with `"strict": true`. All components, props, and API responses should have proper interfaces/types.
- **Path Aliasing:** Use the `@/` prefix to import files from the `src/` directory (e.g., `import { useAuth } from "@/context/AuthContext";`).
- **Linting:** Standard `eslint-config-next` rules apply (Core Web Vitals and TypeScript rules enabled).
- **Client vs Server Components:** Components relying on hooks (e.g., `useAuth`, `usePathname`) or interactivity must have the `"use client";` directive at the top. Server components should be used where possible for data fetching or static layouts.

## 3. Naming Conventions
- **React Components:** PascalCase for filenames and function names (e.g., `AppShell.tsx`, `SplashScreen.tsx`).
- **Utility/Service Files:** camelCase or PascalCase depending on exports (e.g., `firebase.ts`, `GeminiService.ts`).
- **Constants/Mocks:** camelCase for filenames (e.g., `footfall.ts`), but variables should be camelCase or UPPER_SNAKE_CASE if globally constant.
- **Types:** PascalCase for interfaces and type aliases (e.g., `AppShellProps`). Prefixing with `I` is generally avoided in favor of descriptive naming.

## 4. Styling Approach & Theming
- **CSS Strategy:** The project currently relies on standard CSS with CSS Variables and Next.js built-in `styled-jsx` (`<style jsx>` and `<style jsx global>`). *Note: While Tailwind CSS is mentioned in some design docs, the current implementation utilizes raw CSS modules/styled-jsx.*
- **Design System Implementation:** A comprehensive design token system is configured in `src/app/globals.css`.
  - **Colors:** Extensively uses CSS variables (`--color-primary`, `--color-surface`, `--color-clinical-teal`, `--color-ai-glow`).
  - **Glassmorphism:** Leverages utility classes like `.glass-container`, `.glass-sidebar` heavily to achieve a modern, "AI Command Center" aesthetic.
  - **Typography:** Relies on the Inter font family, utilizing specific classes like `.text-body-base`, `.text-body-sm`, `.text-label-caps`.
  - **Animations:** Custom keyframe animations (e.g., `fadeIn`, `pulseGlow`) are used for AI suggestions and status sparkles.
- **UI Components:** Utilizes `lucide-react` for consistent SVG iconography and `recharts` for data visualization.

## 5. Integration Patterns
- **Firebase:** Used for Authentication and Database (Firestore).
- **Google Gemini:** Leveraged via dedicated services (`GeminiService`) to abstract prompt generation and response parsing from the UI components.
