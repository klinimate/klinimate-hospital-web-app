import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TextArea } from '@/components/ui/TextArea'
import { patients } from '@/data/patients'

const steps = [
  'Complaint',
  'History',
  'Allergies',
  'Examination',
  'Vitals',
  'Investigations',
  'Diagnosis',
  'AI Summary',
  'Consultant',
  'Treatment',
  'Confirm',
] as const

type StepKey = typeof steps[number]

interface AdmissionState {
  complaint: string
  history: string
  allergies: string
  examination: string
  vitals: string
  investigations: string
  diagnosis: string
  aiSummary: string
  consultantReview: string
  treatmentPlan: string
  confirm: boolean
}

const createInitialState = (patientId: string): AdmissionState => {
  const stored = window.localStorage.getItem(`admission-${patientId}`)
  if (stored) {
    try {
      return JSON.parse(stored) as AdmissionState
    } catch {
      // continue
    }
  }

  return {
    complaint: '',
    history: '',
    allergies: '',
    examination: '',
    vitals: '',
    investigations: '',
    diagnosis: '',
    aiSummary: '',
    consultantReview: '',
    treatmentPlan: '',
    confirm: false,
  }
}

function stepToField(step: StepKey): keyof AdmissionState {
  return (
    {
      Complaint: 'complaint',
      History: 'history',
      Allergies: 'allergies',
      Examination: 'examination',
      Vitals: 'vitals',
      Investigations: 'investigations',
      Diagnosis: 'diagnosis',
      'AI Summary': 'aiSummary',
      Consultant: 'consultantReview',
      Treatment: 'treatmentPlan',
      Confirm: 'confirm',
    } as const
  )[step]
}

export function AdmissionWorkflowPage() {
  const navigate = useNavigate()
  const { patientId } = useParams()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [state, setState] = useState<AdmissionState>(() =>
    patientId ? createInitialState(patientId) : createInitialState('unknown'),
  )

  const patient = useMemo(
    () => patients.find((entry) => entry.id === patientId),
    [patientId],
  )

  useEffect(() => {
    if (!patientId) return
    window.localStorage.setItem(`admission-${patientId}`, JSON.stringify(state))
  }, [patientId, state])

  if (!patient) {
    return (
      <AppLayout>
        <div className="rounded-2xl bg-white p-5 text-sm text-text-muted shadow-sm">
          Patient not found.
        </div>
      </AppLayout>
    )
  }

  const step = steps[currentStepIndex]
  const field = stepToField(step)
  const value = state[field]
  const progress = Math.round(((currentStepIndex + 1) / steps.length) * 100)

  const handleFieldChange = (nextValue: string | boolean) => {
    setState((current) => ({
      ...current,
      [field]: nextValue,
    }))
  }

  const next = () => {
    setCurrentStepIndex((index) => Math.min(index + 1, steps.length - 1))
  }

  const back = () => {
    setCurrentStepIndex((index) => Math.max(index - 1, 0))
  }

  const submitAdmission = () => {
    window.localStorage.removeItem(`admission-${patientId}`)
    navigate(`/patients/${patientId}/dashboard`)
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 pb-6">
        <header className="rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary-700">Admission workflow</p>
              <h1 className="mt-2 text-2xl font-semibold text-text">{patient.name}</h1>
              <p className="mt-1 text-sm text-text-muted">
                Step {currentStepIndex + 1} of {steps.length}: {step}
              </p>
            </div>
            <div className="rounded-3xl bg-surface-muted px-3 py-2 text-sm text-text-muted">
              Patient ID {patient.id}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-2 rounded-full bg-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-text-muted">{progress}% complete</p>
        </header>

        <Card>
          <div className="space-y-4">
            {step === 'Complaint' ? (
              <TextArea
                label="Presenting complaint"
                value={String(value)}
                onChange={(event) => handleFieldChange(event.target.value)}
                placeholder="Describe the patient complaint"
              />
            ) : step === 'History' ? (
              <TextArea
                label="Relevant history"
                value={String(value)}
                onChange={(event) => handleFieldChange(event.target.value)}
                placeholder="Capture history of present illness"
              />
            ) : step === 'Allergies' ? (
              <TextArea
                label="Allergies"
                value={String(value)}
                onChange={(event) => handleFieldChange(event.target.value)}
                placeholder="List known allergies"
              />
            ) : step === 'Examination' ? (
              <TextArea
                label="Examination findings"
                value={String(value)}
                onChange={(event) => handleFieldChange(event.target.value)}
                placeholder="Document physical exam findings"
              />
            ) : step === 'Vitals' ? (
              <TextArea
                label="Initial vitals"
                value={String(value)}
                onChange={(event) => handleFieldChange(event.target.value)}
                placeholder="Add BP, pulse, temperature, respiratory rate, SpO2, blood sugar"
              />
            ) : step === 'Investigations' ? (
              <TextArea
                label="Initial investigations"
                value={String(value)}
                onChange={(event) => handleFieldChange(event.target.value)}
                placeholder="List required investigations"
              />
            ) : step === 'Diagnosis' ? (
              <TextArea
                label="Provisional diagnosis"
                value={String(value)}
                onChange={(event) => handleFieldChange(event.target.value)}
                placeholder="Document provisional diagnosis"
              />
            ) : step === 'AI Summary' ? (
              <TextArea
                label="AI clinical summary"
                value={String(value)}
                onChange={(event) => handleFieldChange(event.target.value)}
                placeholder="Summarize clinical impressions"
              />
            ) : step === 'Consultant' ? (
              <TextArea
                label="Consultant recommendations"
                value={String(value)}
                onChange={(event) => handleFieldChange(event.target.value)}
                placeholder="Capture consultant review notes"
              />
            ) : step === 'Treatment' ? (
              <TextArea
                label="Treatment plan"
                value={String(value)}
                onChange={(event) => handleFieldChange(event.target.value)}
                placeholder="Plan treatment and admission orders"
              />
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl bg-surface-muted p-4">
                  <p className="text-sm font-semibold text-text">Review admission details</p>
                  <dl className="mt-3 grid gap-3 text-sm text-text-muted sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-text">Complaint</dt>
                      <dd className="mt-1">{state.complaint || 'Not entered'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">History</dt>
                      <dd className="mt-1">{state.history || 'Not entered'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">Allergies</dt>
                      <dd className="mt-1">{state.allergies || 'Not entered'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">Examination</dt>
                      <dd className="mt-1">{state.examination || 'Not entered'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">Vitals</dt>
                      <dd className="mt-1">{state.vitals || 'Not entered'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">Investigations</dt>
                      <dd className="mt-1">{state.investigations || 'Not entered'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">Diagnosis</dt>
                      <dd className="mt-1">{state.diagnosis || 'Not entered'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">AI Summary</dt>
                      <dd className="mt-1">{state.aiSummary || 'Not entered'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">Consultant review</dt>
                      <dd className="mt-1">{state.consultantReview || 'Not entered'}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">Treatment</dt>
                      <dd className="mt-1">{state.treatmentPlan || 'Not entered'}</dd>
                    </div>
                  </dl>
                </div>

                <label className="flex items-center gap-3 rounded-3xl bg-surface-muted px-4 py-4">
                  <input
                    type="checkbox"
                    checked={state.confirm}
                    onChange={(event) => handleFieldChange(event.target.checked)}
                    className="h-4 w-4 accent-primary-600"
                  />
                  <span className="text-sm text-text-muted">
                    Confirm admission details and submit patient for admission.
                  </span>
                </label>
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="secondary" size="lg" fullWidth={false} onClick={back}>
            Back
          </Button>
          {step !== 'Confirm' ? (
            <Button size="lg" fullWidth={false} onClick={next}>
              Continue
            </Button>
          ) : (
            <Button
              size="lg"
              fullWidth={false}
              disabled={!state.confirm}
              onClick={submitAdmission}
            >
              Confirm Admission
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
