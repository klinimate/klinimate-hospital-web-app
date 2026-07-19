import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { patients } from '@/data/patients'
import {
  addTimelineEvent,
  createId,
  nowTimestamp,
  readWorkspace,
  syncPatientFromWorkspace,
  type PatientWorkspaceData,
  type WorkspaceVitals,
  writeWorkspace,
} from '@/lib/patientWorkspace'

export function VitalsPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState<PatientWorkspaceData | null>(null)
  const [form, setForm] = useState({
    bpSystolic: '',
    bpDiastolic: '',
    pulse: '',
    spo2: '',
    respiratoryRate: '',
    bloodSugar: '',
    urineOutput: '',
    temperature: '',
    consciousness: '',
    painScore: '',
    note: '',
  })
  const [search, setSearch] = useState('')

  const patient = patients.find((entry) => entry.id === patientId)

  useEffect(() => {
    if (!patient) return
    setWorkspace(readWorkspace(patient))
  }, [patient])

  useEffect(() => {
    if (!patient || !workspace) return
    writeWorkspace(patient.id, workspace)
    syncPatientFromWorkspace(patient, workspace)
  }, [patient, workspace])

  if (!patient || !workspace) {
    return (
      <AppLayout>
        <div className="rounded-2xl bg-white p-5 text-sm text-text-muted shadow-sm">Patient not found.</div>
      </AppLayout>
    )
  }

  const latestVitals = useMemo(() => workspace.vitals[0], [workspace.vitals])

  const filteredVitals = useMemo(() => {
    const next = search.trim().toLowerCase()
    if (!next) return workspace.vitals
    return workspace.vitals.filter((item) => {
      const bp = `${item.bpSystolic}/${item.bpDiastolic}`
      return (
        bp.toLowerCase().includes(next) ||
        item.pulse.toLowerCase().includes(next) ||
        item.spo2.toLowerCase().includes(next) ||
        item.respiratoryRate.toLowerCase().includes(next) ||
        item.bloodSugar.toLowerCase().includes(next) ||
        item.urineOutput.toLowerCase().includes(next)
      )
    })
  }, [workspace.vitals, search])

  function clearForm() {
    setForm({
      bpSystolic: '',
      bpDiastolic: '',
      pulse: '',
      spo2: '',
      respiratoryRate: '',
      bloodSugar: '',
      urineOutput: '',
      temperature: '',
      consciousness: '',
      painScore: '',
      note: '',
    })
  }

  function saveVital() {
    if (!form.bpSystolic.trim() || !form.bpDiastolic.trim() || !form.pulse.trim()) return

    const vital: WorkspaceVitals = {
      id: createId('vital'),
      timestamp: nowTimestamp(),
      bpSystolic: form.bpSystolic.trim(),
      bpDiastolic: form.bpDiastolic.trim(),
      pulse: form.pulse.trim(),
      spo2: form.spo2.trim(),
      respiratoryRate: form.respiratoryRate.trim(),
      bloodSugar: form.bloodSugar.trim(),
      urineOutput: form.urineOutput.trim(),
      temperature: form.temperature.trim(),
      consciousness: form.consciousness.trim(),
      painScore: form.painScore.trim(),
    }

    setWorkspace((current) => {
      if (!current) return current
      return addTimelineEvent(
        {
          ...current,
          vitals: [vital, ...current.vitals],
        },
        {
          title: 'Vitals Updated',
          module: 'Vitals',
          details: `BP ${vital.bpSystolic}/${vital.bpDiastolic} · Pulse ${vital.pulse}`,
          major: false,
        },
      )
    })

    clearForm()
  }

  function deleteVital(id: string) {
    setWorkspace((current) => {
      if (!current) return current
      return {
        ...current,
        vitals: current.vitals.filter((item) => item.id !== id),
      }
    })
  }

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-6">
        <header className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="md" onClick={() => navigate(`/patients/${patient.id}/intelligence`)}>Back</Button>
          <h1 className="text-lg font-semibold text-text">Vitals</h1>
          <Button size="md" onClick={clearForm}>Reset Form</Button>
        </header>

        <Card>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">BP</p>
              <p className="mt-1 text-lg font-semibold text-text">{latestVitals ? `${latestVitals.bpSystolic}/${latestVitals.bpDiastolic}` : 'Not recorded'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Pulse</p>
              <p className="mt-1 text-lg font-semibold text-text">{latestVitals?.pulse || 'Not recorded'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">SpO2</p>
              <p className="mt-1 text-lg font-semibold text-text">{latestVitals?.spo2 || 'Not recorded'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">RR</p>
              <p className="mt-1 text-lg font-semibold text-text">{latestVitals?.respiratoryRate || 'Not recorded'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Urine Output</p>
              <p className="mt-1 text-lg font-semibold text-text">{latestVitals?.urineOutput || 'Not recorded'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Blood Sugar</p>
              <p className="mt-1 text-lg font-semibold text-text">{latestVitals?.bloodSugar || 'Not recorded'}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-text">BP Systolic</label>
                <input value={form.bpSystolic} onChange={(event) => setForm((current) => ({ ...current, bpSystolic: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">BP Diastolic</label>
                <input value={form.bpDiastolic} onChange={(event) => setForm((current) => ({ ...current, bpDiastolic: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Pulse</label>
                <input value={form.pulse} onChange={(event) => setForm((current) => ({ ...current, pulse: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">SpO2</label>
                <input value={form.spo2} onChange={(event) => setForm((current) => ({ ...current, spo2: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Respiratory Rate</label>
                <input value={form.respiratoryRate} onChange={(event) => setForm((current) => ({ ...current, respiratoryRate: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Blood Sugar</label>
                <input value={form.bloodSugar} onChange={(event) => setForm((current) => ({ ...current, bloodSugar: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Urine Output</label>
                <input value={form.urineOutput} onChange={(event) => setForm((current) => ({ ...current, urineOutput: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Temperature</label>
                <input value={form.temperature} onChange={(event) => setForm((current) => ({ ...current, temperature: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Pain Score</label>
                <input value={form.painScore} onChange={(event) => setForm((current) => ({ ...current, painScore: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-sm font-medium text-text">Consciousness / Note</label>
                <input value={form.consciousness} onChange={(event) => setForm((current) => ({ ...current, consciousness: event.target.value }))} placeholder="AVPU / GCS" className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-sm font-medium text-text">Additional Note</label>
                <input value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
            </div>
            <Button fullWidth onClick={saveVital}>Save Vital</Button>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-text">Search History</label>
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
            </div>
            {filteredVitals.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-white px-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-text">BP {item.bpSystolic}/{item.bpDiastolic} · Pulse {item.pulse}</p>
                  <p className="text-xs text-text-muted">SpO2 {item.spo2} · RR {item.respiratoryRate} · Sugar {item.bloodSugar}</p>
                  <p className="text-xs text-text-muted">{item.timestamp}</p>
                </div>
                <Button variant="ghost" size="md" onClick={() => deleteVital(item.id)}>Delete</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
