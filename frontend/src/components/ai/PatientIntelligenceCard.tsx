import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Patient } from '@/data/patients'
import type { PatientIntelligenceSnapshot } from '@/data/patientIntelligence'

interface PatientIntelligenceCardProps {
  patient: Patient
  snapshot: PatientIntelligenceSnapshot
  compact?: boolean
}

export function PatientIntelligenceCard({ patient, snapshot, compact = false }: PatientIntelligenceCardProps) {
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const canOpenSummary = !compact

  const content = (
    <Card className={compact ? 'h-full p-3' : ''}>
      <div className="grid grid-cols-[1fr_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Patient Intelligence</p>
          <h3 className="mt-1 truncate text-base font-semibold text-text">{patient.name}</h3>
          <p className="mt-1 text-xs text-text-muted">
            {patient.id} · {patient.age} yrs · {patient.gender}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {patient.careSetting} · {patient.hospitalDay} · {patient.room}
          </p>
        </div>

        <div className="grid w-24 gap-1.5">
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-center text-xs font-semibold text-primary-700">
            {snapshot.triage.emoji} {snapshot.triage.display}
          </span>
          <div className="rounded-xl bg-surface-muted px-2 py-1.5">
            <p className="text-[10px] text-text-muted">Status</p>
            <p className="mt-0.5 text-xs font-semibold text-text">{patient.status}</p>
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-1.5 text-sm">
        <div>
          <p className="text-xs text-text-muted">Primary Impression</p>
          <p className="mt-0.5 font-medium text-text">{snapshot.primaryClinicalImpression}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Recommended Action</p>
          <p className="mt-0.5 font-medium text-text">{snapshot.primaryRecommendation}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">AI Summary</p>
          {canOpenSummary ? (
            <button
              type="button"
              className="mt-0.5 w-full text-left text-sm leading-5 text-text"
              style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              onClick={() => setShowSummaryModal(true)}
            >
              {snapshot.clinicalSummary}
            </button>
          ) : (
            <p
              className="mt-0.5 text-sm leading-5 text-text"
              style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {snapshot.clinicalSummary}
            </p>
          )}
          {canOpenSummary ? (
            <button
              type="button"
              className="mt-1 text-xs font-semibold text-primary-700"
              onClick={() => setShowSummaryModal(true)}
            >
              Read More →
            </button>
          ) : null}
        </div>
      </div>

      {canOpenSummary && showSummaryModal ? (
        <div className="fixed inset-0 z-50 bg-slate-950/45">
          <div className="flex h-full items-start justify-center px-3 pt-6 pb-4 sm:px-4">
            <div className="h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-4 py-3">
                <h3 className="text-sm font-semibold text-text">Patient Intelligence Summary</h3>
                <Button size="md" variant="ghost" className="min-h-9 px-3 py-1.5 text-xs" onClick={() => setShowSummaryModal(false)}>
                  Close
                </Button>
              </div>
              <div className="h-[calc(92vh-3.75rem)] overflow-y-auto px-4 py-3">
                  <div className="space-y-2.5">
                  <div>
                    <p className="text-xs text-text-muted">Patient</p>
                    <p className="mt-1 text-sm font-semibold text-text">{patient.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Primary Impression</p>
                    <p className="mt-1 text-sm text-text">{snapshot.primaryClinicalImpression}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Recommended Action</p>
                    <p className="mt-1 text-sm text-text">{snapshot.primaryRecommendation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">AI Summary</p>
                    <p className="mt-1 text-sm leading-6 text-text">{snapshot.clinicalSummary}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  )

  if (compact) {
    return (
      <Link to={`/patients/${patient.id}/dashboard`} className="block">
        {content}
      </Link>
    )
  }

  return content
}
