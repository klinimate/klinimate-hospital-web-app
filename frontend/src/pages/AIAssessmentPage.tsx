import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { buildMockAssessment, type AIAssessmentData, type TriageLevel } from '@/data/aiAssessment'

type AIAssessmentLocationState = {
  assessment?: AIAssessmentData
}

interface AssessmentSectionProps {
  title: string
  children: React.ReactNode
}

function AssessmentSection({ title, children }: AssessmentSectionProps) {
  return (
    <Card>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">{title}</h2>
      <div className="mt-3 text-sm text-text">{children}</div>
    </Card>
  )
}

const triageStyles: Record<TriageLevel, string> = {
  Green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  Red: 'bg-red-50 text-red-700 border-red-200',
  Black: 'bg-slate-200 text-slate-800 border-slate-300',
}

export function AIAssessmentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state ?? {}) as AIAssessmentLocationState
  const assessment = locationState.assessment ?? buildMockAssessment('Anita Kulkarni')
  const [statusMessage, setStatusMessage] = useState('')

  const triageClassName = useMemo(
    () => `inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${triageStyles[assessment.triage]}`,
    [assessment.triage],
  )

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">AI Assessment</h1>
            <p className="mt-1 text-sm text-text-muted">
              AI-generated clinical intelligence for {assessment.patientName}
            </p>
          </div>
          <span className={triageClassName}>{assessment.triage} Triage</span>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(['Green', 'Yellow', 'Red', 'Black'] as TriageLevel[]).map((level) => (
            <span
              key={level}
              className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium ${triageStyles[level]}`}
            >
              {level}
            </span>
          ))}
        </div>

        <AssessmentSection title="AI Clinical Summary">
          <p>{assessment.summary}</p>
        </AssessmentSection>

        <AssessmentSection title="Confidence Score (0-100%)">
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-primary-100">
              <div
                className="h-2 rounded-full bg-primary-600"
                style={{ width: `${assessment.confidenceScore}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-primary-700">
              {assessment.confidenceScore}%
            </span>
          </div>
        </AssessmentSection>

        <AssessmentSection title="Probable Diagnosis (Top 3)">
          <ul className="list-disc space-y-1 pl-5">
            {assessment.probableDiagnosis.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AssessmentSection>

        <AssessmentSection title="Differential Diagnosis">
          <ul className="list-disc space-y-1 pl-5">
            {assessment.differentialDiagnosis.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AssessmentSection>

        <AssessmentSection title="Recommended Investigations">
          <ul className="list-disc space-y-1 pl-5">
            {assessment.investigations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AssessmentSection>

        <AssessmentSection title="Initial Treatment Plan">
          <ul className="list-disc space-y-1 pl-5">
            {assessment.treatmentPlan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AssessmentSection>

        <AssessmentSection title="Escalation Recommendation">
          <p>{assessment.escalationRecommendation}</p>
        </AssessmentSection>

        <AssessmentSection title="Recommended Specialty">
          <p className="font-medium text-text">{assessment.specialty}</p>
        </AssessmentSection>

        {statusMessage ? (
          <p className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-700">
            {statusMessage}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button type="button" variant="secondary" size="lg" fullWidth onClick={() => navigate('/patients/new')}>
            Edit Patient
          </Button>
          <Button
            type="button"
            size="lg"
            fullWidth
            onClick={() => setStatusMessage('Case sent to Klinimate Intensivist (mock).')}
          >
            Send to Klinimate Intensivist
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            fullWidth
            onClick={() => setStatusMessage('AI assessment saved as draft (mock).')}
          >
            Save Draft
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
