# Klinimate Clinical Design System

Version: 1.0
Status: Active
Owner: Dr. Avdhut Kulkarni (Founder & Director)

---

# Purpose

This document defines the official clinical standards of the Klinimate Platform.

It serves as the single source of truth for:

• Clinical workflows
• AI Clinical Decision Support (CDSS)
• Triage
• Escalation
• Monitoring
• Clinical alerts
• Patient prioritisation
• Clinical documentation

Every module within the Klinimate ecosystem must follow this document.

---

# Clinical Philosophy

Klinimate is designed to assist clinicians—not replace them.

The platform should:

• Detect deterioration early.
• Standardise patient assessment.
• Reduce missed warning signs.
• Improve documentation.
• Support faster clinical decision-making.
• Escalate high-risk patients immediately.
• Keep clinicians in control.

Final clinical responsibility always remains with the treating medical team.

---

# Clinical Workflow

Every admitted patient follows the same workflow.

Patient Registration

↓

Admission

↓

Initial Assessment

↓

Vital Signs

↓

AI Clinical Analysis

↓

Klinimate Clinical Triage

↓

Management Plan

↓

Escalation (if required)

↓

Daily Progress Rounds

↓

Discharge / Referral / Death

---

# Klinimate Clinical Triage

The platform classifies every patient into one of four categories.

## GREEN

Meaning

Stable Patient

Examples

• Mild viral illness
• Stable diabetes
• Stable hypertension
• Minor infections
• Stable post-treatment patient

Typical Findings

Normal observations.

No immediate deterioration.

Actions

• Continue routine care.
• Routine monitoring.
• Repeat observations as scheduled.
• Notify Klinimate Intensivist if clinician requires expert opinion.

---

## YELLOW

Meaning

Urgent

Examples

• Mild to moderate chest pain
• Mild to moderate chest discomfort
• Mild respiratory distress
• Mild to moderate abdominal pain
• Tachycardia (90–120/min)
• Hypotension (systolic around 90 mmHg)
• Hypoxia (SpO₂ below 94%)

Actions

• Start oxygen.
• Apply chest leads and connect monitor.
• Obtain a 12-lead ECG.
• Call Klinimate Intensivist immediately.
• Begin recommended investigations.
• Repeat vital signs frequently.
• Monitor closely for deterioration.

---

## RED

Meaning

Emergency

Examples

• Severe chest pain with ECG changes
• Acute shortness of breath
• Severe abdominal pain
• Acute gastrointestinal bleeding
• Bluish discoloration of skin
• Persistent tachycardia (>120/min)
• Persistent hypotension (systolic <90 mmHg)
• Hypoxia (SpO₂ <90%)

Actions

• Call Klinimate Intensivist immediately.
• Start oxygen immediately.
• Apply chest leads and connect monitor.
• Obtain a 12-lead ECG.
• Establish IV access.
• Begin emergency investigations.
• Repeat vital signs continuously.
• Prepare for ICU transfer if required.

---

## BLACK

Meaning

Black Category

Examples

• Cardiac arrest
• Respiratory arrest
• No signs of life
• Death confirmed by treating clinician

Actions

• Call Klinimate Intensivist immediately.
• Initiate CPR if appropriate.
• Follow hospital resuscitation policy.
• Document events.
• Notify relatives as per hospital protocol.
• Complete medicolegal documentation where applicable.

---

# AI Clinical Decision Support

AI analyses:

• Presenting complaint
• Vital signs
• Medical history
• Examination findings
• Laboratory results
• ECG
• Imaging
• Clinical progression

AI generates:

• Clinical Summary
• Triage Category
• Risk Factors
• Differential Diagnoses
• Recommended Investigations
• Suggested Management
• Escalation Advice

AI recommendations are advisory only.

---

# Escalation Principles

Escalation depends on:

• Triage category
• Vital sign abnormalities
• Clinical deterioration
• Abnormal investigations
• Doctor request

GREEN

Optional notification.

YELLOW

Immediate Intensivist review recommended.

RED

Immediate Intensivist involvement required.

BLACK

Immediate emergency response.

---

# Vital Sign Monitoring

Monitor:

• Heart rate
• Blood pressure
• Respiratory rate
• Oxygen saturation
• Temperature
• Blood glucose
• Consciousness (GCS/AVPU where applicable)

Abnormal trends should trigger reassessment.

---

# Documentation Principles

Documentation should be:

• Structured
• Simple
• Time stamped
• Mobile friendly
• Clinically relevant

Avoid unnecessary typing.

Use selectable options wherever possible.

Allow free-text notes when needed.

---

# Clinical Alerts

Alerts should be:

High Priority

• RED
• BLACK

Medium Priority

• YELLOW

Low Priority

• GREEN notifications

Alert fatigue should be minimised.

---

# Clinical Safety Principles

Never rely on AI alone.

Critical deterioration should always generate visible alerts.

Every recommendation should remain editable by clinicians.

Clinical judgement always overrides AI recommendations.

---

# Design Principles

Clinical screens should prioritise:

1. Patient identity
2. Triage status
3. Vital signs
4. Presenting complaint
5. AI Clinical Summary
6. Recommended actions
7. Intensivist advice
8. Daily progress

Emergency information should always appear above routine information.

---

# Future Expansion

This design system will later include:

• ICU-specific workflows
• Obstetric pathways
• Paediatric pathways
• Sepsis pathway
• Stroke pathway
• Acute Coronary Syndrome pathway
• Trauma pathway
• Remote monitoring
• Wearable device integration
• Predictive deterioration models

---

# Clinical Design Rule

Every future Klinimate feature, workflow, AI model, dashboard, and clinical recommendation must follow this Clinical Design System.

No module should introduce alternative clinical workflows without approval from the Founder.

This document is the official clinical standard for the Klinimate ecosystem.
