Klinimate Hospital Platform – Database Design

Overview

The Klinimate database is designed to support AI-assisted clinical workflows, hospital operations, consultant collaboration, and auditability while remaining scalable for future expansion.

---

Core Database Tables

1. Hospitals

Stores partner hospital information.

Fields

- Hospital ID
- Hospital Name
- Hospital Type
- Address
- City
- State
- Country
- Contact Person
- Contact Number
- Email
- Subscription Plan
- Subscription Status
- Created Date
- Status

---

2. Users

Stores all platform users.

Fields

- User ID
- Full Name
- Email
- Mobile Number
- Password (Encrypted)
- Role
- Hospital ID
- Department
- Status
- Last Login
- Created Date

Roles

- Hospital Medical Officer
- Klinimate Care Coordinator
- Klinimate Consultant
- Hospital Administrator
- Klinimate Administrator

---

3. Patients

Stores basic patient information.

Fields

- Patient ID
- Hospital ID
- Hospital Patient ID
- Patient Name
- Age
- Gender
- Date of Admission
- Primary Diagnosis
- Current Status

---

4. Clinical Cases

Every consultation generates one Clinical Case.

Fields

- Case ID
- Patient ID
- Hospital ID
- Created By
- Chief Complaint
- Presenting History
- Clinical Findings
- Working Diagnosis
- Case Priority
- Current Workflow Status
- Created Date
- Last Updated

Workflow Status

- New
- AI Assessment
- Awaiting KCC Review
- Awaiting Consultant Review
- Advice Sent
- Follow-up
- Closed

---

5. Vitals

Stores structured vital signs.

Fields

- Vital ID
- Case ID
- Blood Pressure
- Pulse
- Respiratory Rate
- SpO₂
- Temperature
- GCS
- Urine Output
- Oxygen Device
- FiO₂
- Timestamp

---

6. AI Clinical Assessment

Stores AI-generated outputs.

Fields

- AI Assessment ID
- Case ID
- Clinical Summary
- Severity
- Clinical Priorities
- Red Flags
- Suggested Investigations
- Suggested Management Priorities
- AI Confidence
- Escalation Recommendation
- Generated Date

---

7. Consultant Review

Stores specialist recommendations.

Fields

- Review ID
- Case ID
- Consultant ID
- Consultant Specialty
- Clinical Recommendation
- Follow-up Advice
- Transfer Recommendation
- Case Status
- Review Date

---

8. Attachments

Stores uploaded clinical files.

Examples

- CBC
- ABG
- ECG
- Chest X-ray
- CT Scan
- MRI
- Photographs

Fields

- Attachment ID
- Case ID
- File Type
- File Name
- Uploaded By
- Uploaded Date

---

9. Notifications

Stores system notifications.

Examples

- New Case
- AI Completed
- Consultant Assigned
- Advice Available
- Follow-up Requested

Fields

- Notification ID
- User ID
- Title
- Message
- Read Status
- Created Date

---

10. Audit Trail

Every action is logged.

Fields

- Audit ID
- User ID
- Case ID
- Action
- Timestamp
- Device
- IP Address

---

Future Database Modules

These modules will be added after MVP validation.

- Hospital Analytics
- AI Learning Dataset
- Clinical Protocol Library
- Hospital Quality Indicators
- Specialist Scheduling
- Video Consultation
- Remote Patient Monitoring
- Billing & Subscription
- Hospital Performance Dashboard

---

Database Design Principles

- Secure by default.
- Fully auditable.
- Mobile optimized.
- AI-ready.
- Scalable to thousands of hospitals.
- Modular architecture.
- Standards-based.
- Fast retrieval of clinical information.
