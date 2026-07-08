# Quick Task: Seed Firestore with Verification Data

Seed Firestore with precise patient registration counts over the last 14 days (including today) to match and test the deterministic forecasting methodology.

## Proposed Changes

### Next.js API Route

#### [NEW] [route.ts](file:///C:/Users/ASUS/phc%20copilot/src/app/api/seed-verification/route.ts)
- Create a GET endpoint `/api/seed-verification` that:
  - Deletes all current documents in the `patients` collection.
  - Seeds new patients with precise timestamps, departments, symptoms, and visit types matching the target counts:
    - Wed Jul 1 (7 days ago): 38 patients
    - Thu Jul 2 (6 days ago): 41 patients
    - Fri Jul 3 (5 days ago): 42 patients
    - Sat Jul 4 (4 days ago): 45 patients
    - Sun Jul 5 (3 days ago): 42 patients
    - Mon Jul 6 (2 days ago): 45 patients
    - Tue Jul 7 (1 day ago): 49 patients
    - Wed Jul 8 (today): 51 patients (peak hour 11am-12pm)
    - Thu Jun 25 (14 days ago): 42 patients (for Day-of-week Thursday baseline)
  - Distributes departments according to: General OPD (~72%), Pediatrics (~15%), ANC (~8%), Immunization (~5%).
  - Sets symptoms to trigger alerts: Fever (>50%) and Cough (>40%).

## Verification
- Invoke the endpoint `GET /api/seed-verification` and check the response.
- Visit the Dashboard and Footfall pages to verify that the prediction is ~44, the risk is "HIGH", the peak hour is 11:00 AM - 12:00 PM, and the AI recommendations reflect the staffing/medicine alerts.
