# Phase 3: Local Persistence & Interactive Prototype - Discussion Log

**Date:** 2026-07-06
**Phase:** 3 — Local Persistence & Interactive Prototype
**Mode:** Default (interactive)

## Discussion Areas

### 1. Repository Layer Structure
**Options presented:**
- A: `src/services/` with one file per domain + shared `storageAdapter.ts` interface
- B: `src/repositories/` with interface + localStorage implementation split

**User selected:** Option B — `src/repositories/` with interface + implementation split
**Notes:** Clean separation enables Phase 5 Firestore migration by adding new implementation files without modifying interfaces or hooks.

### 2. State Management Approach
**Options presented:**
- A: Custom React hooks per domain calling the repository internally
- B: React Context providers per domain wrapping the repository

**User selected:** Option A — Custom React hooks per domain
**Notes:** Simpler, less boilerplate. Hooks provide the component-facing API; components never import repositories directly.

### 3. Settings API Key Toggle (SETT-02)
**Options presented:**
- A: Simple toggle switch + API key input field
- B: Dropdown with modes (Mock / Live) + separate section with "Test Connection" button

**User selected:** Option B — Dropdown with modes + Test Connection button
**Notes:** More polished UX for a settings screen.

## Pre-Answered Decisions (from user's initial message)
- Repository/Storage Service pattern ✓
- UI components must never access localStorage directly ✓
- All CRUD through reusable service/repository methods ✓
- Business logic separate from UI ✓
- Data models match future Firestore collections ✓
- Phase 5 migration = replace storage implementation only ✓
- SOLID principles, clean modular TypeScript ✓

## Deferred Ideas
- None raised during this discussion.

---
*Discussion completed: 2026-07-06*
