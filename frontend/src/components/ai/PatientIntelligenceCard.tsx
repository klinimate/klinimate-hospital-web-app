import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import type { PatientIntelligenceSnapshot } from '@/data/patientIntelligence'

interface PatientIntelligenceCardProps {
  patientId: string
  snapshot: PatientIntelligenceSnapshot
}

export function PatientIntelligenceCard({ patientId, snapshot }: PatientIntelligenceCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text">Patient Intelligence</p>
          <p className="mt-1 text-xs text-text-muted">Updated: {snapshot.updatedLabel}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          {snapshot.triage.emoji} {snapshot.triage.display}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-surface-muted px-3 py-2">
          <p className="text-xs text-text-muted">Confidence</p>
          <p className="mt-1 font-semibold text-text">{snapshot.confidence.label}</p>
        </div>
        <div className="rounded-xl bg-surface-muted px-3 py-2">
          <p className="text-xs text-text-muted">Triage</p>
          <p className="mt-1 font-semibold text-text">{snapshot.triage.display}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <div>
          <p className="text-xs text-text-muted">Primary Clinical Impression</p>
          <p className="font-medium text-text">{snapshot.primaryClinicalImpression}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Primary Recommendation</p>
          <p className="font-medium text-text">{snapshot.primaryRecommendation}</p>
        </div>
      </div>

      <Link
        to={`/patients/${patientId}/intelligence`}
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100"
      >
        View Patient Intelligence →
      </Link>
    </Card>
  )
}
