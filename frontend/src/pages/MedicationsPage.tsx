import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { patients } from '@/data/patients'
import {
  MEDICATION_MASTER,
  addTimelineEvent,
  createId,
  nowTimestamp,
  readWorkspace,
  syncPatientFromWorkspace,
  type DurationUnit,
  type MedicationStatus,
  type PatientWorkspaceData,
  type WorkspaceMedication,
  writeWorkspace,
} from '@/lib/patientWorkspace'

const durationUnits: DurationUnit[] = ['Days', 'Weeks', 'Months']

export function MedicationsPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState<PatientWorkspaceData | null>(null)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    strength: '',
    route: '',
    dose: '',
    frequency: '',
    duration: '',
    durationUnit: 'Days' as DurationUnit,
    instructions: '',
    additionalInstructions: '',
    status: 'Active' as MedicationStatus,
    attachmentName: '',
    attachmentDataUrl: '',
  })

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

  const suggestions = useMemo(() => {
    const next = query.trim().toLowerCase()
    if (!next) return MEDICATION_MASTER
    return MEDICATION_MASTER.filter((item) => item.name.toLowerCase().includes(next))
  }, [query])

  const filtered = useMemo(() => {
    const next = search.trim().toLowerCase()
    if (!next) return workspace.medications
    return workspace.medications.filter((item) => item.name.toLowerCase().includes(next) || item.instructions.toLowerCase().includes(next))
  }, [workspace.medications, search])

  function clearForm() {
    setEditingId(null)
    setQuery('')
    setForm({
      name: '',
      strength: '',
      route: '',
      dose: '',
      frequency: '',
      duration: '',
      durationUnit: 'Days',
      instructions: '',
      additionalInstructions: '',
      status: 'Active',
      attachmentName: '',
      attachmentDataUrl: '',
    })
  }

  function openEdit(item: WorkspaceMedication) {
    setEditingId(item.id)
    setQuery(item.name)
    setForm({
      name: item.name,
      strength: item.strength,
      route: item.route,
      dose: item.dose,
      frequency: item.frequency,
      duration: item.duration,
      durationUnit: item.durationUnit,
      instructions: item.instructions,
      additionalInstructions: item.additionalInstructions,
      status: item.status,
      attachmentName: item.attachmentName || '',
      attachmentDataUrl: item.attachmentDataUrl || '',
    })
  }

  function uploadFile(file?: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        attachmentName: file.name,
        attachmentDataUrl: typeof reader.result === 'string' ? reader.result : '',
      }))
    }
    reader.readAsDataURL(file)
  }

  function saveMedication() {
    const name = form.name.trim() || query.trim()
    if (!name) return

    const medication: WorkspaceMedication = {
      id: editingId || createId('med'),
      name,
      strength: form.strength.trim(),
      route: form.route.trim(),
      dose: form.dose.trim(),
      frequency: form.frequency.trim(),
      duration: form.duration.trim(),
      durationUnit: form.durationUnit,
      instructions: form.instructions.trim(),
      additionalInstructions: form.additionalInstructions.trim(),
      status: form.status,
      lastModified: nowTimestamp(),
      attachmentName: form.attachmentName || undefined,
      attachmentDataUrl: form.attachmentDataUrl || undefined,
    }

    setWorkspace((current) => {
      if (!current) return current
      const medications = editingId
        ? current.medications.map((item) => (item.id === editingId ? medication : item))
        : [medication, ...current.medications]

      return addTimelineEvent(
        {
          ...current,
          medications,
        },
        {
          title: `${medication.name} ${editingId ? 'Updated' : 'Added'}`,
          module: 'Medications',
          details: `${medication.dose || 'Dose NA'} · ${medication.frequency || 'Frequency NA'} · ${medication.status}`,
          major: true,
          attachmentName: medication.attachmentName,
          attachmentDataUrl: medication.attachmentDataUrl,
        },
      )
    })

    clearForm()
  }

  function deleteMedication(id: string) {
    setWorkspace((current) => {
      if (!current) return current
      return {
        ...current,
        medications: current.medications.filter((item) => item.id !== id),
      }
    })
  }

  function toggleStatus(id: string, status: MedicationStatus) {
    setWorkspace((current) => {
      if (!current) return current
      const medications = current.medications.map((item) => (item.id === id ? { ...item, status, lastModified: nowTimestamp() } : item))
      return addTimelineEvent(
        {
          ...current,
          medications,
        },
        {
          title: `Medication ${status === 'Stopped' ? 'Stopped' : 'Restarted'}`,
          module: 'Medications',
          details: medications.find((item) => item.id === id)?.name || 'Medication updated',
          major: true,
        },
      )
    })
  }

  const activeCount = workspace.medications.filter((item) => item.status === 'Active').length
  const stoppedCount = workspace.medications.filter((item) => item.status === 'Stopped').length

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-6">
        <header className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="md" onClick={() => navigate(`/patients/${patient.id}/intelligence`)}>Back</Button>
          <h1 className="text-lg font-semibold text-text">Medications</h1>
          <Button size="md" onClick={clearForm}>New</Button>
        </header>

        <Card>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className="text-sm font-medium text-text">Search Medications</label>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by medication or instruction"
                className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text"
              />
            </div>
            <div className="rounded-xl bg-surface-muted px-3 py-3 text-xs font-semibold text-text-muted">
              Active {activeCount} · Stopped {stoppedCount}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text">Medication Master</label>
              <input
                value={query}
                onChange={(event) => {
                  const next = event.target.value
                  setQuery(next)
                  setForm((current) => ({ ...current, name: next }))
                }}
                placeholder="Search medication"
                className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text"
              />
              <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-border bg-surface-muted">
                {suggestions.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="flex w-full flex-col items-start gap-1 border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-white"
                    onClick={() => {
                      setQuery(item.name)
                      setForm((current) => ({
                        ...current,
                        name: item.name,
                        strength: current.strength || item.strengths[0],
                        route: current.route || item.routes[0],
                      }))
                    }}
                  >
                    <span className="font-medium text-text">{item.name}</span>
                    <span className="text-xs text-text-muted">{item.strengths.join(' · ')} · {item.routes.join(' · ')}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-text">Strength</label>
                <input value={form.strength} onChange={(event) => setForm((current) => ({ ...current, strength: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Route</label>
                <input value={form.route} onChange={(event) => setForm((current) => ({ ...current, route: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Dose</label>
                <input value={form.dose} onChange={(event) => setForm((current) => ({ ...current, dose: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Frequency</label>
                <input value={form.frequency} onChange={(event) => setForm((current) => ({ ...current, frequency: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Duration</label>
                <input value={form.duration} onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Duration Unit</label>
                <select value={form.durationUnit} onChange={(event) => setForm((current) => ({ ...current, durationUnit: event.target.value as DurationUnit }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text">
                  {durationUnits.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text">Instructions</label>
              <input value={form.instructions} onChange={(event) => setForm((current) => ({ ...current, instructions: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
            </div>
            <div>
              <label className="text-sm font-medium text-text">Additional Instructions</label>
              <input value={form.additionalInstructions} onChange={(event) => setForm((current) => ({ ...current, additionalInstructions: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text hover:bg-surface-muted">
                Attach Prescription Image
                <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadFile(event.target.files?.[0] ?? null)} />
              </label>
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as MedicationStatus }))} className="min-h-12 rounded-xl border border-border bg-white px-4 text-sm text-text">
                <option value="Active">Active</option>
                <option value="Stopped">Stopped</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button fullWidth onClick={saveMedication}>{editingId ? 'Update Medication' : 'Add Medication'}</Button>
              <Button variant="secondary" fullWidth onClick={clearForm}>Cancel</Button>
            </div>

            {form.attachmentDataUrl ? <img src={form.attachmentDataUrl} alt={form.attachmentName || 'Medication attachment'} className="max-h-52 rounded-xl border border-border object-cover" /> : null}
          </div>
        </Card>

        <section className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text">{item.name}</p>
                    <p className="text-xs text-text-muted">{item.status} · {item.lastModified}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="md" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="ghost" size="md" onClick={() => deleteMedication(item.id)}>Delete</Button>
                  </div>
                </div>
                <p className="text-sm text-text-muted">{item.strength} · {item.dose} · {item.frequency} · {item.route}</p>
                <p className="text-xs text-text-muted">{item.instructions || 'No instructions'}</p>
                <div className="flex flex-wrap gap-2">
                  {item.status === 'Active' ? (
                    <Button variant="secondary" size="md" onClick={() => toggleStatus(item.id, 'Stopped')}>Stop Medication</Button>
                  ) : (
                    <Button variant="secondary" size="md" onClick={() => toggleStatus(item.id, 'Active')}>Restart Medication</Button>
                  )}
                </div>
                {item.attachmentDataUrl ? <img src={item.attachmentDataUrl} alt={item.attachmentName || 'Medication attachment'} className="max-h-52 rounded-xl border border-border object-cover" /> : null}
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppLayout>
  )
}
