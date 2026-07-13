# Klinimate Database Design

Version: 2.0

Status: Active

Owner: Dr. Avdhut Kulkarni (Founder & Director)

---

# Purpose

This document defines the official database architecture of the Klinimate Platform.

The database is designed to support the complete patient journey across every healthcare setting while enabling AI-powered Clinical Intelligence, virtual specialist collaboration, structured documentation, and longitudinal patient records.

The architecture is cloud-native, multi-tenant, scalable, secure, and optimized for mobile-first clinical workflows.

---

# Database Philosophy

The Klinimate database is designed around five core principles:

- One Patient
- Multiple Episodes of Care
- One Clinical Record
- One Timeline
- One Patient Intelligence

Every clinical interaction contributes to a structured, searchable, and auditable patient record.

---

# Core Database Modules

## 1. Organizations

Stores all healthcare organizations using Klinimate.

Supported organizations include:

- Hospitals
- Health Systems
- Rural Hospitals
- Clinics & Polyclinics
- Nursing Homes
- Rehabilitation Centres
- Home Care Providers
- Day Care Centres
- Advanced Elder Care Facilities

### Fields

- Organization ID
- Organization Name
- Organization Type
- Address
- City
- State
- Country
- Contact Person
- Contact Number
- Email
- Subscription Plan
- Subscription Status
- Organization Status
- Created Date

---

## 2. User Accounts

Stores organization login accounts.

Examples:

- doctor@hospital
- nurse@hospital
- consultant@hospital
- admin@hospital

### Fields

- User Account ID
- Organization ID
- Login ID
- Encrypted Password
- Role
- Status
- Last Login
- Created Date

---

## 3. User Profiles

Stores selectable healthcare professionals within each organization.

Examples:

- Dr. Suresh
- Dr. Shah
- Nurse Priya
- Nurse Neha

### Fields

- Profile ID
- Organization ID
- Full Name
- Designation
- Department
- Profile Type
- Active Status

---

## 4. Patients

Stores patient demographic information.

### Fields

- Patient ID
- Organization ID
- Organization Patient ID
- Patient Name
- Age
- Gender
- Mobile Number
- Address
- Emergency Contact
- Blood Group
- Allergies
- Registration Date

---

## 5. Episodes of Care

Each hospital visit creates one Episode of Care.

Examples:

- OPD Visit
- Emergency Visit
- Hospital Admission
- ICU Admission
- Rehabilitation
- Home Care

### Fields

- Episode ID
- Patient ID
- Organization ID
- Care Setting
- Admission Date
- Discharge Date
- Episode Status
- Created By

---

## 6. Patient Timeline

The central clinical record of Klinimate.

Every clinical activity creates one timeline event.

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
- Discharge

### Fields

- Timeline ID
- Episode ID
- Patient ID
- Organization ID
- Event Type
- Recorded By
- User Profile
- Visit Type
- Summary
- Timestamp
- Locked Status

---

## 7. Medical Notes

Used by:

- RMOs
- Medical Officers
- Hospital Consultants
- Klinimate Virtual Specialists

### Fields

- Note ID
- Episode ID
- Patient ID
- User Profile
- Visit Type
- Medical Notes
- AI Clinical Summary
- Timestamp

---

## 8. Nursing Notes

Used by nursing staff.

### Fields

- Nursing Note ID
- Episode ID
- Patient ID
- User Profile
- Nursing Notes
- Timestamp

---

## 9. Vitals

### Fields

- Vital ID
- Episode ID
- Patient ID
- Blood Pressure
- Pulse
- Respiratory Rate
- Temperature
- SpO₂
- Blood Sugar
- GCS
- Pain Score
- Weight
- Timestamp

---

## 10. Intake & Output

### Intake

- Oral Fluids
- IV Fluids
- Enteral Feeding
- Blood Products
- Other

### Output

- Urine
- Stool
- Vomitus
- Drain Output
- Chest Drain
- Dialysis Ultrafiltration
- Other

### Fields

- IO ID
- Episode ID
- Patient ID
- Entry Type
- Category
- Volume
- Recorded By
- Timestamp

---

## 11. Investigations

Stores investigation requests and results.

### Fields

- Investigation ID
- Episode ID
- Patient ID
- Investigation Name
- Category
- Status
- Result Summary
- Report Attachment
- Requested By
- Timestamp

---

## 12. Medications

Stores prescribed medications.

### Fields

- Medication ID
- Episode ID
- Patient ID
- Drug Name
- Dose
- Route
- Frequency
- Duration
- Prescribed By
- Start Date
- Stop Date

---

## 13. Medication Administration

Records medication administration.

### Fields

- Administration ID
- Episode ID
- Patient ID
- Medication ID
- Status
- Administered By
- Administration Time
- Remarks

Supported statuses:

- Administered
- Delayed
- Not Given
- Patient Refused

---

## 14. Clinical Documents

Stores uploaded clinical documents.

Examples:

- Laboratory Reports
- ECG
- Chest X-ray
- CT
- MRI
- Referral Letters
- Previous Prescriptions
- Discharge Summaries
- Clinical Photographs

### Fields

- Document ID
- Episode ID
- Patient ID
- Timeline ID
- Document Type
- File Reference
- Uploaded By
- Upload Date

---

## 15. Patient Intelligence

Stores AI-generated Patient Intelligence.

### Fields

- Intelligence ID
- Episode ID
- Patient ID
- AI Clinical Summary
- Clinical Status
- Clinical Priorities
- Suggested Differential Diagnoses
- Suggested Investigations
- Treatment Considerations
- Clinical Alerts
- Confidence Level
- Follow-up Plan
- Finalized Status
- Version
- Generated Date

---

## 16. Virtual Consultation

Stores all Klinimate specialist consultations.

### Fields

- Consultation ID
- Episode ID
- Patient ID
- Requested Specialty
- Care Coordinator
- Assigned Specialist
- Consultation Type
- Consultation Status
- Specialist Advice
- Follow-up Plan
- Consultation Date

---

## 17. Notifications

Stores organization and clinical notifications.

Examples:

- New Patient
- AI Updated
- Critical Alert
- Specialist Assigned
- Consultation Completed
- Follow-up Due

### Fields

- Notification ID
- User Account
- Title
- Message
- Priority
- Read Status
- Timestamp

---

## 18. Audit Trail

Every system activity is permanently recorded.

### Fields

- Audit ID
- Organization ID
- Episode ID
- User Account
- User Profile
- Action
- Device
- IP Address
- Timestamp

---

# Future Database Modules

- Billing & Subscription
- Insurance Support
- AI Learning Dataset
- Clinical Protocol Library
- Drug Knowledge Base
- Investigation Knowledge Base
- Device Integration
- Remote Patient Monitoring
- Laboratory Integration
- Radiology Integration
- Pharmacy Integration
- Video Consultation
- Population Health Analytics
- Predictive Clinical Intelligence

---

# Database Design Principles

- One Patient
- Multiple Episodes of Care
- One Clinical Record
- One Timeline
- One Patient Intelligence
- Multi-tenant Architecture
- Cloud-native
- AI-ready
- Mobile-first
- Click More • Type Less
- Secure by Default
- Fully Auditable
- Standards-based Interoperability (FHIR / HL7)
- Fast Clinical Data Retrieval
- Scalable to Millions of Patients

---

# Guiding Principle

The Klinimate database should securely capture every clinically relevant event once, preserve it throughout the patient's healthcare journey, and make it instantly available for Patient Intelligence, clinical care, virtual specialist collaboration, analytics, billing support, insurance support, and future AI capabilities while ensuring that healthcare organizations retain ownership of their data.
