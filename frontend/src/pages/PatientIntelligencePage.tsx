import { useEffect, useMemo, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { buildPatientIntelligence } from '@/data/patientIntelligence'
import { patients } from '@/data/patients'
import {
  INVESTIGATION_MASTER,
  MEDICATION_MASTER,
  addTimelineEvent,
  createId,
  nowTimestamp,
  readWorkspace,
  syncPatientFromWorkspace,
  type InvestigationPriority,
  type PatientWorkspaceData,
  type WorkspaceInvestigation,
  type WorkspaceMedication,
  type WorkspaceNote,
  type WorkspaceTimelineEvent,
  type WorkspaceVitals,
  writeWorkspace,
} from '@/lib/patientWorkspace'
import { computeTriageForPatient } from '@/lib/triage'
import { useParams } from 'react-router-dom'

type ModalType =
  | 'intelligenceSummary'
  | 'diagnosisForm'
  | 'diagnosisHistory'
  | 'vitalsForm'
  | 'notesForm'
  | 'investigationsForm'
  | 'medicationsForm'
  | 'timelineForm'
  | 'vitalsHistory'
  | 'notesHistory'
  | 'investigationsHistory'
  | 'medicationsHistory'
  | 'timelineHistory'
  | null

interface SummaryDraft {
  clinicalSummary: string
  diagnosis: string
  medicationsAdministered: string
  dischargeMedications: string
  dischargeAdvice: string
}

type DiagnosisStatus = 'Provisional' | 'Confirmed' | 'Differential' | 'Ruled Out'

interface DiagnosisEntry {
  id: string
  diagnosis: string
  status: DiagnosisStatus
  notes: string
  source: 'SNOMED CT' | 'Manual'
  createdAt: string
}

const SNOMED_DIAGNOSIS_MASTER = [
  'Hypertensive urgency',
  'Type 2 diabetes mellitus with hyperglycemia',
  'Community acquired pneumonia',
  'Acute exacerbation of chronic obstructive pulmonary disease',
  'Acute kidney injury',
  'Sepsis of pulmonary origin',
  'Acute decompensated heart failure',
  'Non-ST elevation myocardial infarction',
  'Acute ischemic stroke',
  'Urinary tract infection',
  'Dengue fever',
  'Acute viral hepatitis',
  'Chronic liver disease with ascites',
  'Iron deficiency anemia',
  'Hypokalemia',
  'Pleural effusion',
  'Pulmonary embolism',
  'Acute pancreatitis',
  'Cellulitis of lower limb',
  'Post-operative wound infection',
] as const

const DOSE_OPTIONS = ['250 mg', '500 mg', '625 mg', '1 g', '2 g', '5 mg', '10 mg', 'Others'] as const
const ROUTE_OPTIONS = ['Oral', 'IV', 'IM', 'SC', 'Nebulization', 'Topical', 'Rectal', 'Others'] as const
const FREQUENCY_OPTIONS = ['OD', 'BD', 'TDS', 'QID', 'SOS', 'Stat', 'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'Others'] as const
const DURATION_OPTIONS = ['Single Dose', '3 Days', '5 Days', '7 Days', '10 Days', 'Until Review', 'Others'] as const
const INSTRUCTION_OPTIONS = ['Before Food', 'After Food', 'With Food', 'Bedtime', 'Empty Stomach', 'PRN', 'Others'] as const

interface DashboardCardProps {
  title: string
  subtitle: string
  onOpen: () => void
  onAdd?: () => void
  footer?: React.ReactNode
  showViewAll?: boolean
  compactHeight?: boolean
  children: React.ReactNode
}

function DashboardCard({ title, subtitle, onOpen, onAdd, footer, showViewAll = true, compactHeight = false, children }: DashboardCardProps) {
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen()
    }
  }

  return (
    <Card className={compactHeight ? 'min-h-[10.5rem]' : 'h-64'}>
      <div role="button" tabIndex={0} onClick={onOpen} onKeyDown={onKeyDown} className="flex h-full cursor-pointer flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">{title}</h2>
            <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
          </div>
          {onAdd ? (
            <Button
              size="md"
              onClick={(event) => {
                event.stopPropagation()
                onAdd()
              }}
            >
              +
            </Button>
          ) : null}
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-hidden">{children}</div>

        {showViewAll || footer ? (
          <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-xs">
            {showViewAll ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onOpen()
                }}
                className="font-semibold text-primary-700"
              >
                View All
              </button>
            ) : (
              <span />
            )}
            {footer ? <span className="text-text-muted">{footer}</span> : null}
          </div>
        ) : null}
      </div>
    </Card>
  )
}

function ModalShell({
  title,
  onClose,
  children,
  footer,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode | null
}) {
  const footerNode = footer === undefined ? (
    <div className="flex">
      <Button fullWidth variant="secondary" onClick={onClose}>Close</Button>
    </div>
  ) : footer

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/45">
      <div className="flex h-full items-start justify-center px-3 pt-6 pb-4 sm:px-4">
        <div className="flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-4 py-3 sm:px-5">
            <h3 className="text-base font-semibold text-text">{title}</h3>
            <Button variant="ghost" size="md" onClick={onClose}>Close</Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2.5 sm:px-5">{children}</div>
          {footerNode ? <div className="border-t border-border bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">{footerNode}</div> : null}
        </div>
      </div>
    </div>
  )
}

function firstSentence(value: string) {
  const sentence = value.trim().split(/[.!?]/)[0]
  return sentence || 'No text'
}

function timeLabel(timestamp: string) {
  const date = new Date(timestamp)
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
  }
  const parts = timestamp.split(',')
  return parts[parts.length - 1]?.trim() || timestamp
}

function clinicalPreview(value: string) {
  const sentences = value.match(/[^.!?]+[.!?]?/g) || [value]
  let output = ''

  for (const sentence of sentences) {
    if ((output + sentence).trim().length > 220) break
    output = `${output}${sentence}`
    if (output.trim().split(/[.!?]/).filter(Boolean).length >= 2) break
  }

  return output.trim() || value
}

function splitSummaryItems(value: string) {
  return value
    .split(/;|\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function joinSummaryItems(items: string[]) {
  return items.filter(Boolean).join('; ')
}

function compactMedicationLabel(name: string, dose: string, frequency: string) {
  return `${name} ${dose} ${frequency}`.trim().replace(/\s+/g, ' ')
}

export function PatientIntelligencePage() {
  const { patientId } = useParams()
  const [workspace, setWorkspace] = useState<PatientWorkspaceData | null>(null)
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const [vitalsForm, setVitalsForm] = useState({
    pulse: '',
    bpSystolic: '',
    bpDiastolic: '',
    spo2: '',
    respiratoryRate: '',
    urineOutput: '',
    bloodSugar: '',
  })

  const [noteText, setNoteText] = useState('')
  const [noteAttachmentName, setNoteAttachmentName] = useState('')
  const [noteAttachmentDataUrl, setNoteAttachmentDataUrl] = useState('')

  const [investigationQuery, setInvestigationQuery] = useState('')
  const [investigationName, setInvestigationName] = useState('')
  const [investigationPriority, setInvestigationPriority] = useState<InvestigationPriority>('Routine')
  const [investigationFindings, setInvestigationFindings] = useState('')
  const [investigationAttachmentName, setInvestigationAttachmentName] = useState('')
  const [investigationAttachmentDataUrl, setInvestigationAttachmentDataUrl] = useState('')

  const [medicationQuery, setMedicationQuery] = useState('')
  const [medicationName, setMedicationName] = useState('')
  const [medicationDose, setMedicationDose] = useState('')
  const [medicationRoute, setMedicationRoute] = useState('')
  const [medicationFrequency, setMedicationFrequency] = useState('')
  const [medicationDuration, setMedicationDuration] = useState('')
  const [medicationInstructions, setMedicationInstructions] = useState('')
  const [medicationAttachmentName, setMedicationAttachmentName] = useState('')
  const [medicationAttachmentDataUrl, setMedicationAttachmentDataUrl] = useState('')

  const [timelineEventType, setTimelineEventType] = useState('Clinical Event')
  const [timelineEventDetails, setTimelineEventDetails] = useState('')

  const [summaryDraft, setSummaryDraft] = useState<SummaryDraft | null>(null)
  const [isEditingSummary, setIsEditingSummary] = useState(false)

  const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([])
  const [diagnosisQuery, setDiagnosisQuery] = useState('')
  const [diagnosisStatus, setDiagnosisStatus] = useState<DiagnosisStatus>('Provisional')
  const [diagnosisNotes, setDiagnosisNotes] = useState('')
  const [showDiagnosisOptions, setShowDiagnosisOptions] = useState(false)

  const patient = patients.find((entry) => entry.id === patientId)

  useEffect(() => {
    if (!patient) return
    setWorkspace(readWorkspace(patient))

    const diagnosisKey = `klinimate-diagnosis-${patient.id}`
    const raw = window.localStorage.getItem(diagnosisKey)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as DiagnosisEntry[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDiagnoses(parsed)
          return
        }
      } catch {
        // Fallback to initial diagnosis seed below.
      }
    }

    setDiagnoses([
      {
        id: createId('dx'),
        diagnosis: patient.diagnosis,
        status: 'Provisional',
        notes: '',
        source: 'Manual',
        createdAt: patient.lastUpdated,
      },
    ])
  }, [patient])

  useEffect(() => {
    if (!patient || diagnoses.length === 0) return
    window.localStorage.setItem(`klinimate-diagnosis-${patient.id}`, JSON.stringify(diagnoses))
  }, [patient, diagnoses])

  useEffect(() => {
    if (!patient || !workspace) return
    writeWorkspace(patient.id, workspace)
    syncPatientFromWorkspace(patient, workspace)
  }, [patient, workspace])

  const triage = patient ? computeTriageForPatient(patient) : null
  const intelligence = patient && triage ? buildPatientIntelligence(patient, triage.level) : null

  const latestVitals = workspace?.vitals[0]
  const activeMedications = useMemo(() => workspace?.medications.filter((item) => item.status === 'Active') || [], [workspace])
  const abnormalInvestigations = useMemo(() => workspace?.investigations.filter((item) => item.status === 'Abnormal') || [], [workspace])
  const notesLatestThree = useMemo(() => workspace?.notes.slice(0, 3) || [], [workspace])
  const timelineLatestFive = useMemo(() => workspace?.timeline.slice(0, 5) || [], [workspace])
  const latestDiagnosis = diagnoses[0]

  const filteredDiagnoses = useMemo(() => {
    const query = diagnosisQuery.trim().toLowerCase()
    if (!query) return SNOMED_DIAGNOSIS_MASTER
    return SNOMED_DIAGNOSIS_MASTER.filter((item) => item.toLowerCase().includes(query))
  }, [diagnosisQuery])

  const showCustomDiagnosisOption =
    !!diagnosisQuery.trim() &&
    !SNOMED_DIAGNOSIS_MASTER.some((item) => item.toLowerCase() === diagnosisQuery.trim().toLowerCase())

  const investigationSummary = useMemo(() => {
    if (!workspace) return 'No investigation summary available.'
    const ai = workspace.investigations.find((item) => item.aiSummary)?.aiSummary
    if (ai) return ai
    const names = workspace.investigations.slice(0, 3).map((item) => item.name).join(', ')
    const abnormalCount = workspace.investigations.filter((item) => item.status === 'Abnormal').length
    return `Abnormal findings count ${abnormalCount}. Correlate with recent investigations: ${names || 'none'}. Continue trend monitoring with clinical context.`
  }, [workspace])

  const generatedSummaryDraft = useMemo<SummaryDraft | null>(() => {
    if (!patient || !workspace || !intelligence || !triage) return null

    const majorHospitalEvents = workspace.timeline
      .filter((item) => item.major)
      .map((item) => item.title.trim())
      .filter((title) => {
        const normalized = title.toLowerCase()
        return !(
          normalized === 'vitals updated' ||
          normalized === 'medical note added' ||
          normalized === 'medication updated' ||
          normalized.includes('started') ||
          normalized.includes('medication') ||
          normalized.includes('ordered') ||
          normalized.includes('investigation')
        )
      })
      .filter((title, index, array) => array.findIndex((entry) => entry.toLowerCase() === title.toLowerCase()) === index)
      .slice(0, 4)

    const currentStatus =
      triage.level === 'GREEN'
        ? 'Clinically stable on current management.'
        : triage.level === 'YELLOW'
          ? 'Stable but needs close inpatient monitoring.'
          : 'High-risk status with need for urgent review and escalation.'

    const progressLabel =
      triage.level === 'GREEN'
        ? 'Progress is favorable with improving clinical course.'
        : triage.level === 'YELLOW'
          ? 'Progress is cautious with ongoing response monitoring.'
          : 'Progress remains guarded with active inpatient concerns.'

    const medicationsAdministered = activeMedications
      .slice(0, 4)
      .map((item) => compactMedicationLabel(item.name, item.dose, item.frequency))

    const dischargeMedicationItems = activeMedications.length > 0
      ? activeMedications.slice(0, 4).map((item) => `Continue ${compactMedicationLabel(item.name, item.dose, item.frequency)}`)
      : ['Continue discharge medications as advised']

    const followUpAdviceItems = [
      triage.level === 'GREEN' ? 'Follow-up after 7 days' : 'Daily inpatient review until stable for discharge',
      patient.chiefComplaint.toLowerCase().includes('chest') ? 'Cardiology OPD review' : 'Specialist follow-up as advised',
      'Continue BP monitoring',
      'Return for chest pain or breathlessness',
    ]

    const dischargeReadiness =
      triage.level === 'GREEN'
        ? 'Suitable for discharge planning if stability is maintained.'
        : 'Not discharge-ready and requires continued inpatient care.'

    return {
      clinicalSummary: [
        `Current status: ${currentStatus}`,
        `Major events: ${joinSummaryItems(majorHospitalEvents) || 'No major procedure or escalation documented.'}`,
        `Clinical progress: ${progressLabel}`,
        `Discharge readiness: ${dischargeReadiness}`,
      ].join('\n'),
      diagnosis: patient.diagnosis,
      medicationsAdministered: joinSummaryItems(
        medicationsAdministered.length > 0 ? medicationsAdministered : ['No active inpatient medication recorded'],
      ),
      dischargeMedications: joinSummaryItems(dischargeMedicationItems),
      dischargeAdvice: joinSummaryItems(followUpAdviceItems),
    }
  }, [patient, workspace, intelligence, activeMedications, triage])

  const investigationSuggestions = useMemo(() => {
    const query = investigationQuery.trim().toLowerCase()
    if (!query) return INVESTIGATION_MASTER
    return INVESTIGATION_MASTER.filter((item) => item.toLowerCase().includes(query))
  }, [investigationQuery])

  const medicationSuggestions = useMemo(() => {
    const query = medicationQuery.trim().toLowerCase()
    if (!query) return MEDICATION_MASTER.slice(0, 30)
    return MEDICATION_MASTER.filter((item) => item.name.toLowerCase().includes(query))
  }, [medicationQuery])

  function openModal(modal: ModalType) {
    if (modal === 'intelligenceSummary' && generatedSummaryDraft) {
      setSummaryDraft(generatedSummaryDraft)
      setIsEditingSummary(false)
    }
    setActiveModal(modal)
  }

  function closeModal() {
    setActiveModal(null)
  }

  function uploadAsDataUrl(file: File | null | undefined, onDone: (name: string, dataUrl: string) => void) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onDone(file.name, typeof reader.result === 'string' ? reader.result : '')
    reader.readAsDataURL(file)
  }

  function saveVitals() {
    if (!workspace) return
    if (!vitalsForm.bpSystolic.trim() || !vitalsForm.bpDiastolic.trim()) return

    const vital: WorkspaceVitals = {
      id: createId('vital'),
      timestamp: nowTimestamp(),
      pulse: vitalsForm.pulse.trim(),
      bpSystolic: vitalsForm.bpSystolic.trim(),
      bpDiastolic: vitalsForm.bpDiastolic.trim(),
      spo2: vitalsForm.spo2.trim(),
      respiratoryRate: vitalsForm.respiratoryRate.trim(),
      urineOutput: vitalsForm.urineOutput.trim(),
      bloodSugar: vitalsForm.bloodSugar.trim(),
    }

    setWorkspace((current) => {
      if (!current) return current
      return addTimelineEvent(
        {
          ...current,
          vitals: [vital, ...current.vitals],
        },
        {
          title: 'Vitals Updated',
          module: 'Vitals',
          details: `BP ${vital.bpSystolic}/${vital.bpDiastolic}`,
          major: false,
        },
      )
    })

    setVitalsForm({
      pulse: '',
      bpSystolic: '',
      bpDiastolic: '',
      spo2: '',
      respiratoryRate: '',
      urineOutput: '',
      bloodSugar: '',
    })
    closeModal()
  }

  function saveNote() {
    if (!workspace) return
    const noteBody = noteText.trim()
    if (!noteBody && !noteAttachmentDataUrl) return

    const note: WorkspaceNote = {
      id: createId('note'),
      note: noteBody || 'Attachment note',
      createdAt: nowTimestamp(),
      author: 'Dr. Ananya Sharma',
      attachmentName: noteAttachmentName || undefined,
      attachmentDataUrl: noteAttachmentDataUrl || undefined,
    }

    setWorkspace((current) => {
      if (!current) return current
      return addTimelineEvent(
        {
          ...current,
          notes: [note, ...current.notes],
        },
        {
          title: 'Medical Note Added',
          module: 'Medical Notes',
          details: note.note || 'Attachment added',
          major: false,
          attachmentName: note.attachmentName,
          attachmentDataUrl: note.attachmentDataUrl,
        },
      )
    })

    setNoteText('')
    setNoteAttachmentName('')
    setNoteAttachmentDataUrl('')
    closeModal()
  }

  function saveInvestigation() {
    if (!workspace) return
    const name = investigationName.trim() || investigationQuery.trim()
    if (!name) return

    const investigation: WorkspaceInvestigation = {
      id: createId('inv'),
      name,
      priority: investigationPriority,
      status: 'Pending',
      clinicalIndication: investigationFindings.trim(),
      remarks: '',
      lastUpdated: nowTimestamp(),
      attachmentName: investigationAttachmentName || undefined,
      attachmentDataUrl: investigationAttachmentDataUrl || undefined,
    }

    setWorkspace((current) => {
      if (!current) return current
      return addTimelineEvent(
        {
          ...current,
          investigations: [investigation, ...current.investigations],
        },
        {
          title: `${investigation.name} ${investigation.attachmentDataUrl ? 'Uploaded' : 'Ordered'}`,
          module: 'Investigations',
          details: investigation.priority,
          major: true,
          attachmentName: investigation.attachmentName,
          attachmentDataUrl: investigation.attachmentDataUrl,
        },
      )
    })

    setInvestigationQuery('')
    setInvestigationName('')
    setInvestigationPriority('Routine')
    setInvestigationFindings('')
    setInvestigationAttachmentName('')
    setInvestigationAttachmentDataUrl('')
    closeModal()
  }

  function saveMedication() {
    if (!workspace) return
    const name = medicationName.trim() || medicationQuery.trim()
    if (!name) return

    const medication: WorkspaceMedication = {
      id: createId('med'),
      name,
      strength: medicationDose.trim(),
      route: medicationRoute.trim(),
      dose: medicationDose.trim(),
      frequency: medicationFrequency.trim(),
      duration: medicationDuration.trim(),
      durationUnit: 'Days',
      instructions: medicationInstructions.trim(),
      additionalInstructions: '',
      status: 'Active',
      lastModified: nowTimestamp(),
      attachmentName: medicationAttachmentName || undefined,
      attachmentDataUrl: medicationAttachmentDataUrl || undefined,
    }

    setWorkspace((current) => {
      if (!current) return current
      return addTimelineEvent(
        {
          ...current,
          medications: [medication, ...current.medications],
        },
        {
          title: `${medication.name} Started`,
          module: 'Medications',
          details: `${medication.dose} ${medication.route} ${medication.frequency}`.trim(),
          major: true,
          attachmentName: medication.attachmentName,
          attachmentDataUrl: medication.attachmentDataUrl,
        },
      )
    })

    setMedicationQuery('')
    setMedicationName('')
    setMedicationDose('')
    setMedicationRoute('')
    setMedicationFrequency('')
    setMedicationDuration('')
    setMedicationInstructions('')
    setMedicationAttachmentName('')
    setMedicationAttachmentDataUrl('')
    closeModal()
  }

  function saveTimelineEvent() {
    if (!workspace) return
    const title = timelineEventType

    const event: Omit<WorkspaceTimelineEvent, 'id'> = {
      timestamp: nowTimestamp(),
      title,
      module: 'Consultation',
      details: timelineEventDetails.trim() || timelineEventType,
      major: false,
    }

    setWorkspace((current) => {
      if (!current) return current
      return addTimelineEvent(current, event)
    })

    setTimelineEventType('Clinical Event')
    setTimelineEventDetails('')
    closeModal()
  }

  function saveDiagnosis() {
    if (!diagnosisQuery.trim()) return

    const source: DiagnosisEntry['source'] = SNOMED_DIAGNOSIS_MASTER.some(
      (item) => item.toLowerCase() === diagnosisQuery.trim().toLowerCase(),
    )
      ? 'SNOMED CT'
      : 'Manual'

    const diagnosis: DiagnosisEntry = {
      id: createId('dx'),
      diagnosis: diagnosisQuery.trim(),
      status: diagnosisStatus,
      notes: diagnosisNotes.trim(),
      source,
      createdAt: nowTimestamp(),
    }

    setDiagnoses((current) => [diagnosis, ...current])

    setWorkspace((current) => {
      if (!current) return current
      return addTimelineEvent(current, {
        title: 'Diagnosis Updated',
        module: 'Consultation',
        details: `${diagnosis.diagnosis} · ${diagnosis.status}`,
        major: true,
      })
    })

    setDiagnosisQuery('')
    setDiagnosisStatus('Provisional')
    setDiagnosisNotes('')
    setShowDiagnosisOptions(false)
    closeModal()
  }

  function diagnosisBadgeClass(status: DiagnosisStatus) {
    if (status === 'Confirmed') return 'bg-emerald-50 text-emerald-700'
    if (status === 'Differential') return 'bg-amber-50 text-amber-700'
    if (status === 'Ruled Out') return 'bg-slate-100 text-slate-700'
    return 'bg-primary-50 text-primary-700'
  }

  if (!patient || !triage || !intelligence || !workspace) {
    return (
      <AppLayout>
        <div className="rounded-2xl bg-white p-5 text-sm text-text-muted shadow-sm">Patient not found.</div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-6">
        <Card className="sticky top-2 z-20 max-h-[25vh] cursor-pointer overflow-hidden" onClick={() => openModal('intelligenceSummary')}>
          <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[1.35fr_1fr]">
            <div>
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-base font-semibold text-text">{patient.name}</h1>
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                  {intelligence.triage.emoji} {intelligence.triage.display}
                </span>
              </div>
              <p className="mt-1 text-xs text-text-muted">UHID {patient.id}</p>
              <p className="mt-1 text-xs text-text-muted">{patient.age} / {patient.gender}</p>
              <p className="mt-1 text-xs text-text-muted">{patient.careSetting} / {patient.room}</p>
              <p className="mt-1 text-xs text-text-muted">{patient.hospitalDay}</p>
              <p
                className="mt-2 text-xs leading-5 text-text-muted"
                style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {clinicalPreview(intelligence.clinicalSummary)}
              </p>
            </div>
            <div className="grid gap-2">
              <div className="rounded-xl bg-surface-muted px-3 py-2">
                <p className="text-[11px] text-text-muted">Primary Impression</p>
                <p className="mt-1 text-sm font-semibold text-text">{patient.diagnosis}</p>
              </div>
            </div>
          </div>
        </Card>

        <DashboardCard
          title="Diagnosis"
          subtitle="Working diagnosis (clinician-entered)"
          onOpen={() => openModal('diagnosisHistory')}
          onAdd={() => openModal('diagnosisForm')}
          compactHeight
          footer={diagnoses.length > 1 ? '+ More' : undefined}
        >
          <div className="space-y-2">
            {latestDiagnosis ? (
              <div className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-text">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-text-muted">Working Diagnosis (Clinician)</p>
                  <span className={[
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    diagnosisBadgeClass(latestDiagnosis.status),
                  ].join(' ')}>
                    {latestDiagnosis.status}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-text">{latestDiagnosis.diagnosis}</p>
              </div>
            ) : (
              <p className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-text-muted">No diagnosis added yet.</p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Current Vitals"
          subtitle="Latest BP, Pulse, SpO2, RR, Urine Output, Blood Sugar"
          onOpen={() => openModal('vitalsHistory')}
          onAdd={() => openModal('vitalsForm')}
          footer={workspace.vitals.length > 1 ? '+ More' : undefined}
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-muted px-3 py-2"><p className="text-[11px] text-text-muted">BP</p><p className="mt-1 text-sm font-semibold text-text">{latestVitals ? `${latestVitals.bpSystolic}/${latestVitals.bpDiastolic}` : 'Not recorded'}</p></div>
            <div className="rounded-xl bg-surface-muted px-3 py-2"><p className="text-[11px] text-text-muted">Pulse</p><p className="mt-1 text-sm font-semibold text-text">{latestVitals?.pulse || 'Not recorded'}</p></div>
            <div className="rounded-xl bg-surface-muted px-3 py-2"><p className="text-[11px] text-text-muted">SpO2</p><p className="mt-1 text-sm font-semibold text-text">{latestVitals?.spo2 || 'Not recorded'}</p></div>
            <div className="rounded-xl bg-surface-muted px-3 py-2"><p className="text-[11px] text-text-muted">RR</p><p className="mt-1 text-sm font-semibold text-text">{latestVitals?.respiratoryRate || 'Not recorded'}</p></div>
            <div className="rounded-xl bg-surface-muted px-3 py-2"><p className="text-[11px] text-text-muted">Urine Output</p><p className="mt-1 text-sm font-semibold text-text">{latestVitals?.urineOutput || 'Not recorded'}</p></div>
            <div className="rounded-xl bg-surface-muted px-3 py-2"><p className="text-[11px] text-text-muted">Blood Sugar</p><p className="mt-1 text-sm font-semibold text-text">{latestVitals?.bloodSugar || 'Not recorded'}</p></div>
          </div>
        </DashboardCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardCard
            title="Medical Notes"
            subtitle="Latest three notes"
            onOpen={() => openModal('notesHistory')}
            onAdd={() => openModal('notesForm')}
            footer={workspace.notes.length > 3 ? '+ More' : undefined}
          >
            <div className="space-y-2">
              {notesLatestThree.length === 0 ? <p className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-text-muted">No medical notes yet.</p> : null}
              {notesLatestThree.map((item) => (
                <div key={item.id} className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-text-muted">
                  <p className="font-semibold text-text">{timeLabel(item.createdAt)}</p>
                  <p>{firstSentence(item.note)}</p>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Investigations"
            subtitle="Important abnormal findings and AI summary"
            onOpen={() => openModal('investigationsHistory')}
            onAdd={() => openModal('investigationsForm')}
            footer={abnormalInvestigations.length > 3 ? '+ More' : undefined}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Important Abnormal Investigations</p>
              {abnormalInvestigations.slice(0, 3).map((item) => (
                <p key={item.id} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{item.name} ↑</p>
              ))}
              {abnormalInvestigations.length === 0 ? <p className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-text-muted">No abnormal investigations flagged.</p> : null}
              <p
                className="rounded-xl bg-primary-50 px-3 py-2 text-xs leading-5 text-primary-700"
                style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {investigationSummary}
              </p>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Medications"
            subtitle="Active medications"
            onOpen={() => openModal('medicationsHistory')}
            onAdd={() => openModal('medicationsForm')}
            footer={activeMedications.length > 5 ? '+ More' : undefined}
          >
            <div className="space-y-2">
              {activeMedications.slice(0, 5).map((item) => (
                <p key={item.id} className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-text"><span className="font-semibold">{item.name}</span> {item.dose} {item.route} {item.frequency}</p>
              ))}
              {activeMedications.length === 0 ? <p className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-text-muted">No active medications.</p> : null}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Timeline"
            subtitle="Concise activity feed"
            onOpen={() => openModal('timelineHistory')}
            onAdd={() => openModal('timelineForm')}
          >
            <div className="space-y-2">
              {timelineLatestFive.length === 0 ? <p className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-text-muted">No timeline events yet.</p> : null}
              {timelineLatestFive.map((item) => (
                <p key={item.id} className="rounded-xl bg-surface-muted px-3 py-2 text-xs text-text"><span className="font-semibold">{timeLabel(item.timestamp)}</span> {item.title}</p>
              ))}
            </div>
          </DashboardCard>
        </div>

        {activeModal === 'intelligenceSummary' && summaryDraft ? (
          <ModalShell
            title="Patient Intelligence Summary"
            onClose={closeModal}
            footer={null}
          >
            <div className="space-y-2 pb-0">
              <div className="sticky top-0 z-10 -mx-4 -mt-3 border-b border-border bg-white px-4 py-2 sm:-mx-5 sm:px-5">
                <div className="grid grid-cols-3 gap-2">
                  <Button fullWidth size="md" className="min-h-9 px-2 py-1.5 text-xs sm:text-sm" variant="secondary" onClick={() => setIsEditingSummary((current) => !current)}>Edit</Button>
                  <Button fullWidth size="md" className="min-h-8 px-2 py-1.5 text-xs sm:text-sm" onClick={() => setIsEditingSummary(false)}>Save</Button>
                  <Button fullWidth size="md" className="min-h-8 px-2 py-1.5 text-xs sm:text-sm" variant="secondary" onClick={() => window.print()}>Print</Button>
                </div>
              </div>

              <div className="h-0.5" />

              <Card className="px-3 py-2.5">
                <div className="grid gap-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Clinical Summary</p>
                  {isEditingSummary ? (
                    <textarea rows={5} value={summaryDraft.clinicalSummary} onChange={(event) => setSummaryDraft({ ...summaryDraft, clinicalSummary: event.target.value })} className="rounded-lg border border-border px-2.5 py-2 text-xs leading-4.5" />
                  ) : (
                    <p className="whitespace-pre-line text-xs leading-4.5 text-text" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{summaryDraft.clinicalSummary}</p>
                  )}
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-2">
                <Card className="px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Diagnosis</p>
                  {isEditingSummary ? <textarea rows={2} value={summaryDraft.diagnosis} onChange={(event) => setSummaryDraft({ ...summaryDraft, diagnosis: event.target.value })} className="mt-1 w-full rounded-lg border border-border px-2.5 py-2 text-xs leading-4.5" /> : <p className="mt-1 text-xs leading-4.5 text-text" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{summaryDraft.diagnosis}</p>}
                </Card>
                <Card className="px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Medications Given</p>
                  {isEditingSummary ? <textarea rows={4} value={summaryDraft.medicationsAdministered} onChange={(event) => setSummaryDraft({ ...summaryDraft, medicationsAdministered: event.target.value })} className="mt-1 w-full rounded-lg border border-border px-2.5 py-2 text-xs leading-4.5" /> : <ul className="mt-1 list-disc space-y-0.5 pl-3.5 text-xs leading-4 text-text">{splitSummaryItems(summaryDraft.medicationsAdministered || 'No active inpatient medication recorded.').map((item) => <li key={item}>{item}</li>)}</ul>}
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Card className="px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Discharge Medications</p>
                  {isEditingSummary ? <textarea rows={4} value={summaryDraft.dischargeMedications} onChange={(event) => setSummaryDraft({ ...summaryDraft, dischargeMedications: event.target.value })} className="mt-1 w-full rounded-lg border border-border px-2.5 py-2 text-xs leading-4.5" /> : <ul className="mt-1 list-disc space-y-0.5 pl-3.5 text-xs leading-4 text-text">{splitSummaryItems(summaryDraft.dischargeMedications).map((item) => <li key={item}>{item}</li>)}</ul>}
                </Card>
                <Card className="px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Discharge Advice</p>
                  {isEditingSummary ? <textarea rows={4} value={summaryDraft.dischargeAdvice} onChange={(event) => setSummaryDraft({ ...summaryDraft, dischargeAdvice: event.target.value })} className="mt-1 w-full rounded-lg border border-border px-2.5 py-2 text-xs leading-4.5" /> : <ul className="mt-1 list-disc space-y-0.5 pl-3.5 text-xs leading-4 text-text">{splitSummaryItems(summaryDraft.dischargeAdvice).map((item) => <li key={item}>{item}</li>)}</ul>}
                </Card>
              </div>
            </div>
          </ModalShell>
        ) : null}

        {activeModal === 'diagnosisForm' ? (
          <ModalShell title="Diagnosis" onClose={closeModal} footer={null}>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-text">Search Diagnosis</label>
                <div className="relative mt-1">
                  <input
                    value={diagnosisQuery}
                    onFocus={() => setShowDiagnosisOptions(true)}
                    onBlur={() => {
                      window.setTimeout(() => {
                        setShowDiagnosisOptions(false)
                      }, 120)
                    }}
                    onChange={(event) => {
                      setDiagnosisQuery(event.target.value)
                      setShowDiagnosisOptions(true)
                    }}
                    placeholder="Search or enter diagnosis"
                    className="min-h-11 w-full rounded-xl border border-border px-3 text-sm"
                  />

                  {showDiagnosisOptions ? (
                    <div className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-border bg-white shadow-lg">
                      {filteredDiagnoses.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="w-full border-b border-border px-3 py-2 text-left text-xs text-text last:border-b-0"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            setDiagnosisQuery(item)
                            setShowDiagnosisOptions(false)
                          }}
                        >
                          {item}
                        </button>
                      ))}

                      {showCustomDiagnosisOption ? (
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-xs font-medium text-primary-700"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            setDiagnosisQuery(diagnosisQuery.trim())
                            setShowDiagnosisOptions(false)
                          }}
                        >
                          + Use "{diagnosisQuery.trim()}"
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text">Diagnosis Status</label>
                <select
                  value={diagnosisStatus}
                  onChange={(event) => setDiagnosisStatus(event.target.value as DiagnosisStatus)}
                  className="mt-1 min-h-11 w-full rounded-xl border border-border px-3 text-sm"
                >
                  <option value="Provisional">Provisional</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Differential">Differential</option>
                  <option value="Ruled Out">Ruled Out</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-text">Optional Notes</label>
                <textarea
                  rows={3}
                  value={diagnosisNotes}
                  onChange={(event) => setDiagnosisNotes(event.target.value)}
                  placeholder="Optional notes"
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
                />
              </div>

              <Button fullWidth onClick={saveDiagnosis} disabled={!diagnosisQuery.trim()}>
                Save Diagnosis
              </Button>
            </div>
          </ModalShell>
        ) : null}

        {activeModal === 'diagnosisHistory' ? (
          <ModalShell title="Diagnosis History" onClose={closeModal}>
            <div className="space-y-2">
              {diagnoses.map((item) => (
                <Card key={item.id}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-text">{item.diagnosis}</p>
                    <span className={[
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      diagnosisBadgeClass(item.status),
                    ].join(' ')}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">{item.createdAt} · {item.source}</p>
                  {item.notes ? <p className="mt-2 text-sm text-text-muted">{item.notes}</p> : null}
                </Card>
              ))}
            </div>
          </ModalShell>
        ) : null}

        {activeModal === 'vitalsForm' ? (
          <ModalShell title="Update Vitals" onClose={closeModal}>
            <div className="grid gap-2 sm:grid-cols-2">
              <div><label className="text-xs font-medium text-text">Pulse</label><input value={vitalsForm.pulse} onChange={(event) => setVitalsForm((current) => ({ ...current, pulse: event.target.value }))} className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm" /></div>
              <div><label className="text-xs font-medium text-text">Blood Sugar</label><input value={vitalsForm.bloodSugar} onChange={(event) => setVitalsForm((current) => ({ ...current, bloodSugar: event.target.value }))} className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm" /></div>
              <div><label className="text-xs font-medium text-text">BP Systolic</label><input value={vitalsForm.bpSystolic} onChange={(event) => setVitalsForm((current) => ({ ...current, bpSystolic: event.target.value }))} className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm" /></div>
              <div><label className="text-xs font-medium text-text">BP Diastolic</label><input value={vitalsForm.bpDiastolic} onChange={(event) => setVitalsForm((current) => ({ ...current, bpDiastolic: event.target.value }))} className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm" /></div>
              <div><label className="text-xs font-medium text-text">SpO2</label><input value={vitalsForm.spo2} onChange={(event) => setVitalsForm((current) => ({ ...current, spo2: event.target.value }))} className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm" /></div>
              <div><label className="text-xs font-medium text-text">Respiratory Rate</label><input value={vitalsForm.respiratoryRate} onChange={(event) => setVitalsForm((current) => ({ ...current, respiratoryRate: event.target.value }))} className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-medium text-text">Urine Output (ml/hr)</label><input value={vitalsForm.urineOutput} onChange={(event) => setVitalsForm((current) => ({ ...current, urineOutput: event.target.value }))} className="mt-1 h-9 w-full rounded-lg border border-border px-3 text-sm" /></div>
              <Button fullWidth className="sm:col-span-2 mt-1" onClick={saveVitals}>Save Vitals</Button>
            </div>
          </ModalShell>
        ) : null}

        {activeModal === 'notesForm' ? (
          <ModalShell title="Add Medical Note" onClose={closeModal}>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-text">Medical Note</label>
                <textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} rows={9} className="mt-1 w-full rounded-xl border border-border px-4 py-3 text-sm" />
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text">Capture Photograph<input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => uploadAsDataUrl(event.target.files?.[0], (name, dataUrl) => { setNoteAttachmentName(name); setNoteAttachmentDataUrl(dataUrl) })} /></label>
              {noteAttachmentDataUrl ? <img src={noteAttachmentDataUrl} alt={noteAttachmentName || 'Note attachment'} className="max-h-48 rounded-xl border border-border object-cover" /> : null}
              <Button fullWidth onClick={saveNote}>Save Note</Button>
            </div>
          </ModalShell>
        ) : null}

        {activeModal === 'investigationsForm' ? (
          <ModalShell title="Order Investigation" onClose={closeModal}>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text">Investigation Master Database Search</label>
                <input value={investigationQuery} onChange={(event) => { const next = event.target.value; setInvestigationQuery(next); setInvestigationName(next) }} className="mt-1 min-h-12 w-full rounded-xl border border-border px-4 text-sm" />
                <div className="mt-2 grid gap-2 sm:grid-cols-2">{investigationSuggestions.slice(0, 6).map((item) => <Button key={item} variant="secondary" onClick={() => { setInvestigationName(item); setInvestigationQuery(item) }}>{item}</Button>)}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-text">Report Findings</label>
                <textarea
                  rows={5}
                  value={investigationFindings}
                  onChange={(event) => setInvestigationFindings(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 text-sm"
                  placeholder="Optional"
                />
              </div>

              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text">Capture Investigation Photograph<input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => uploadAsDataUrl(event.target.files?.[0], (name, dataUrl) => { setInvestigationAttachmentName(name); setInvestigationAttachmentDataUrl(dataUrl) })} /></label>
              <Button fullWidth onClick={saveInvestigation}>Save Investigation</Button>
            </div>
          </ModalShell>
        ) : null}

        {activeModal === 'medicationsForm' ? (
          <ModalShell title="Order Medication" onClose={closeModal}>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-text">Medication</label>
                <input
                  list="medication-options"
                  value={medicationQuery}
                  onChange={(event) => {
                    const next = event.target.value
                    setMedicationQuery(next)
                    setMedicationName(next)
                  }}
                  placeholder="Search medication or enter manually..."
                  className="mt-1 min-h-12 w-full rounded-xl border border-border px-4 text-sm"
                />
                <datalist id="medication-options">
                  {medicationSuggestions.map((item) => (
                    <option key={item.name} value={item.name} />
                  ))}
                </datalist>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-text">Dose</label>
                  <input list="dose-options" value={medicationDose} onChange={(event) => setMedicationDose(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-border px-4 text-sm" />
                  <datalist id="dose-options">{DOSE_OPTIONS.map((item) => <option key={item} value={item} />)}</datalist>
                </div>
                <div>
                  <label className="text-sm font-medium text-text">Route</label>
                  <input list="route-options" value={medicationRoute} onChange={(event) => setMedicationRoute(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-border px-4 text-sm" />
                  <datalist id="route-options">{ROUTE_OPTIONS.map((item) => <option key={item} value={item} />)}</datalist>
                </div>
                <div>
                  <label className="text-sm font-medium text-text">Frequency</label>
                  <input list="frequency-options" value={medicationFrequency} onChange={(event) => setMedicationFrequency(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-border px-4 text-sm" />
                  <datalist id="frequency-options">{FREQUENCY_OPTIONS.map((item) => <option key={item} value={item} />)}</datalist>
                </div>
                <div>
                  <label className="text-sm font-medium text-text">Duration</label>
                  <input list="duration-options" value={medicationDuration} onChange={(event) => setMedicationDuration(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-border px-4 text-sm" />
                  <datalist id="duration-options">{DURATION_OPTIONS.map((item) => <option key={item} value={item} />)}</datalist>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text">Instructions</label>
                <input list="instruction-options" value={medicationInstructions} onChange={(event) => setMedicationInstructions(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-border px-4 text-sm" />
                <datalist id="instruction-options">{INSTRUCTION_OPTIONS.map((item) => <option key={item} value={item} />)}</datalist>
              </div>

              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text">Capture Prescription Image<input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => uploadAsDataUrl(event.target.files?.[0], (name, dataUrl) => { setMedicationAttachmentName(name); setMedicationAttachmentDataUrl(dataUrl) })} /></label>
              <Button fullWidth onClick={saveMedication}>Save Medication</Button>
            </div>
          </ModalShell>
        ) : null}

        {activeModal === 'timelineForm' ? (
          <ModalShell title="Add Timeline Event" onClose={closeModal}>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text">Manual Event Type</label>
                <select value={timelineEventType} onChange={(event) => setTimelineEventType(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-border px-4 text-sm">
                  <option>Clinical Event</option>
                  <option>Procedure</option>
                  <option>Referral</option>
                  <option>Nursing Update</option>
                  <option>Progress Note</option>
                </select>
              </div>
              <div><label className="text-sm font-medium text-text">Details</label><textarea value={timelineEventDetails} onChange={(event) => setTimelineEventDetails(event.target.value)} rows={3} className="mt-1 min-h-24 w-full rounded-xl border border-border px-4 py-3 text-sm" /></div>
              <Button fullWidth onClick={saveTimelineEvent}>Save Timeline Event</Button>
            </div>
          </ModalShell>
        ) : null}

        {activeModal === 'vitalsHistory' ? (
          <ModalShell title="Vitals History" onClose={closeModal}>
            <div className="space-y-2">{workspace.vitals.map((item) => <Card key={item.id}><p className="text-sm font-semibold text-text">{timeLabel(item.timestamp)} - BP {item.bpSystolic}/{item.bpDiastolic} · Pulse {item.pulse}</p><p className="mt-1 text-xs text-text-muted">SpO2 {item.spo2} · RR {item.respiratoryRate} · Urine {item.urineOutput} · Sugar {item.bloodSugar}</p></Card>)}</div>
          </ModalShell>
        ) : null}

        {activeModal === 'notesHistory' ? (
          <ModalShell title="Medical Notes History" onClose={closeModal}>
            <div className="space-y-2">{workspace.notes.map((item) => <Card key={item.id}><p className="text-sm font-semibold text-text">{timeLabel(item.createdAt)}</p><p className="mt-1 text-sm text-text-muted">{item.note || 'Attachment note'}</p>{item.attachmentDataUrl ? <img src={item.attachmentDataUrl} alt={item.attachmentName || 'Note attachment'} className="mt-2 max-h-48 rounded-xl border border-border object-cover" /> : null}</Card>)}</div>
          </ModalShell>
        ) : null}

        {activeModal === 'investigationsHistory' ? (
          <ModalShell title="Investigation History" onClose={closeModal}>
            <div className="space-y-2">{workspace.investigations.map((item) => <Card key={item.id}><p className="text-sm font-semibold text-text">{item.name}</p><p className="mt-1 text-xs text-text-muted">{item.status} · {item.priority} · {item.lastUpdated}</p><p className="mt-2 text-sm text-text-muted">{item.clinicalIndication || item.remarks || 'No remarks'}</p>{item.attachmentDataUrl ? <img src={item.attachmentDataUrl} alt={item.attachmentName || 'Investigation attachment'} className="mt-2 max-h-48 rounded-xl border border-border object-cover" /> : null}</Card>)}</div>
          </ModalShell>
        ) : null}

        {activeModal === 'medicationsHistory' ? (
          <ModalShell title="Medication History" onClose={closeModal}>
            <div className="space-y-2">{workspace.medications.map((item) => <Card key={item.id}><p className="text-sm font-semibold text-text">{item.name}</p><p className="mt-1 text-xs text-text-muted">{item.status} · {item.lastModified}</p><p className="mt-2 text-sm text-text-muted">{item.dose} {item.route} {item.frequency} · {item.duration} {item.durationUnit}</p><p className="mt-1 text-xs text-text-muted">{item.instructions || 'No instructions'}</p>{item.attachmentDataUrl ? <img src={item.attachmentDataUrl} alt={item.attachmentName || 'Prescription attachment'} className="mt-2 max-h-48 rounded-xl border border-border object-cover" /> : null}</Card>)}</div>
          </ModalShell>
        ) : null}

        {activeModal === 'timelineHistory' ? (
          <ModalShell title="Timeline History" onClose={closeModal}>
            <div className="space-y-2">{workspace.timeline.map((item) => <Card key={item.id}><p className="text-sm font-semibold text-text">{timeLabel(item.timestamp)} {item.title}</p><p className="mt-1 text-xs text-text-muted">{item.module}</p><p className="mt-1 text-sm text-text-muted">{item.details}</p></Card>)}</div>
          </ModalShell>
        ) : null}
      </div>
    </AppLayout>
  )
}
