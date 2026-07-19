import { useMemo, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { patients } from '@/data/patients'
import { buildPatientIntelligence } from '@/data/patientIntelligence'
import { computeTriageForPatient } from '@/lib/triage'
import { PatientIntelligenceCard } from '@/components/ai/PatientIntelligenceCard'

const userName = 'Dr. Ananya Sharma'
const hospitalName = 'City General Hospital'

export function PatientsPage() {
  const [search, setSearch] = useState('')
  const [workflowFilter, setWorkflowFilter] = useState('All')

  const workflowFilters = ['All', 'OPD', 'IPD', 'Ward', 'ICU', 'Emergency'] as const

  const filteredPatients = useMemo(() => {
    return patients
      .filter((patient) => {
        const query = search.trim().toLowerCase()
        const matchesSearch =
          !query ||
          patient.name.toLowerCase().includes(query) ||
          patient.id.toLowerCase().includes(query) ||
          patient.careSetting.toLowerCase().includes(query) ||
          patient.room.toLowerCase().includes(query)

        const matchesWorkflow =
          workflowFilter === 'All' ||
          patient.careSetting === workflowFilter ||
          (workflowFilter === 'Ward' && (patient.room.toLowerCase().includes('ward') || patient.careSetting === 'IPD'))

        return matchesSearch && matchesWorkflow
      })
      .map((patient) => {
        const triage = computeTriageForPatient(patient)
        const snapshot = buildPatientIntelligence(patient, triage.level)

        return { patient, snapshot }
      })
  }, [search, workflowFilter])

  return (
    <AppLayout>
      <div className="flex flex-col gap-3">
        <header className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <img src="/klinimate-icon.png" alt="Klinimate" className="h-7 w-7 object-contain" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-text">Welcome {userName}</div>
                <div className="truncate text-xs text-text-muted">{hospitalName}</div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" />
              Online
            </div>
          </div>
        </header>

        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <input
            aria-label="Search patients"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search patients"
            className="min-h-12 w-full rounded-xl border border-border bg-surface-muted px-4 text-sm text-text outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {workflowFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setWorkflowFilter(filter)}
                className={[
                  'rounded-full px-3 py-2 text-xs font-semibold transition-colors',
                  workflowFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-muted text-text-muted hover:bg-primary-50 hover:text-primary-700',
                ].join(' ')}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          {filteredPatients.map(({ patient, snapshot }) => (
            <PatientIntelligenceCard key={patient.id} patient={patient} snapshot={snapshot} compact />
          ))}
        </section>
      </div>
    </AppLayout>
  )
}
