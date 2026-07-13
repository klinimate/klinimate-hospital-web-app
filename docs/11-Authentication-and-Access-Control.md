# Authentication & Access Control

Version: 2.0

Status: Active

Owner: Dr. Avdhut Kulkarni (Founder & Director)

---

# Purpose

This document defines the authentication, authorization, user roles, and access control model for the Klinimate Platform.

The authentication system is designed to be secure, simple, mobile-first, and optimized for rapid clinical workflows.

---

# Authentication Philosophy

Authentication should never become a barrier to patient care.

Klinimate provides:

- One secure login
- Role-based access
- Organization-based data isolation
- Minimal user interaction
- Complete auditability

Users should access the platform within seconds.

---

# Login Workflow

User Login

↓

Authentication

↓

Organization Identified

↓

Role Identified

↓

Workspace Opened

↓

User Profile Selected (if applicable)

↓

Clinical Work Begins

---

# Healthcare Organization Login

Healthcare organizations use shared functional accounts.

Examples:

- doctor@hospital
- nurse@hospital
- consultant@hospital
- admin@hospital

After login, the user selects their profile.

Examples:

- Dr. Suresh
- Dr. Shah
- Nurse Priya
- Nurse Neha

The selected profile is automatically applied to every action during that session.

The user may change profiles at any time.

---

# Klinimate Users

Klinimate team members use individual accounts.

Examples:

- Care Coordinators
- Intensivists
- Virtual Specialists
- Command Centre Team
- Platform Administrators

Each user receives role-based access.

---

# Workspaces

## 1. Healthcare Organization Workspace

Accessible by:

- Doctors
- Nurses
- Consultants
- Organization Administrators

Functions:

- Register Patients
- Search Patients
- Patient Dashboard
- Patient Timeline
- Medical Notes
- Nursing Notes
- Vitals
- Intake & Output
- Medications
- Medication Administration
- Investigations
- Clinical Documents
- Patient Intelligence
- Request Klinimate Support
- Transfer Patient
- Discharge Patient

---

## 2. Klinimate Care Coordinator Workspace

Responsibilities:

- Receive support requests
- Review Patient Intelligence
- Coordinate communication
- Assign specialists
- Track consultations
- Monitor follow-up

Access:

Assigned healthcare organizations only.

---

## 3. Klinimate Intensivist Workspace

Responsibilities:

- Review assigned critical patients
- Provide ICU recommendations
- Conduct virtual rounds
- Monitor follow-up

Access:

Assigned organizations and assigned patients only.

---

## 4. Klinimate Specialist Workspace

Responsibilities:

- Review Patient Intelligence
- Review clinical records
- Conduct virtual consultations
- Add specialist recommendations
- Recommend medication changes
- Recommend investigations
- Plan follow-up

Access:

Assigned consultations only.

---

## 5. Klinimate Command Centre

Responsibilities:

- Monitor connected organizations
- Monitor active consultations
- View AI alerts
- Monitor specialist availability
- Coordinate escalations
- Review operational analytics

Clinical editing is restricted.

---

## 6. Klinimate Administrator Workspace

Responsibilities:

- Organization Management
- User Management
- Subscription Management
- Billing
- Permissions
- Audit Logs
- Platform Configuration
- System Monitoring

No routine clinical documentation.

---

# Permission Model

Every user sees only the information required for their role.

## Healthcare Organization

Access:

Own organization's patients only.

---

## Care Coordinator

Access:

Assigned organizations.

---

## Intensivist

Access:

Assigned organizations.

Assigned patients.

---

## Virtual Specialist

Access:

Assigned consultations only.

---

## Command Centre

Access:

Operational monitoring.

No routine clinical documentation.

---

## Administrator

Access:

Platform administration.

No routine patient care.

---

# Clinical Documentation Permissions

## Doctors

May:

- Register patients
- Add Medical Notes
- Update Vitals
- Update Intake & Output
- Prescribe Medications
- Record Medication Administration
- Order Investigations
- Upload Clinical Documents
- Request Klinimate Support
- Finalize Patient Intelligence

---

## Nurses

May:

- Update Vitals
- Update Intake & Output
- Record Medication Administration
- Add Nursing Notes
- Upload Clinical Documents

---

## Consultants

May:

- Add Consultant Notes
- Review Patient Intelligence
- Finalize clinical plans

---

## Virtual Specialists

May:

- Add Specialist Notes
- Recommend investigations
- Recommend medication changes
- Recommend procedures
- Recommend follow-up

---

# Editing Rules

Clinical entries remain editable for **10 minutes**.

After 10 minutes:

- Entries become read-only.
- New information is recorded as a new timeline event.
- Complete audit history is preserved.

---

# Security Principles

Klinimate follows:

- Role-Based Access Control (RBAC)
- Organization Data Isolation
- Encryption in Transit
- Encryption at Rest
- Complete Audit Trail
- Secure Session Management

Every clinical action records:

- Organization
- User Account
- User Profile
- Date & Time
- Device
- Action

Patient privacy is protected by design.

---

# Future Enhancements

Future versions may include:

- Two-Factor Authentication (2FA)
- Biometric Authentication
- Single Sign-On (SSO)
- Passkeys
- Device Management
- Session Management
- Emergency "Break Glass" Access
- Enterprise Role Customization

---

# Design Principles

- One Login
- One Platform
- Role-Based Access
- Organization-Based Security
- Mobile-first
- Secure by Default
- Minimal User Interaction
- Fully Auditable

---

# Guiding Principle

Authentication should enable—not delay—patient care.

Every user should securely access the right workspace, the right patients, and the right clinical information at the right time while preserving patient privacy, clinical accountability, and the integrity of the Klinimate Platform.
