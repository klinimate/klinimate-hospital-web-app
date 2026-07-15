# 08 – UI / UX Design

**Version:** 2.0

**Status:** Active

**Owner:** Dr. Avdhut Kulkarni (Founder & Director)

---

# Purpose

This document defines the official User Interface (UI) and User Experience (UX) standards for the Klinimate Platform.

Every screen within Klinimate must be simple, intuitive, mobile-first, and designed to reduce clinician workload while improving patient care.

Clinical Intelligence should always be presented before detailed clinical documentation.

---

# Design Philosophy

Klinimate is an AI-powered Clinical Intelligence Platform.

The experience should feel like:

**WhatsApp + ChatGPT for Healthcare**

The interface should help clinicians understand the patient before asking them to review documentation.

Patient Intelligence always comes first.

Documentation supports Patient Intelligence.

---

# Core Design Principles

Every screen should be:

- Mobile-first
- White background
- Minimal branding
- Large touch-friendly controls
- Maximum three taps to any primary function
- One primary action per screen
- Fast loading
- Minimal scrolling
- Click More • Type Less
- Search • Select • Save
- AI Assists • Clinicians Decide

---

# Login Screen

Purpose

Secure platform access.

Display

- Klinimate Logo
- Email / Mobile Number
- Password
- Sign In
- Forgot Password

After login, users are automatically directed to their role-based workspace.

---

# Bottom Navigation

Every Healthcare Organization user sees the same navigation.

```
🏥 Patients

➕ Register

🧠 Klinimate

⚙️ Organization
```

Users do not switch applications.

The same navigation is used by:

- Doctors
- Nurses
- Consultants

The logged-in profile determines available actions.

---

# Patients Screen

The Patients screen is the default home page.

Display:

- Search Patient
- Ward Filters
- Care Setting Filters
- Patient Cards

Each patient card displays:

- Patient Name
- Age / Gender
- Care Setting
- Hospital Day
- Current Clinical Status
- Patient Intelligence Status
- Current Alerts (if any)

Tapping a patient opens the Patient Intelligence page.

---

# Register Patient

Purpose

Register a patient in less than one minute.

Display

- Patient Name
- Age
- Gender
- Mobile Number (Optional)
- Hospital ID
- Care Setting
- Chief Complaint

Primary Action

Continue to Patient Intelligence.

---

# Patient Intelligence

Patient Intelligence is the primary clinical workspace.

It is the first page displayed whenever a patient record is opened.

This page answers:

- Who is this patient?
- What is happening now?
- What has happened?
- What should happen next?

---

## Patient Header

Displays

- Patient Name
- Age / Gender
- Hospital ID
- Current Care Setting
- Ward / Bed
- Hospital Day
- Current Status

---

## Patient Intelligence Card

Always displayed first.

Displays:

- AI Clinical Summary
- Current Clinical Status
- Clinical Priorities
- Suggested Next Actions
- Clinical Intelligence Score

Primary Action

**View Full Patient Intelligence Summary**

---

## Quick Clinical Snapshot

Displays

❤️ Current Vitals

💊 Active Medications

📊 Intake / Output

📅 Today's Tasks

⚠ Clinical Alerts (only when present)

---

## Clinical Modules

The remaining patient information is accessed through dedicated cards.

Displays:

- 📝 Medical Notes
- 👨‍⚕️ Consultant Notes
- 👩‍⚕️ Nursing Notes
- 🌐 Virtual Specialist Notes
- 🧪 Investigations
- 💊 Medications
- 💉 Medication Administration
- 📊 Intake / Output
- 📄 Clinical Documents
- ⚕ Procedures
- 🕒 Patient Timeline

Each card opens its own dedicated page.

---

## Primary Actions

- Add Medical Note
- Add Nursing Note
- Update Vitals
- Record Intake / Output
- Record Medication Administration
- Order Investigation
- Prescribe Medication
- Upload Clinical Document
- Request Klinimate Support
- Discharge Patient

---

# Patient Timeline

The Timeline displays every clinical event in chronological order.

Examples:

- Medical Notes
- Nursing Notes
- Consultant Notes
- Virtual Specialist Notes
- Vitals
- Investigations
- Medication Administration
- Procedures
- AI Updates
- Transfers
- Discharge

Latest events appear first.

---

# Klinimate

The Klinimate page connects healthcare organizations with the Klinimate Virtual Specialist Network.

Display:

- 📞 Request Klinimate Support
- 📋 Active Requests
- 💻 Virtual Consultations
- 📄 Specialist Advice
- 📜 Consultation History

Support Contact

**+91 77100 82611**

The call begins as a standard voice call and may be converted into a video consultation when required.

---

# Organization

Visible only to Organization Administrators.

Displays:

- Organization Information
- User Management
- Departments
- Subscription
- Reports
- Settings

Doctors, Nurses, and Consultants access their personal profile from the top-right profile menu instead of the Organization page.

---

# User Profile

Each user selects their profile after login.

Examples:

- Doctor
- Nurse
- Consultant

The selected profile remains active throughout the session.

The system automatically records the active user for:

- Clinical Notes
- Nursing Notes
- Consultant Notes
- Vitals
- Intake / Output
- Medication Administration

Users do not repeatedly select their name while documenting.

---

# Visual Design

Background

White

Brand Colour

Klinimate Blue

Action Colour

Klinimate Teal

Clinical Status

🟢 Stable

🟡 Needs Review

🟠 Urgent

🔴 Critical

⚫ Deceased

Clinical colours are reserved exclusively for patient status.

---

# User Experience Goals

Every healthcare professional should be able to:

- Register a patient
- Understand the patient's condition within one minute
- Update documentation
- Review Patient Intelligence
- Request Klinimate Support
- Complete routine documentation

without formal training.

---

# Design Principles

- Patient Intelligence First
- Mobile-first
- One Patient • One Clinical Record • One Timeline
- Click More • Type Less
- Search • Select • Save
- AI Assists • Clinicians Decide
- Minimal Typing
- Minimal Scrolling
- One Primary Action per Screen
- Consistent Navigation
- Fast and Intuitive

---

# Guiding Principle

Every Klinimate screen should immediately answer:

- Who is this patient?
- What is the patient's current clinical status?
- What should happen next?

Patient Intelligence is the primary clinical workspace within the Klinimate Platform.

Every other screen exists to support or enrich Patient Intelligence, enabling healthcare professionals to deliver faster, safer, and more coordinated patient care.
