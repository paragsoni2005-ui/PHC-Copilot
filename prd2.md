# PRD – Landing Page & Digital OPD Registration
## PHC Copilot – AI Operating System for Rural Primary Healthcare

**Version:** 1.0
**Module:** Landing Page + Digital OPD Registration
**Priority:** High
**Phase:** Before Dashboard (Entry Experience)

---

# 1. Overview

This module introduces users to PHC Copilot and serves as the entry point into the application. It provides role-based access for Receptionists and Medical Officers while replacing traditional paper-based OPD registration with a lightweight digital workflow.

The registration module becomes the primary source of patient footfall data used throughout the application.

---

# 2. Problem Statement

Most rural Primary Health Centres still maintain OPD registers manually.

Problems include:

- Paper registers consume time.
- Patient counting is manual.
- Daily reporting requires additional effort.
- No real-time operational visibility.
- AI cannot generate meaningful insights without structured data.

The application solves this by introducing a simple digital registration workflow that automatically powers operational analytics.

---

# 3. Goals

### Landing Page

- Introduce PHC Copilot
- Explain the product vision
- Showcase major features
- Allow users to select their role
- Create a premium first impression

### OPD Registration

- Replace paper OPD register
- Register patients in under 30 seconds
- Automatically update patient footfall
- Sync instantly with Firestore
- Feed AI insights without additional manual work

---

# 4. User Roles

## Receptionist

Responsibilities

- Register new patients
- Search registrations
- Edit today's entries if needed

Cannot access

- Inventory
- AI Briefing
- Analytics
- Attendance

---

## Medical Officer

Responsibilities

- View dashboard
- Monitor OPD trends
- Inventory management
- Doctor attendance
- AI Daily Briefing
- Community Health Alerts

Cannot edit OPD registrations.

---

# 5. Landing Page

## Hero Section

Project Name

PHC Copilot

Tagline

> From Paper to Intelligence. Empowering  Healthcare.

Subtitle

Digitize OPD registration, monitor clinic operations, and receive AI-powered recommendations in real time using Google Cloud and Gemini.

---

## Primary CTA

Button

Register Patients

Navigate to

/opd-registration

---

## Secondary CTA

Button

Medical Officer Dashboard

Navigate to

/dashboard

---

## Hero Animation

Premium healthcare illustration

Animation includes

- Rural Health Centre
- Doctors
- Patients
- AI Glow
- Floating Medical Icons
- Animated Dashboard Preview

Use Framer Motion.

---

# 6. Feature Highlights

Display glassmorphism cards.

Cards

- Digital OPD Registration
- Smart Medicine Inventory
- Doctor Attendance Tracking
- Live Patient Footfall Analytics
- AI Daily Briefing
- Community Health Alerts

Each card includes icon, title and short description.

---

# 7. Workflow Section

Animated Process Timeline

Patient Arrives

↓

Reception Registers Patient

↓

Dashboard Updates

↓

Gemini Generates Operational Insights

---

# 8. Technology Section

Show logos

- Google Cloud
- Gemini & Antigravity
- Firestore
- Next.js
- Firebase

Small description under each.

---

# 9. Project Impact Section

Title

Expected Impact

Cards

Reduce paperwork

Faster reporting

Real-time monitoring

AI-assisted decisions

Clearly mention

"Projected benefits for PHCs."

---

# 10. Footer

AI Operating System for Healthcare

# 11. OPD Registration Module

Purpose

Replace paper-based OPD registers.

---

# 12. Registration Form

Fields

Patient Name (Optional)

Age

Gender

Visit Type

- New
- Follow-up

Department

Symptoms

Village

Phone Number (Optional)

Registration Time

Auto Generated

Registration ID

Auto Generated

Register Button

---

# 13. Validation

Required

- Age
- Gender
- Department
- Symptoms
- Visit Type

Optional

- Name
- Phone

Show friendly validation messages.

---

# 14. After Registration

Immediately

Save into Firestore.

Automatically

Increase today's patient count.

Update

- Dashboard
- Footfall analytics
- AI recommendations

No refresh required.

---

# 15. Real-time Synchronization

Reception registers patient

↓

Firestore

↓

Dashboard updates instantly

↓

Medical Officer sees new count

↓

Gemini uses latest data

Use Firestore onSnapshot() listeners.

---

# 16. Registration Table

Display today's registrations.

Columns

Registration ID

Time

Age

Gender

Department

Symptoms

Visit Type

Status

Actions

---

# 17. Search

Search by

- Registration ID
- Name
- Symptoms

---

# 18. Filters

Today

Yesterday

Department

Visit Type

Gender

---

# 19. Actions

View

Edit

Delete (Admin Only)

---

# 20. Firestore Collection

Collection

patients

Document Structure

patientId

name

age

gender

village

phone

department

symptoms

visitType

registeredAt

createdBy

status

---

# 21. AI Integration

Every registration contributes to

- Patient Footfall
- Disease Trend Analysis
- Community Health Alerts
- AI Daily Briefing

No duplicate data entry required.

---

# 22. Non-Functional Requirements

Registration under 30 seconds

Responsive on desktop and tablet

Firestore real-time sync

Material Design 3

Glassmorphism UI

Accessibility compliant

Smooth animations

Loading states

Error handling

Offline retry support (future)

---

# 23. Success Criteria

Receptionist can register patients quickly.

Dashboard updates automatically.

Medical Officer sees live footfall.

AI receives structured patient data.

Paper register is no longer required.

The complete workflow—from patient arrival to AI-assisted operational insights—is demonstrated clearly during the hackathon.

# 24. Structure For Landing Page Flow
Instead of jumping directly from Features to Footer:
Hero

↓

Problem We Solve

↓

Our Solution

↓

How It Works

↓

Key Features

↓

Technology Stack

↓

Expected Impact

↓

Why PHC Copilot?

↓

Footer