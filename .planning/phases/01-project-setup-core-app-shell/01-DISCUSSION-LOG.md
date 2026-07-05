# Phase 1: Project Setup & Core App Shell - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-05
**Phase:** 1-Project Setup & Core App Shell
**Areas discussed:** Frontend Architecture & Navigation, Mock Data & Initial State Strategy, Onboarding & Splash Screen Behavior, Design System & Styling Setup

---

## Frontend Architecture & Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Next.js App Router | Next.js default, uses folder-based routing, server components, and layout files. | ✓ |
| Next.js Pages Router | Traditional routing, simpler structure, standard for legacy projects. | |

**User's choice:** Next.js App Router.
**Notes:** Decided to align with modern default routing paradigm.

---

## Application Shell Routing

| Option | Description | Selected |
|--------|-------------|----------|
| File-based routing & Next.js Link | Real Next.js routes for each screen (e.g. /dashboard, /inventory) with a global Layout component. | ✓ |
| Client-side State Tabs | Single-page dashboard switching widgets via React state, simpler for mock-only apps. | |

**User's choice:** File-based routing & Next.js Link.
**Notes:** Provides a real routing structure matching a production-ready application shell.

---

## Mock Data & Initial State Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Centralized Mock Data | Stored in src/mocks/ for clean imports and easy transition to database later. | ✓ |
| Inline Mock Data | Hardcoded directly inside the page components. | |

**User's choice:** Centralized Mock Data.
**Notes:** Decided to store mock data centrally in TS files under `src/mocks/` to keep page components clean and allow simple swap-out when database is introduced.

---

## Onboarding & Splash Screen Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Automatic Timeout | Redirect to Onboarding after a 2-second display timer and fade-out transition. | ✓ |
| Interactive Click | Wait for the user to click a 'Get Started' button on the Splash screen to proceed. | |

**User's choice:** Automatic Timeout.
**Notes:** Decided on a smooth 2-second automatic splash screen loading fade.

---

## Onboarding Persistence

| Option | Description | Selected |
|--------|-------------|----------|
| Track via localStorage | Save a 'first_visit' flag; skip onboarding and go straight to /dashboard on subsequent visits. | ✓ |
| Always Show | Onboarding slides are shown on every reload. | |

**User's choice:** Track via localStorage.
**Notes:** Decided to skip onboarding on repeat visits, but add a reset option in Settings to facilitate easy demo re-runs.

---

## Styling Setup

| Option | Description | Selected |
|--------|-------------|----------|
| Global CSS Variables | Map Stitch design tokens in src/app/globals.css as standard CSS custom properties. | ✓ |
| CSS Modules | Scoped styles per component. | |

**User's choice:** Global CSS Variables.
**Notes:** Decided to use global CSS variables to implement the Material 3 design tokens.

---

## Visual Elevation

| Option | Description | Selected |
|--------|-------------|----------|
| Glassmorphism | Backdrop-filter blurs and translucent background styling for a premium aesthetic. | ✓ |
| Flat Minimal | Flat card styling without filters. | |

**User's choice:** Glassmorphism.
**Notes:** Decided on premium glassmorphism styling to match the premium command center design goals.
