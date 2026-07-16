import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import DailyProgressRound from '@/components/ai/DailyProgressRound'
import { PatientIntelligenceCard } from '@/components/ai/PatientIntelligenceCard'
import { patients } from '@/data/patients'
import { computeTriageForPatient } from '@/lib/triage'
import { buildPatientIntelligence } from '@/data/patientIntelligence'
import { TriageCard } from '@/components/ui/TriageCard'

export function PatientDashboard() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)

  const patient = useMemo(() => patients.find((p) => p.id === patientId), [patientId])
  const triage = useMemo(() => (patient ? computeTriageForPatient(patient) : null), [patient])
  const intelligence = useMemo(
    () => (patient && triage ? buildPatientIntelligence(patient, triage.level) : null),
    [patient, triage],
  )

  if (!patient) {
    return (
      <AppLayout>
        <div className="rounded-2xl bg-white p-5 text-sm text-text-muted shadow-sm">Patient not found.</div>
      </AppLayout>
    )
  }
  const parseNumber = (v?: string) => {
    if (!v) return NaN
    const m = v.match(/-?\d+/)
    return m ? Number(m[0]) : NaN
  }

  const latest = patient.vitalsTimeline[patient.vitalsTimeline.length - 1]
  const prev = patient.vitalsTimeline[patient.vitalsTimeline.length - 2]

  function trend(latestVal?: string, prevVal?: string) {
    const latestN = parseNumber(latestVal)
    const prevN = parseNumber(prevVal)
    if (Number.isNaN(latestN) || Number.isNaN(prevN)) return { symbol: '→', className: 'text-text-muted' }
    if (latestN > prevN) return { symbol: '↑', className: 'text-rose-600' }
    if (latestN < prevN) return { symbol: '↓', className: 'text-emerald-600' }
    return { symbol: '→', className: 'text-text-muted' }
  }

  function pushAlert(level: string, note?: string) {
    if (!patient) {
      setMessage('Patient not found')
      return
    }
    const key = 'klinimate-alerts'
    const raw = window.localStorage.getItem(key)
    const alerts = raw ? JSON.parse(raw) : []
    const entry = { patientId: patient.id, level, message: note || `${level} notification`, time: new Date().toISOString() }
    alerts.push(entry)
    window.localStorage.setItem(key, JSON.stringify(alerts))
    setMessage(entry.message)
  }

  function handleAddVitals() {
    if (!patient) return
    const bp = window.prompt('BP (e.g. 120/80)') || ''
    const pulse = window.prompt('Pulse (bpm)') || ''
    const temperature = window.prompt('Temperature (°C)') || ''
    const respiratoryRate = window.prompt('Respiratory rate (/min)') || ''
    const spo2 = window.prompt('SpO2 (%)') || ''
    const bloodSugar = window.prompt('Blood sugar') || ''
    const snapshot = { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), bp, pulse, temperature, respiratoryRate, spo2, bloodSugar }
    patient.vitalsTimeline.push(snapshot)
    patient.vitals = { bp, pulse, temperature, respiratoryRate, spo2, bloodSugar }
    setMessage('Vitals added')
    // auto-check triage and notify if needed
    const newTriage = computeTriageForPatient(patient)
    if (newTriage.level !== 'GREEN') pushAlert(newTriage.level, newTriage.alertMessage)
  }

  function handleAddNote() {
    if (!patient) return
    const note = window.prompt('Enter note (short)') || ''
    if (!note) return
    patient.notes.unshift(note)
    setMessage('Note added')
  }

  function handleOrderInvestigation() {
    if (!patient) return
    const title = window.prompt('Investigation title') || ''
    if (!title) return
    patient.investigations.unshift({ title, status: 'Requested', result: 'Pending', updated: 'Just now' })
    setMessage('Investigation ordered')
  }

  function handlePrescribeMedication() {
    if (!patient) return
    const name = window.prompt('Medication name') || ''
    if (!name) return
    const dose = window.prompt('Dose (e.g. 500 mg)') || ''
    const freq = window.prompt('Frequency (e.g. Once daily)') || ''
    const route = window.prompt('Route (oral, iv, sc)') || ''
    patient.medications.unshift({ name, dose, frequency: freq, route })
    setMessage('Medication prescribed')
  }


  function handleDischarge() {
    if (!patient) return
    if (!window.confirm('Confirm discharge patient?')) return
    patient.status = 'Discharged'
    setMessage('Patient discharged')
    navigate('/patients')
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 pb-6">
        {intelligence ? <PatientIntelligenceCard patientId={patient.id} snapshot={intelligence} /> : null}

        {/* Patient header */}
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-text">{patient.name}</h1>
              <p className="mt-1 text-sm text-text-muted">{patient.age} yrs · {patient.gender}</p>
              <p className="mt-1 text-sm text-text-muted">UHID {patient.id}</p>
              <p className="mt-1 text-sm text-text-muted">{patient.room}</p>
            </div>
            <div className="text-right text-sm text-text-muted">
              <div>Admitted: {patient.lastUpdated}</div>
              <div>Consultant: {patient.recommendations?.[0] ? 'See notes' : '—'}</div>
              <div>Diagnosis: {patient.diagnosis}</div>
            </div>
          </div>
        </Card>

        {triage ? (
          <TriageCard colorClass={triage.colorClass} label={triage.label} level={triage.level} alertMessage={triage.alertMessage}>
            <p className="text-sm text-white/90">{triage.recommendedActions[0]}</p>
          </TriageCard>
        ) : null}

        <section className="space-y-3">
          <DailyProgressRound patient={patient} />

          <Card>
            <h2 className="text-sm font-semibold text-text">Latest Vitals</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-surface-muted p-3">
                <p className="text-xs text-text-muted">BP</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <p className="text-lg font-semibold text-text">{latest?.bp || patient.vitals.bp}</p>
                  <span className={trend(latest?.bp, prev?.bp).className}>{trend(latest?.bp, prev?.bp).symbol}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-surface-muted p-3">
                <p className="text-xs text-text-muted">Pulse</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <p className="text-lg font-semibold text-text">{latest?.pulse || patient.vitals.pulse}</p>
                  <span className={trend(latest?.pulse, prev?.pulse).className}>{trend(latest?.pulse, prev?.pulse).symbol}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-surface-muted p-3">
                <p className="text-xs text-text-muted">Resp Rate</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <p className="text-lg font-semibold text-text">{latest?.respiratoryRate || patient.vitals.respiratoryRate}</p>
                  <span className={trend(latest?.respiratoryRate, prev?.respiratoryRate).className}>{trend(latest?.respiratoryRate, prev?.respiratoryRate).symbol}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-surface-muted p-3">
                <p className="text-xs text-text-muted">Temp</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <p className="text-lg font-semibold text-text">{latest?.temperature || patient.vitals.temperature}</p>
                  <span className={trend(latest?.temperature, prev?.temperature).className}>{trend(latest?.temperature, prev?.temperature).symbol}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-surface-muted p-3">
                <p className="text-xs text-text-muted">SpO₂</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <p className="text-lg font-semibold text-text">{latest?.spo2 || patient.vitals.spo2}</p>
                  <span className={trend(latest?.spo2, prev?.spo2).className}>{trend(latest?.spo2, prev?.spo2).symbol}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-surface-muted p-3">
                <p className="text-xs text-text-muted">Sugar</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <p className="text-lg font-semibold text-text">{latest?.bloodSugar || patient.vitals.bloodSugar}</p>
                  <span className={trend(latest?.bloodSugar, prev?.bloodSugar).className}>{trend(latest?.bloodSugar, prev?.bloodSugar).symbol}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-text">Clinical concerns</h3>
            <p className="mt-2 text-sm text-text-muted">{patient.chiefComplaint}</p>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold text-text">Investigations</h3>
              <div className="mt-2 space-y-2">
                {patient.investigations.map((inv) => (
                  <div key={inv.title} className="rounded-xl bg-surface-muted px-3 py-2 text-sm text-text-muted">
                    <div className="flex items-center justify-between">
                      <div>{inv.title}</div>
                      <div className="text-xs">{inv.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-text">Medications</h3>
              <div className="mt-2 space-y-2">
                {patient.medications.map((med) => (
                  <div key={med.name} className="rounded-xl bg-surface-muted px-3 py-2 text-sm text-text-muted">
                    <div className="font-medium text-text">{med.name}</div>
                    <div className="text-xs">{med.dose} · {med.frequency}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-sm font-semibold text-text">Progress notes</h3>
            <ul className="mt-2 space-y-2 text-sm text-text-muted">
              {patient.notes.map((n) => (
                <li key={n} className="rounded-xl bg-surface-muted px-3 py-2">{n}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-text">Consultant recommendations</h3>
            <ul className="mt-2 space-y-2 text-sm text-text-muted">
              {patient.recommendations.map((r) => (
                <li key={r} className="rounded-xl bg-surface-muted px-3 py-2">{r}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-text">Timeline</h3>
            <div className="mt-2 space-y-2 text-sm text-text-muted">
              {patient.vitalsTimeline.map((s) => (
                <div key={s.time} className="rounded-xl bg-white px-3 py-2 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{s.time}</div>
                    <div className="text-xs">BP {s.bp} · P {s.pulse}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <Button size="lg" fullWidth onClick={handleAddVitals}>Add Vitals</Button>
            <Button size="lg" fullWidth onClick={handleAddNote}>Add Clinical Note</Button>
            <Button size="lg" fullWidth onClick={handleOrderInvestigation}>Order Investigation</Button>
            <Button size="lg" fullWidth onClick={handlePrescribeMedication}>Prescribe Medication</Button>
            <Button size="lg" fullWidth onClick={() => pushAlert('RED', 'Manual notify by bedside team')}>Notify Klinimate Intensivist</Button>
            <Button size="lg" fullWidth onClick={() => pushAlert('RED', 'Referral initiated')}>Refer Patient</Button>
            <Button variant="secondary" size="lg" fullWidth onClick={handleDischarge}>Discharge Patient</Button>
          </div>

          {message ? <div className="mt-2 text-sm text-text-muted">{message}</div> : null}
        </section>
      </div>
    </AppLayout>
  )
}
