# Phase 6: Landing Page & Digital OPD Registration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-07
**Phase:** 06-landing-page-digital-opd-registration
**Areas discussed:** Onboarding flow integration, Role & Permission Service, Patient Collection Integration, Landing Page App Shell rendering

---

## Onboarding Flow Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Gate Medical Officer Dashboard | If first-time Medical Officer clicks "Medical Officer Dashboard", show the 3-step onboarding flow before dashboard access. | ✓ |
| View Onboarding Tour Link | Provide a manual "View Onboarding Tour" link on the landing page and bypass automatic redirection. | |
| Deprecate Onboarding | Deprecate the onboarding screens entirely since the landing page details features and workflow. | |

**User's choice:** Gate Medical Officer Dashboard

---

## Role & Permission Service

| Option | Description | Selected |
|--------|-------------|----------|
| Centralized Role Service & Firebase Auth | Implement a Role & Permission Service. Receptionists access OPD Registration (optionally Anonymous Auth/role selection). Medical Officers authenticate via Email/Password Firebase Auth. Session persisted using Firebase Auth, with role-based route guards and sidebar options. | ✓ |
| Local Storage Role Selector | Simple client-side role toggle stored in localStorage, changing UI rendering without login validation. | |
| settings Panel Role Selector | Add role selection in the Settings panel and dynamically update App Shell links. | |

**User's choice:** Centralized Role Service & Firebase Auth

---

## Patient Collection Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Patients Single Source of Truth | Auto-seed historical patient records in the `patients` collection and refactor the footfall charts to query/aggregate dynamically from patient registration timestamps. | ✓ |
| Aggregated Daily Count Document | Keep the Recharts footfall charts querying aggregated stats in the `footfall` collection, and increment daily totals when registering patients. | |
| Static Historical Charts | Keep historical footfall charts static, and only use `patients` collection for today's active patient list. | |

**User's choice:** Patients Single Source of Truth

---

## Landing Page App Shell Rendering

| Option | Description | Selected |
|--------|-------------|----------|
| Standalone Public Portal | Render the Landing Page as a completely standalone public portal without the application App Shell (no sidebar/bottom navigation). Render a premium responsive top navbar with smooth scrolling links. | ✓ |
| Render simplified sidebar | Render a simplified top navbar on the Landing Page, but keep the sidebar hidden. | |

**User's choice:** Standalone Public Portal

---

*Phase: 06-landing-page-digital-opd-registration*
*Discussion log generated: 2026-07-07*
