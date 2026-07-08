import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { patients } from '@/data/patients'

const statusStyles: Record<string, string> = {
  Admitted: 'bg-primary-50 text-primary-700',
  Observation: 'bg-amber-50 text-amber-700',
  Critical: 'bg-rose-50 text-rose-700',
  Discharged: 'bg-emerald-50 text-emerald-700',
}

export function PatientsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [priority, setPriority] = useState('All')

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const query = search.trim().toLowerCase()
      const matchesSearch =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.department.toLowerCase().includes(query)

      const matchesStatus = status === 'All' || patient.status === status
      const matchesPriority = priority === 'All' || patient.priority === priority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [priority, search, status])

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">Patient Management</h1>
            <p className="mt-1 text-sm text-text-muted">
              Search, review, and update patient care
            </p>
          </div>
          <Link to="/patients/new">
            <Button size="md">+ Add</Button>
          </Link>
        </header>

        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3">
            <input
              aria-label="Search patients"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, ID, or department"
              className="min-h-12 rounded-xl border border-border bg-surface-muted px-4 text-sm text-text outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium text-text">
                Status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="min-h-11 rounded-xl border border-border bg-white px-3 text-sm text-text"
                >
                  <option value="All">All</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Observation">Observation</option>
                  <option value="Critical">Critical</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-text">
                Priority
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="min-h-11 rounded-xl border border-border bg-white px-3 text-sm text-text"
                >
                  <option value="All">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          {filteredPatients.map((patient) => (
            <Link key={patient.id} to={`/patients/${patient.id}`}>
              <Card>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text">{patient.name}</p>
                      <p className="mt-0.5 text-sm text-text-muted">
                        {patient.id} · {patient.department}
                      </p>
                    </div>
                    <span
                      className={[
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        statusStyles[patient.status],
                      ].join(' ')}
                    >
                      {patient.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-text-muted">
                    <span>{patient.chiefComplaint}</span>
                    <span>{patient.lastUpdated}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </AppLayout>
  )
}
