import type { Patient } from '@/data/patients'
import {
  INVESTIGATION_MASTER as INVESTIGATION_MASTER_DATA,
  MEDICATION_MASTER as MEDICATION_MASTER_DATA,
} from '@/data/clinicalMasters'

export const MEDICATION_MASTER = MEDICATION_MASTER_DATA.map((item) => ({
  name: item.name,
  strengths: item.strengths,
  routes: item.routes,
}))

export const INVESTIGATION_MASTER = INVESTIGATION_MASTER_DATA.map((item) => item.name)

export type DurationUnit = 'Days' | 'Weeks' | 'Months'
export type MedicationStatus = 'Active' | 'Stopped'
export type InvestigationPriority = 'Routine' | 'Urgent' | 'STAT'
export type InvestigationStatus = 'Pending' | 'Completed' | 'Abnormal'

export interface WorkspaceMedication {
  id: string
  name: string
  strength: string
  route: string
  dose: string
  frequency: string
  duration: string
  durationUnit: DurationUnit
  instructions: string
  additionalInstructions: string
  status: MedicationStatus
  lastModified: string
  attachmentName?: string
  attachmentDataUrl?: string
}

export interface WorkspaceInvestigation {
  id: string
  name: string
  priority: InvestigationPriority
  status: InvestigationStatus
  clinicalIndication: string
  remarks: string
  lastUpdated: string
  attachmentName?: string
  attachmentDataUrl?: string
  aiSummary?: string
}

export interface WorkspaceNote {
  id: string
  note: string
  createdAt: string
  author: string
  attachmentName?: string
  attachmentDataUrl?: string
  drawingDataUrl?: string
  handwritingStrokes?: string
}

export interface WorkspaceVitals {
  id: string
  timestamp: string
  pulse: string
  bpSystolic: string
  bpDiastolic: string
  spo2: string
  respiratoryRate: string
  bloodSugar: string
  urineOutput: string
  temperature?: string
  weight?: string
  consciousness?: string
  painScore?: string
  attachmentName?: string
  attachmentDataUrl?: string
}

export interface WorkspaceTimelineEvent {
  id: string
  timestamp: string
  title: string
  module: 'Vitals' | 'Medical Notes' | 'Investigations' | 'Medications' | 'Consultation'
  details: string
  attachmentName?: string
  attachmentDataUrl?: string
  major: boolean
}

export interface PatientWorkspaceData {
  medications: WorkspaceMedication[]
  investigations: WorkspaceInvestigation[]
  notes: WorkspaceNote[]
  vitals: WorkspaceVitals[]
  timeline: WorkspaceTimelineEvent[]
}

const workspaceKey = (patientId: string) => `klinimate-workspace-${patientId}`

export const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

function nowLabel() {
  return new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function normalizeInvestigationStatus(status: string, result: string): InvestigationStatus {
  const s = status.toLowerCase()
  const r = result.toLowerCase()
  if (r.includes('abnormal') || r.includes('critical')) return 'Abnormal'
  if (s.includes('complete')) return 'Completed'
  return 'Pending'
}

export function createWorkspaceFromPatient(patient: Patient): PatientWorkspaceData {
  const notes = patient.notes.map((note, index) => ({
    id: `note-${index}`,
    note,
    createdAt: patient.lastUpdated,
    author: 'Dr. Ananya Sharma',
  }))

  const vitals = patient.vitalsTimeline.map((entry, index) => ({
    id: `vitals-${index}`,
    timestamp: entry.time,
    pulse: entry.pulse,
    bpSystolic: entry.bp.split('/')[0] ?? '',
    bpDiastolic: entry.bp.split('/')[1] ?? '',
    spo2: entry.spo2,
    respiratoryRate: entry.respiratoryRate,
    bloodSugar: entry.bloodSugar,
    urineOutput: patient.urineOutput ?? '—',
    temperature: entry.temperature,
    consciousness: 'AVPU: Alert',
  }))

  const medications = patient.medications.map((medication, index) => ({
    id: `med-${index}`,
    name: medication.name,
    strength: medication.dose,
    route: medication.route,
    dose: medication.dose,
    frequency: medication.frequency,
    duration: '',
    durationUnit: 'Days' as DurationUnit,
    instructions: '',
    additionalInstructions: '',
    status: 'Active' as MedicationStatus,
    lastModified: patient.lastUpdated,
  }))

  const investigations = patient.investigations.map((investigation, index) => ({
    id: `inv-${index}`,
    name: investigation.title,
    priority: 'Routine' as InvestigationPriority,
    status: normalizeInvestigationStatus(investigation.status, investigation.result),
    clinicalIndication: investigation.result,
    remarks: investigation.updated,
    lastUpdated: investigation.updated,
  }))

  const timeline: WorkspaceTimelineEvent[] = [
    ...vitals.map((item) => ({
      id: createId('timeline-vitals'),
      timestamp: item.timestamp,
      title: 'Vitals Updated',
      module: 'Vitals' as const,
      details: `BP ${item.bpSystolic}/${item.bpDiastolic} · Pulse ${item.pulse}`,
      major: true,
    })),
    ...investigations.map((item) => ({
      id: createId('timeline-investigation'),
      timestamp: item.lastUpdated,
      title: `${item.name} ${item.status === 'Pending' ? 'Ordered' : 'Updated'}`,
      module: 'Investigations' as const,
      details: `${item.priority} · ${item.status}`,
      major: true,
    })),
    ...medications.map((item) => ({
      id: createId('timeline-medication'),
      timestamp: item.lastModified,
      title: 'Medication Updated',
      module: 'Medications' as const,
      details: `${item.name} · ${item.dose}`,
      major: true,
    })),
    ...notes.map((item) => ({
      id: createId('timeline-note'),
      timestamp: item.createdAt,
      title: 'Medical Note Added',
      module: 'Medical Notes' as const,
      details: item.note,
      major: false,
    })),
  ]

  return {
    medications,
    investigations,
    notes,
    vitals,
    timeline,
  }
}

export function readWorkspace(patient: Patient): PatientWorkspaceData {
  const key = workspaceKey(patient.id)
  const raw = window.localStorage.getItem(key)

  if (!raw) {
    const initial = createWorkspaceFromPatient(patient)
    window.localStorage.setItem(key, JSON.stringify(initial))
    return initial
  }

  try {
    const parsed = JSON.parse(raw) as PatientWorkspaceData
    return parsed
  } catch {
    const fallback = createWorkspaceFromPatient(patient)
    window.localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
}

export function writeWorkspace(patientId: string, next: PatientWorkspaceData) {
  window.localStorage.setItem(workspaceKey(patientId), JSON.stringify(next))
}

export function syncPatientFromWorkspace(patient: Patient, workspace: PatientWorkspaceData) {
  const latestVitals = workspace.vitals[0]
  if (latestVitals) {
    const bp = `${latestVitals.bpSystolic}/${latestVitals.bpDiastolic}`
    patient.vitals = {
      bp,
      pulse: latestVitals.pulse,
      temperature: latestVitals.temperature || patient.vitals.temperature,
      respiratoryRate: latestVitals.respiratoryRate,
      spo2: latestVitals.spo2,
      bloodSugar: latestVitals.bloodSugar,
    }
    patient.urineOutput = latestVitals.urineOutput
    patient.vitalsTimeline = workspace.vitals.map((item) => ({
      time: item.timestamp,
      bp: `${item.bpSystolic}/${item.bpDiastolic}`,
      pulse: item.pulse,
      temperature: item.temperature || '',
      respiratoryRate: item.respiratoryRate,
      spo2: item.spo2,
      bloodSugar: item.bloodSugar,
    }))
  }

  patient.notes = workspace.notes.map((item) => item.note)
  patient.medications = workspace.medications
    .filter((item) => item.status === 'Active')
    .map((item) => ({
      name: item.name,
      dose: item.dose,
      frequency: item.frequency,
      route: item.route,
    }))
  patient.investigations = workspace.investigations.map((item) => ({
    title: item.name,
    status: item.status,
    result: item.clinicalIndication || item.remarks || 'Pending',
    updated: item.lastUpdated,
  }))
}

export function addTimelineEvent(
  workspace: PatientWorkspaceData,
  event: Omit<WorkspaceTimelineEvent, 'id' | 'timestamp'> & { timestamp?: string },
): PatientWorkspaceData {
  return {
    ...workspace,
    timeline: [
      {
        id: createId('timeline'),
        timestamp: event.timestamp || nowLabel(),
        title: event.title,
        module: event.module,
        details: event.details,
        major: event.major,
        attachmentName: event.attachmentName,
        attachmentDataUrl: event.attachmentDataUrl,
      },
      ...workspace.timeline,
    ],
  }
}

export function nowTimestamp() {
  return nowLabel()
}
