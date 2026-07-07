---
phase: 5
slug: google-cloud-firestore-database
status: verified
threats_open: 0
asvs_level: 1
created: 2026-07-07
---

# Phase 5 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Client Environment | User's browser running Next.js SPA | Outgoing Writes / Incoming Listeners |
| Google Cloud Firestore | Remote cloud database service | Reads/Writes and Seeding operations |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-5-01 | Information Disclosure | Environment Configuration | mitigate | Load Firebase keys from process.env via NEXT_PUBLIC prefix. Placeholder credentials in .env.example. | closed |
| T-5-02 | Denial of Service | Database Seeding | mitigate | Seeding logic checks system/metadata collection document presence before writing. | closed |
| T-5-03 | Elevation of Privilege | Footfall Analytics Repository | mitigate | FirestoreFootfallRepository exposes only get/read operations, keeping analytics read-only. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

No accepted risks.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-07 | 3 | 3 | 0 | Antigravity |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-07
