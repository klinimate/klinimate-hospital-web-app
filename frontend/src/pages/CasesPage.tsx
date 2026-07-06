import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/Card'

const cases = [
  {
    id: 'CASE-1042',
    patient: 'Ramesh Patel',
    complaint: 'Breathlessness',
    status: 'Active',
    updated: '12 min ago',
  },
  {
    id: 'CASE-1038',
    patient: 'Sunita Devi',
    complaint: 'Chest Pain',
    status: 'Awaiting Review',
    updated: '1 hr ago',
  },
  {
    id: 'CASE-1031',
    patient: 'Vikram Singh',
    complaint: 'Fever',
    status: 'Advice Received',
    updated: '3 hrs ago',
  },
] as const

const statusStyles: Record<string, string> = {
  Active: 'bg-primary-50 text-primary-700',
  'Awaiting Review': 'bg-amber-50 text-amber-700',
  'Advice Received': 'bg-emerald-50 text-emerald-700',
}

export function CasesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-5">
        <header>
          <h1 className="text-xl font-semibold text-text">Cases</h1>
          <p className="mt-1 text-sm text-text-muted">
            Track and manage clinical cases
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {cases.map((clinicalCase) => (
            <Card key={clinicalCase.id}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-text">{clinicalCase.patient}</p>
                    <p className="mt-0.5 text-sm text-text-muted">
                      {clinicalCase.id} · {clinicalCase.complaint}
                    </p>
                  </div>
                  <span
                    className={[
                      'rounded-full px-2.5 py-1 text-xs font-medium',
                      statusStyles[clinicalCase.status],
                    ].join(' ')}
                  >
                    {clinicalCase.status}
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  Updated {clinicalCase.updated}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
