# Authentication and Roles

Version: 1.0

Status: Active

## Philosophy

Klinimate should have the simplest possible authentication system.

Users should never be confused by multiple login pages.

One login.

One password.

Role-based dashboard.

---

## Login Flow

User enters

- Email or Mobile Number
- Password

↓

Klinimate identifies the user's role.

↓

Automatically opens the appropriate dashboard.

---

## User Roles

### 1. Hospital Medical Officer

Used by

- Resident Medical Officer (RMO)
- Medical Officer
- Nurses (where permitted)
- Hospital Administrator (where required)

Responsibilities

- Register Patient
- Admission Workflow
- Daily Progress Round
- Update Vitals
- Add Investigations
- Add Medications
- Escalate Patient
- View Klinimate AI Clinical Assessment
- Notify Klinimate Intensivist

---

### 2. Klinimate Intensivist

Responsibilities

- Klinimate Command Centre
- Review Yellow & Red Patients
- View AI Clinical Assessment
- Add Consultant Recommendations
- Monitor Multiple Hospitals
- Conduct Remote ICU Support
- Close Alerts

---

### 3. Klinimate Admin

Responsibilities

- Hospital Management
- User Management
- Subscription Management
- Assign Intensivists
- Analytics
- Audit Logs
- Platform Settings
- System Monitoring

---

## Security Principles

- One account per authorized user.
- Role determines dashboard access.
- Users cannot access dashboards outside their assigned role.
- All clinical actions should be recorded with timestamps and user identity.

---

## Future Scope

- Two-Factor Authentication
- Biometric Login
- Single Sign-On (SSO)
- Hospital Identity Provider Integration
- Session Management
