# 22 – Patient Timeline

**Version:** 2.0  
**Status:** Active  
**Owner:** Dr. Avdhut Kulkarni (Founder & Director)

---

# Purpose

The Patient Timeline is the permanent chronological clinical record of every patient managed within the Klinimate Platform.

It serves as the **single source of truth** for the patient's clinical journey, ensuring that every healthcare professional works from one unified, continuously updated timeline.

Every clinical event, assessment, investigation, treatment, consultation, nursing activity, and AI-generated insight is permanently recorded regardless of the care setting.

---

# Clinical Philosophy

```
One Patient
        ↓
One Clinical Record
        ↓
One Timeline
```

Every authorized healthcare professional works from the same patient timeline.

There are:

- No duplicate records
- No fragmented documentation
- No separate timelines for different departments

---

# Timeline Coverage

The Patient Timeline supports every healthcare setting:

- OPD
- Emergency
- IPD
- ICU
- Rehabilitation
- Home Care
- Nursing Home
- Day Care
- Clinics & Polyclinics
- Virtual Consultation

The patient's history remains continuous across every episode of care.

---

# Timeline Structure

Every timeline entry records:

- Date & Time
- Event Type
- Summary
- Author
- User Role
- Organization
- Care Setting
- Visit Type (In-person / Virtual)
- Attachments (if available)

Timeline entries are displayed in reverse chronological order, with the most recent event at the top.

---

# Timeline Events

The timeline automatically records every significant clinical event.

## Patient Registration

- Registration
- Patient Demographics
- Hospital / Organization
- Care Setting
- Registration Details

---

## Clinical Assessment

- Chief Complaint
- History
- Examination
- Working Diagnosis
- Clinical Severity
- Pain Score
- Glasgow Coma Scale (when applicable)

---

## Vital Signs

Every vitals update records:

- Blood Pressure
- Pulse
- Respiratory Rate
- Temperature
- Oxygen Saturation (SpO₂)
- Blood Sugar
- Glasgow Coma Scale
- Weight
- Pain Score

Each entry includes:

- Recorded By
- Date & Time

Trend indicators highlight important changes over time.

---

## Intake / Output

Every intake and output update records:

### Intake

- Oral Intake
- IV Fluids
- Blood Products
- Enteral Feeding
- Parenteral Nutrition

### Output

- Urine Output
- Drain Output
- NG Aspirate
- Stool
- Vomiting
- Other Losses

Each update records:

- Quantity
- Time
- Recorded By

Graphical trends are available for ICU and critical care patients.

---

## Clinical Notes

Clinical documentation is separated by author type.

### Hospital Doctor Notes

Recorded by:

- RMOs
- Medical Officers

---

### Consultant Notes

Recorded during:

- In-person Consultant Reviews

---

### Klinimate Specialist Notes

Recorded during:

- Virtual Specialist Consultations

---

### Nursing Notes

Recorded by nursing staff.

Examples:

- Patient observations
- Nursing interventions
- Clinical progress
- Escalation notes

Each note records:

- Author
- Role
- Visit Type
- Date & Time
- Clinical Note
- Attached Documents (optional)

Notes remain editable for **10 minutes** before becoming permanently locked.

Future changes create new timeline entries without modifying previous documentation.

---

## Diagnosis

Records:

- Working Diagnosis
- Final Diagnosis
- Diagnosis Updates

Each diagnosis includes:

- Entered By
- Date & Time

---

## Investigations

Every investigation records:

- Ordered
- Sample Collected
- Result Available
- Result Reviewed

Reports remain permanently attached to the timeline.

---

## Medications

Medication orders record:

- Drug Name
- Dose
- Route
- Frequency
- Duration
- Prescribing Clinician

Medication events include:

- Started
- Modified
- Stopped
- Completed

---

## Medication Administration

Medication administration is recorded separately from prescribing.

Each administration records:

- Medication
- Dose Given
- Administration Time
- Administered By
- Route
- Status

Examples:

- Given
- Delayed
- Missed
- Withheld

This creates a complete Medication Administration Record (MAR).

---

## Procedures

Examples include:

- Intubation
- Central Venous Catheter
- Arterial Line
- Chest Drain
- Mechanical Ventilation
- Dialysis
- Surgery
- Wound Procedure
- Bedside Procedures

Each procedure records:

- Procedure
- Performed By
- Date & Time
- Outcome

---

## Clinical Documents

Supported uploads include:

- Laboratory Reports
- ECG
- Chest X-ray
- CT Reports
- MRI Reports
- Referral Letters
- Previous Prescriptions
- Discharge Summaries
- Handwritten Notes
- Clinical Photographs

Klinimate Intelligence automatically analyses supported documents and updates patient intelligence when appropriate.

---

## Klinimate Intelligence

Every AI update is recorded.

Examples include:

- AI Clinical Summary
- Clinical Risk Assessment
- Clinical Priorities
- Suggested Differential Diagnoses
- Suggested Investigations
- Treatment Considerations
- Clinical Intelligence Score
- Clinical Alerts

Each update reflects the latest available clinical information.

AI recommendations remain advisory.

---

## Virtual Consultation

Every consultation records:

- Consultation Requested
- Care Coordinator Assigned
- Specialist Assigned
- Consultation Started
- Voice / Video Consultation
- Specialist Advice
- Prescription (where applicable)
- Follow-up Plan
- Consultation Completed

---

## Transfers

Records include:

- Ward Transfer
- ICU Admission
- ICU Discharge
- Referral to Another Hospital
- Home Care Enrollment
- Rehabilitation Admission

---

## Outcome

The episode of care concludes with:

- Discharged
- Referred
- Transferred
- Home Care
- Left Against Medical Advice (LAMA)
- Death

After discharge:

- Patient Intelligence Summary is finalized.
- Discharge Summary is generated.
- Patient visit closes automatically after **24 hours**.
- Closed visits may be reopened only by an Organization Administrator when clinically or administratively required.

---

# Smart Filters

Users can filter the timeline by:

- All Events
- Clinical Assessments
- Doctor Notes
- Consultant Notes
- Nursing Notes
- Vitals
- Intake / Output
- Investigations
- Medications
- Medication Administration
- Clinical Documents
- AI Updates
- Consultations
- Procedures

---

# Smart Search

The timeline supports searching by:

- Diagnosis
- Medication
- Investigation
- Procedure
- Clinician
- Date
- Clinical Notes
- Document Name

---

# Permissions

Timeline visibility follows role-based access control.

### Hospital Users

- Full access to their organization's patients

### Klinimate Care Coordinator

- Assigned organizations only

### Klinimate Specialists

- Assigned consultations only

### Klinimate Intensivists

- Assigned critical patients

### Organization Administrator

- Organization-wide access

Every action records:

- User
- Role
- Organization
- Date & Time

---

# Audit & Security

Every timeline event permanently records:

- User Identity
- User Role
- Organization
- Device Information
- Date & Time
- Audit Reference

Clinical records:

- Cannot be deleted
- Cannot be overwritten
- Cannot be silently modified

Locked entries remain immutable.

Corrections are recorded as new timeline entries.

---

# Future Enhancements

Future versions may include:

- Voice-to-Text Timeline Entries
- AI-generated Daily Clinical Summary
- Timeline Heat Maps
- Timeline Comparison Views
- AI-generated Referral Letters
- AI-generated Clinical Handovers
- Timeline Export (PDF)
- Timeline Analytics
- Remote Patient Monitoring Timeline
- Wearable Device Integration

---

# Design Principles

- One Patient • One Clinical Record • One Timeline
- Click More • Type Less
- Search • Select • Save
- Mobile-first
- Chronological by Default
- Fast and Searchable
- Fully Auditable
- AI Assists • Clinicians Decide

---

# Guiding Principle

The Patient Timeline is the permanent clinical memory of the patient.

Every interaction performed by hospital doctors, consultants, nurses, Klinimate Care Coordinators, specialists, and Klinimate Intelligence becomes part of one unified, chronological clinical record.

This shared timeline enables safe, coordinated, transparent, and continuous patient care across every healthcare setting.










t care across every healthcare setting.
