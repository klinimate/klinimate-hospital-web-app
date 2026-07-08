import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { patients } from '@/data/patients'
import { computeTriageForPatient } from '@/lib/triage'
import { TriageCard } from '@/components/ui/TriageCard'

const demographicFields = [
  { label: 'ID', value: 'id' },
  { label: 'Room', value: 'room' },
  { label: 'Blood group', value: 'bloodGroup' },
  { label: 'Emergency contact', value: 'emergencyContact' },
]

const vitalsConfig = [
  { key: 'bp', label: 'BP' },
  { key: 'pulse', label: 'Pulse' },
  { key: 'temperature', label: 'Temp' },
  { key: 'respiratoryRate', label: 'Resp.' },
  { key: 'spo2', label: 'SpO2' },
  { key: 'bloodSugar', label: 'Sugar' },
] as const

export function PatientDetailsPage() {
  const { patientId } = useParams()
  const [alertSent, setAlertSent] = useState<string | null>(null)

  const patient = useMemo(
    () => patients.find((entry) => entry.id === patientId),
    [patientId],
  )

  const triage = useMemo(() => {
    if (!patient) return null
    return computeTriageForPatient(patient)
  }, [patient])

  useEffect(() => {
    if (!triage || !patient) return
    // Auto-notify for YELLOW, RED, BLACK patients
    if (triage.level !== 'GREEN') {
      const key = 'klinimate-alerts'
      const raw = window.localStorage.getItem(key)
      const alerts = raw ? JSON.parse(raw) : []
      // avoid duplicate alerts for same patient+level within this session
      const exists = alerts.find((a: any) => a.patientId === patient.id && a.level === triage.level)
      if (!exists) {
        const entry = {
          patientId: patient.id,
          level: triage.level,
          message: triage.alertMessage || `${triage.level} alert`,
          time: new Date().toISOString(),
        }
        alerts.push(entry)
        window.localStorage.setItem(key, JSON.stringify(alerts))
        setAlertSent(entry.message)
        // also log to console to simulate notification
        // (real integration would call backend/notification service)
        // eslint-disable-next-line no-console
        console.info('Klinimate alert generated', entry)
      } else {
        setAlertSent(exists.message)
      }
    }
  }, [triage, patient])

  if (!patient) {
    return (
      <AppLayout>
        <div className="rounded-2xl bg-white p-5 text-sm text-text-muted shadow-sm">
          Patient not found.
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 pb-6">
        <header className="rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary-700">{patient.id}</p>
              <h1 className="mt-2 text-2xl font-semibold text-text">{patient.name}</h1>
              <p className="mt-1 text-sm text-text-muted">
                {patient.age} yrs · {patient.gender} · {patient.department}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                {patient.status}
              </span>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted">
                Last updated {patient.lastUpdated}
              </span>
            </div>
          </div>
        </header>

        {triage ? (
          <div>
            <TriageCard colorClass={triage.colorClass} label={triage.label} level={triage.level} alertMessage={alertSent || triage.alertMessage}>
              <p className="text-sm text-white/90">{triage.recommendedActions[0]}</p>
            </TriageCard>
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-[1fr_0.9fr]">
          <div className="space-y-3">
            <Card>
              <div className="grid gap-3 sm:grid-cols-2">
                {demographicFields.map(({ label, value }) => (
                  <div key={value}>
                    <p className="text-sm text-text-muted">{label}</p>
                    <p className="mt-1 text-sm font-medium text-text">
                      {patient[value as keyof typeof patient] as string}
                    </p>
                  </div>
                ))}
                <div>
                  <p className="text-sm text-text-muted">Priority</p>
                  <p className="mt-1 text-sm font-medium text-text">
                    {patient.priority}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Chief complaint</p>
                  <p className="mt-1 text-sm font-medium text-text">
                    {patient.chiefComplaint}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-text">Presenting complaint</h2>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {patient.presentingComplaint}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text">History</h2>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {patient.history}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text">Allergies</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {patient.allergies.length ? (
                      patient.allergies.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-text-muted">No known allergies</span>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text">Diagnosis</h2>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {patient.diagnosis}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <Card>
              <h2 className="text-sm font-semibold text-text">Vitals</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {vitalsConfig.map(({ key, label }) => (
                  <div key={key} className="rounded-3xl bg-surface-muted p-3">
                    <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-text">
                      {patient.vitals[key as keyof typeof patient.vitals]}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-text">AI Clinical Summary</h2>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {patient.aiSummary}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              Vitals timeline
            </h2>
            <span className="text-xs text-text-muted">Recent updates</span>
          </div>
          <Card>
            <div className="space-y-3">
              {patient.vitalsTimeline.map((snapshot) => (
                <div key={snapshot.time} className="grid gap-2 rounded-3xl border border-border bg-surface-muted p-3 sm:grid-cols-[1fr_1fr]">
                  <div>
                    <p className="text-sm font-semibold text-text">{snapshot.time}</p>
                    <p className="mt-1 text-xs text-text-muted">BP {snapshot.bp} · Pulse {snapshot.pulse}</p>
                  </div>
                  <div className="grid gap-1 text-sm text-text-muted">
                    <span>Temp {snapshot.temperature}</span>
                    <span>RR {snapshot.respiratoryRate}</span>
                    <span>SpO2 {snapshot.spo2}</span>
                    <span>Sugar {snapshot.bloodSugar}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <Card>
            <h2 className="text-sm font-semibold text-text">Medications</h2>
            <div className="mt-3 space-y-3">
              {patient.medications.map((med) => (
                <div key={med.name} className="rounded-3xl bg-surface-muted p-3">
                  <p className="font-medium text-text">{med.name}</p>
                  <p className="mt-1 text-sm text-text-muted">
                    {med.dose} · {med.frequency} · {med.route}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-text">Investigations</h2>
            <div className="mt-3 space-y-3">
              {patient.investigations.map((investigation) => (
                <div key={investigation.title} className="rounded-3xl bg-surface-muted p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-text">{investigation.title}</p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-text-muted border border-border">
                      {investigation.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-muted">{investigation.result}</p>
                  <p className="mt-1 text-xs text-text-muted">Updated {investigation.updated}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <Card>
            <h2 className="text-sm font-semibold text-text">Consultant recommendations</h2>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              {patient.recommendations.map((recommendation) => (
                <li key={recommendation} className="rounded-3xl bg-surface-muted px-3 py-2">
                  {recommendation}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-text">Clinical notes</h2>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              {patient.notes.map((note) => (
                <li key={note} className="rounded-3xl bg-surface-muted px-3 py-2">
                  {note}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button size="lg" fullWidth>
            Add Note
          </Button>
          <Button variant="secondary" size="lg" fullWidth>
            Escalate Case
          </Button>
        </section>
      </div>
    </AppLayout>
  )
}

