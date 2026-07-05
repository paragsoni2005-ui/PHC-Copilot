# Phase 2: High-Fidelity Feature Mock UIs - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-05
**User:** Medical Officer / System Operator / Visionary Partner
**Agent:** Antigravity AI Code Assistant

---

## Alternative Choices Considered

### 1. AI Daily Briefing Access
- **Alternative 1:** Keep sidebar navigation unchanged, and only access the `/briefing` view by clicking the "Generate Briefing" button on the Dashboard.
- **Alternative 2 (Chosen):** Treat Daily Briefing as a first-class citizen with its own route in the navigation sidebar, ensuring quick and persistent access, while maintaining the Dashboard hero card's button path as a prominent entry point.

### 2. Patient Footfall Analytics Visualization
- **Alternative 1:** Build custom lightweight SVGs with CSS styling. Fully server-compatible, zero hydration issues, but lacks built-in interactive tooltip hovering features.
- **Alternative 2 (Chosen):** Integrate `recharts` for interactive analytics, using dynamic imports (`ssr: false`) to avoid server-side hydration mismatches.

### 3. Mock Data Structure
- **Alternative 1:** Simple, flat key-value pairs enough for UI display.
- **Alternative 2 (Chosen):** Comprehensive, nested models reflecting full Firestore collections (dosage form, riskLevel, contact info, etc.) so that integration in Phase 5 is a direct replacement of datasource logic.

---

*Phase: 2-High-Fidelity Feature Mock UIs*
*Discussion logged: 2026-07-05*
