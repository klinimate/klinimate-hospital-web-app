import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/Card'

type StepStatus = 'pending' | 'active' | 'done'

type AIProcessingLocationState = {
  patientName?: string
  patientId?: string
}

const PROCESSING_STEPS = [
  'Collecting patient information',
  'Validating vital signs',
  'Assessing clinical severity',
  'Detecting red flag conditions',
  'Generating differential diagnoses',
  'Recommending investigations',
  'Preparing initial treatment plan',
  'Identifying escalation criteria',
  'Generating clinical summary',
] as const

interface ProcessingStepListProps {
  steps: readonly string[]
  activeIndex: number
  isComplete: boolean
}

function ProcessingStepList({ steps, activeIndex, isComplete }: ProcessingStepListProps) {
  function getStatus(index: number): StepStatus {
    if (isComplete || index < activeIndex) return 'done'
    if (index === activeIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, index) => {
        const status = getStatus(index)
        const visible = index <= activeIndex || isComplete

        return (
          <div
            key={step}
            className={[
              'flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-400',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1',
            ].join(' ')}
          >
            <span
              className={[
                'inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold',
                status === 'done'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : status === 'active'
                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                    : 'border-border bg-white text-text-muted',
              ].join(' ')}
            >
              {status === 'done' ? '✓' : status === 'active' ? '•' : '○'}
            </span>
            <span className={status === 'pending' ? 'text-text-muted' : 'text-text'}>{step}</span>
          </div>
        )
      })}
    </div>
  )
}

export function AIProcessingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as AIProcessingLocationState

  const patientId = state.patientId ?? 'PT-2048'
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'processing' | 'complete'>('processing')

  const activeStep = useMemo(() => {
    const ratio = progress / 100
    return Math.min(
      Math.floor(ratio * PROCESSING_STEPS.length),
      PROCESSING_STEPS.length - 1,
    )
  }, [progress])

  useEffect(() => {
    if (phase !== 'processing') return

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 1, 100)
        if (next === 100) {
          window.clearInterval(timer)
          setPhase('complete')
        }
        return next
      })
    }, 25)

    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'complete') return

    const timer = window.setTimeout(() => {
      navigate(`/patients/${patientId}/dashboard`)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [phase, navigate, patientId])

  if (phase === 'complete') {
    return (
      <AppLayout>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <header className="flex flex-col items-center text-center">
            <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-700">
              ✓
            </div>
            <h1 className="text-2xl font-semibold text-text">Analysis Complete</h1>
            <p className="mt-1 text-sm text-text-muted">
              Klinimate AI has successfully completed the clinical assessment.
            </p>
          </header>

          <Card className="p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">AI Confidence</p>
                <p className="mt-1 text-base font-semibold text-text">High (94%)</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Risk Category</p>
                <p className="mt-1 text-base font-semibold text-amber-700">Yellow</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Estimated Processing Time</p>
                <p className="mt-1 text-base font-semibold text-text">3.8 seconds</p>
              </div>
            </div>
          </Card>

          <p className="text-center text-sm text-text-muted">
            Clinical recommendations are ready for review.
          </p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <header className="flex flex-col items-center text-center">
          <img src="/klinimate-logo.png" alt="Klinimate" className="mb-3 h-auto w-[180px]" />
          <h1 className="text-2xl font-semibold text-text">Klinimate AI Clinical Analysis</h1>
          <p className="mt-1 text-sm text-text-muted">
            Please wait while Klinimate AI analyzes this patient.
          </p>
          <div className="mt-3 h-2 w-36 rounded-full bg-primary-100">
            <div className="h-2 w-full animate-pulse rounded-full bg-primary-500" />
          </div>
        </header>

        <Card className="p-5">
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-medium text-text-muted">
              <span>Analysis Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-primary-100">
              <div
                className="h-2 rounded-full bg-primary-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ProcessingStepList
            steps={PROCESSING_STEPS}
            activeIndex={activeStep}
            isComplete={false}
          />
        </Card>
      </div>
    </AppLayout>
  )
}
