# Klinimate UI / UX Design

Version: 2.0

Status: Active

Owner: Dr. Avdhut Kulkarni (Founder & Director)

---

# Purpose

This document defines the official User Interface (UI) and User Experience (UX) standards for the Klinimate Platform.

Every screen within Klinimate must be simple, intuitive, mobile-first, and designed to reduce documentation burden while improving clinical decision-making.

---

# Design Philosophy

Klinimate is an AI-Powered Clinical Intelligence Platform.

The interface should feel as simple as WhatsApp while providing intelligent clinical insights.

Clinicians should spend more time caring for patients and less time documenting.

Patient Intelligence should always be the first clinical information presented.

---

# Core Design Principles

- Mobile-first
- AI-first
- Clinician-first
- White background
- Minimal branding
- Large touch-friendly controls
- Click More • Type Less
- Search • Select • Save
- Maximum three taps to any primary action
- Minimal scrolling
- Fast loading
- One primary action per screen
- Consistent experience across mobile, tablet, and desktop

---

# Navigation Philosophy

Level 1 represents platform navigation.

Level 2 represents patient-specific navigation.

---

## Level 1 – Platform Navigation

Clinical users

- 🏥 Patients
- ➕ Register
- 🧠 Klinimate

Administrator

- 🏥 Patients
- ➕ Register
- 🧠 Klinimate
- ⚙️ Organization

Navigation remains consistent across all clinical users.

Permissions determine available actions.

---

## Level 2 – Patient Navigation

Once a patient is opened, navigation becomes patient-specific.

Examples:

- Patient Dashboard
- Patient Intelligence
- Patient Timeline
- Investigation Details
- Medication Details
- Clinical Documents

These pages open with a simple **Back** button and do not display the bottom navigation.

---

# Screen 1 – Login

Purpose

Secure platform access.

Display

- Klinimate Logo
- Email / Mobile Number
- Password
- Sign In
- Forgot Password

After login, the user selects their profile for the current session.

Examples:

- Dr. Suresh
- Nurse Priya
- Dr. Shah

The selected profile is automatically used for all documentation until changed.

---

# Screen 2 – Patients

Purpose

Primary landing page after login.

Display

- Search Patient
- Register New Patient
- Ward
- ICU
- Emergency
- OPD
- Rehabilitation
- Home Care

Each patient card displays:

- Patient Name
- Age / Gender
- Care Setting
- Bed Number
- Primary Diagnosis
- Clinical Status
- Last Updated

AI alerts appear directly on the patient card.

Examples:

- Clinical Deterioration
- Investigation Available
- Specialist Advice Available
- Follow-up Required

One tap opens the Patient Dashboard.

---

# Screen 3 – Register Patient

Purpose

Fast patient registration.

Collect

- Patient Name
- Age
- Gender
- Mobile Number (Optional)
- UHID / Hospital ID
- Care Setting
- Chief Complaint

Target registration time:

Less than 60 seconds.

---

# Screen 4 – Patient Dashboard

Purpose

The primary clinical workspace throughout the patient's episode of care.

---

## Patient Header

Displays

- Patient Name
- Age / Gender
- UHID
- Care Setting
- Bed Number
- Hospital Day
- Clinical Status

---

## 🧠 Patient Intelligence

Always displayed as the first clinical card.

Displays

- Primary Diagnosis
- Current Clinical Status
- AI Clinical Summary
- Clinical Priorities
- Suggested Next Steps

Quick Statistics

- Hospital Stay
- Investigations
- Medications
- Procedures
- Hospital Reviews
- Virtual Specialist Reviews

Tap the card to open the full Patient Intelligence page.

---

## ❤️ Vitals

Displays current vital signs.

Primary Action

Update Vitals

Accessible by:

- Doctors
- Nurses

---

## 💧 Intake & Output

Displays current fluid balance.

Primary Action

Update Intake & Output

Accessible by:

- Doctors
- Nurses

---

## 💊 Medication Administration

Displays scheduled medications and administration status.

Primary Action

Record Medication Administration

Accessible by:

- Doctors
- Nurses

---

## 🩺 Medical Notes

Used by:

- RMOs
- Medical Officers
- Hospital Consultants
- Klinimate Virtual Specialists

Supports:

- Type Notes
- Handwritten Notes (Tablet)
- Upload Clinical Documents

---

## 👩‍⚕️ Nursing Notes

Used by nursing staff.

Supports:

- Structured Nursing Notes
- Free Text
- Clinical Observations

---

## 🧪 Investigations

Displays:

- Ordered
- Pending
- Completed

Smart searchable investigation library.

Manual entry always available.

---

## 💊 Medications

Displays:

- Current Medications
- Medication History

Smart searchable medication library.

---

## ⚕️ Procedures

Displays all procedures performed during the current episode.

---

## 📎 Clinical Documents

Supports:

- Laboratory Reports
- ECG
- Chest X-ray
- CT
- MRI
- Referral Letters
- Previous Prescriptions
- Clinical Photographs
- Handwritten Notes
- Other Clinical Documents

---

## 📅 Patient Timeline

Displays every clinical activity chronologically.

Examples:

- Registration
- Medical Notes
- Nursing Notes
- Vitals
- Intake & Output
- Medication Administration
- Investigation Results
- Procedures
- Clinical Documents
- Patient Intelligence Updates
- Consultant Reviews
- Virtual Specialist Reviews

---

# Screen 5 – Patient Intelligence

Purpose

Provide a comprehensive clinical overview of the patient's entire episode of care.

Displays

- Clinical Summary
- Current Clinical Status
- Clinical Priorities
- Investigation Summary
- Medication Summary
- Procedure Summary
- Hospital Consultant Reviews
- Virtual Specialist Reviews
- Timeline Summary
- Follow-up Plan
- Clinical Outcome (after discharge)

The treating clinician may review, edit, and finalize the Patient Intelligence Summary before discharge.

This page opens independently and does not display bottom navigation.

---

# Screen 6 – Klinimate

Purpose

Provide access to Klinimate Clinical Intelligence services.

Displays

- ☎️ Request Klinimate Support
- 📋 Active Requests
- 💻 Virtual Consultations
- 📄 Specialist Advice
- 👩‍⚕️ Care Coordinator

Support Number

**+91 77100 82611**

The consultation begins as a phone call and may be upgraded to a video consultation when clinically required.

---

# Screen 7 – Organization

Administrator only.

Displays

- Organization Profile
- Doctors
- Nurses
- Consultants
- Departments
- Wards & Beds
- Permissions
- Subscription
- Billing
- Reports

---

# Color Philosophy

Primary Brand

Navy Blue

Interactive Actions

Teal

Clinical Status

- Green – Stable
- Yellow – Needs Review
- Red – Critical
- Black – Deceased

Clinical colours must never be used for branding.

---

# Typography

Use modern system fonts.

Preferred:

- Inter
- SF Pro
- System Font

High contrast.

Large touch targets.

Optimized for prolonged clinical use.

---

# User Experience Goals

A first-time clinician should be able to:

- Register a patient
- Review Patient Intelligence
- Update Vitals
- Record Intake & Output
- Record Medication Administration
- Add Medical Notes
- Add Nursing Notes
- Order Investigations
- Prescribe Medications
- Request Klinimate Support

without formal training.

---

# Guiding Principle

Every screen should immediately answer three questions:

- Who is this patient?
- What is happening now?
- What should happen next?

Patient Intelligence should always be presented before detailed clinical information, enabling healthcare professionals to make faster, safer, and better-informed decisions while minimizing documentation burden.
