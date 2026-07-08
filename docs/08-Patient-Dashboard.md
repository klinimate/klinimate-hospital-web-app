# Patient Dashboard

Purpose
- The Patient Dashboard is the primary clinician workspace after registration and admission. It centralises triage, AI clinical summary, vitals, investigations, medications, notes, consultant recommendations, and timeline.

Key UI Sections
- Header: patient name, age/sex, UHID, ward/room, admission time, diagnosis.
- Triage Card: large, colour-coded Klinimate Clinical Triage (no numeric scores). Shows red flags and recommended actions.
- AI Clinical Summary: concise NLP summary for quick context.
- Latest Vitals: BP, Pulse, RR, Temp, SpO₂, Blood sugar with simple trend indicators.
- Clinical Concerns: presenting complaint and flagged concerns.
- Investigations: requested tests with status and result placeholder.
- Medications: active and newly prescribed medications with dose/frequency.
- Progress Notes: chronological clinician notes.
- Consultant Recommendations: consultant guidance captured during admission or later.
- Timeline: chronological vitals snapshots and events.

Actions (MVP)
- Add Vitals — quick-entry (MVP uses prompts) and appends to vitals timeline.
- Add Clinical Note — quick note entry appended to notes.
- Order Investigation — quick order added to investigations list.
- Prescribe Medication — quick prescription added to medications.
- Notify/Refer — pushes a simulated alert to `localStorage` (key: `klinimate-alerts`).
- Discharge Patient — sets `status = 'Discharged'` and returns to patient list.

Data & Persistence (MVP)
- In-memory sample `patients` dataset is used for UI state.
- Alerts are simulated via `localStorage` (`klinimate-alerts`).
- Admission workflow autosaves to `localStorage` under `admission-{patientId}` until finalized.

Notes & Next Steps (deferred)
- Replace quick-entry prompts with mobile-friendly bottom-sheets or inline forms (deferred).
- Persist patient state to a backend or local DB (deferred).
- Replace `localStorage` alerts with server-side notifications (deferred).

Files
- `src/pages/PatientDashboard.tsx` — dashboard implementation
- `src/lib/triage.ts` — triage computation
- `src/components/ui/TriageCard.tsx` — triage UI component

Usage
- After confirming admission, the app navigates to `/patients/{patientId}/dashboard` where clinicians perform day-to-day patient tasks.
