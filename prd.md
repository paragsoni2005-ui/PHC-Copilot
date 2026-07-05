# PHC Copilot
## AI-Powered Operations Assistant for Primary Health Centres

Version: MVP v1.0
Hackathon: Google Build with AI – Code for Communities
Track: Smart Health

---

# 1. Vision

PHC Copilot is an AI-powered operational decision support system for Primary Health Centres.

Unlike traditional Hospital Management Systems that only store data, PHC Copilot analyzes operational data using Google Gemini and provides actionable recommendations to healthcare workers.

The goal is to reduce medicine shortages, anticipate patient load, understand the operational impact of doctor attendance, and generate a daily AI briefing that helps staff make better decisions.

---

# 2. Problem Statement

Primary Health Centres often face operational challenges:

- Medicine shortages
- Unexpected patient surges
- Doctor absenteeism
- Manual report analysis
- Delayed decision making

Current systems mainly record information but rarely provide intelligent recommendations.

Healthcare workers spend significant time reviewing records instead of receiving clear operational guidance.

---

# 3. Goal

Build an AI assistant that transforms PHC operational data into actionable insights using Google Cloud and Gemini.

---

# 4. Target Users

Primary Users

- Medical Officer
- PHC Administrator
- Pharmacist
- ANM
- Staff Nurse

Secondary Users

- District Health Officials

---

# 5. Success Criteria

Healthcare worker can open the dashboard and immediately know:

- Which medicine needs reordering
- Expected patient load today
- Doctor attendance impact
- Today's operational priorities

within 30 seconds.

---

# 6. Core MVP Features

## Feature 1
AI Daily Operations Dashboard

Purpose

Provide a centralized operational overview.

Widgets

- Medicine Alerts
- Patient Footfall Prediction
- Doctor Attendance Status
- AI Priority Alerts
- Today's AI Action Plan

---

## Feature 2
Smart Medicine Inventory

Store

- Medicine Name
- Current Stock
- Daily Usage
- Expiry Date

AI predicts

- Remaining Days
- Shortage Risk
- Recommended Reorder Date

Output Example

ORS

Current Stock:
120

Average Usage:
35/day

Prediction

Stock will last approximately 3 days.

Recommendation

Reorder 500 packets today.

---

## Feature 3
Patient Footfall Prediction

Input

Historical patient data (Representative mock data)

AI predicts

- Expected OPD Patients
- Peak Hours
- Workload Risk

Example

Tomorrow Expected Patients

156

Peak Time

10:30 AM

Recommendation

Open second registration desk.

---

## Feature 4
Doctor Attendance Monitor

Store

- Doctor Name
- Status
- Shift

AI analyzes

Operational impact.

Example

Doctor Absent

↓

Expected waiting time increases

↓

Recommend shifting Nurse B to OPD.

---

## Feature 5
AI Daily Briefing

Generate one-click operational summary.

Example

Today's Summary

• ORS stock critically low.

• OPD expected to increase by 28%.

• One doctor absent.

• Vaccination stock sufficient.

Priority Actions

1. Order ORS

2. Shift Nurse B

3. Open OPD Counter 2

---

# 7. Screens

## Dashboard

Displays

- Operational Alerts
- AI Action Plan
- Summary Cards

---

## Medicine Inventory

Functions

- Add Medicine
- Update Stock
- AI Prediction

---

## Patient Footfall

Displays

- Historical Data
- Prediction
- Peak Hour

---

## Doctor Attendance

Displays

- Attendance Status
- Operational Impact

---

## AI Insights

Displays

- AI Daily Briefing
- Recommendations
- Action Plan

---

# 8. AI Features

Google Gemini will generate

- Daily Operational Briefing
- Medicine Shortage Prediction
- Operational Recommendations
- Doctor Attendance Impact Summary

Prompt examples

"Analyze today's PHC operational data and generate the highest priority actions."

---

# 9. Technology Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

Backend

- Next.js API Routes

AI

- Google Vertex AI & google ai studio
- Gemini 2.5 Flash

Database

Firestore (Google Cloud)

Deployment

Frontend

Firebase Hosting or Vercel

Backend

Google Cloud Run

Authentication

Firebase Authentication (Optional MVP)

Storage

Cloud Storage (Future)

---

# 10. Google Cloud Services

Vertex AI

Purpose

- AI recommendations
- Daily briefing
- Operational analysis

Firestore

Purpose

- Medicine inventory
- Attendance
- Patient statistics

Cloud Run

Purpose

Backend deployment

Firebase Hosting

Purpose

Frontend deployment

---

# 11. Representative Data

MVP will use representative sample datasets that simulate PHC operations.

Reason

Government healthcare datasets are not publicly accessible.

Architecture is designed so representative data can later be replaced with live PHC data.

---

# 12. Non-MVP Features (Future)

- Voice Input
- Voice Output
- Disease Trend Detection
- AI Chat Assistant
- Weekly Reports
- Multi-PHC Dashboard
- SMS Notifications
- Offline Mode
- Mobile Application

---

# 13. User Flow

Medical Officer

↓

Open Dashboard

↓

Review AI Alerts

↓

Check Medicine Prediction

↓

Review Patient Footfall

↓

Review Doctor Attendance

↓

Generate AI Briefing

↓

Take Operational Actions

---

# 14. Demo Flow

Step 1

Dashboard opens.

Step 2

Show medicine inventory.

Step 3

AI predicts shortage.

Step 4

Show patient footfall prediction.

Step 5

Mark one doctor absent.

Step 6

AI recalculates operational impact.

Step 7

Generate AI Daily Briefing.

Step 8

End with AI-generated Action Plan.

---

# 15. Innovation

Traditional PHC systems answer

"What is happening?"

PHC Copilot answers

"What should the healthcare worker do next?"

This shifts healthcare software from passive record management to AI-assisted operational decision support.

---

# 16. Hackathon Scope

This MVP demonstrates the AI decision-support workflow using representative operational data.

The architecture is cloud-native and can be extended to integrate live government health records in production without changing the core AI workflow.
