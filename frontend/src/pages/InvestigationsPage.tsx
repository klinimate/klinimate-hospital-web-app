import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { patients } from '@/data/patients'
import {
  INVESTIGATION_MASTER,
  addTimelineEvent,
  createId,
  nowTimestamp,
  readWorkspace,
  syncPatientFromWorkspace,
  type InvestigationPriority,
  type InvestigationStatus,
  type PatientWorkspaceData,
  type WorkspaceInvestigation,
  writeWorkspace,
} from '@/lib/patientWorkspace'

const priorities: InvestigationPriority[] = ['Routine', 'Urgent', 'STAT']
const statuses: InvestigationStatus[] = ['Pending', 'Completed', 'Abnormal']

export function InvestigationsPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState<PatientWorkspaceData | null>(null)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    priority: 'Routine' as InvestigationPriority,
    status: 'Pending' as InvestigationStatus,
    clinicalIndication: '',
    remarks: '',
    attachmentName: '',
    attachmentDataUrl: '',
    aiSummary: '',
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
    if (!next) return INVESTIGATION_MASTER
    return INVESTIGATION_MASTER.filter((item) => item.toLowerCase().includes(next))
  }, [query])

  const filtered = useMemo(() => {
    const next = search.trim().toLowerCase()
    if (!next) return workspace.investigations
    return workspace.investigations.filter((item) => item.name.toLowerCase().includes(next) || item.clinicalIndication.toLowerCase().includes(next))
  }, [workspace.investigations, search])

  function clearForm() {
    setEditingId(null)
    setQuery('')
    setForm({
      name: '',
      priority: 'Routine',
      status: 'Pending',
      clinicalIndication: '',
      remarks: '',
      attachmentName: '',
      attachmentDataUrl: '',
      aiSummary: '',
    })
  }

  function openEdit(item: WorkspaceInvestigation) {
    setEditingId(item.id)
    setQuery(item.name)
    setForm({
      name: item.name,
      priority: item.priority,
      status: item.status,
      clinicalIndication: item.clinicalIndication,
      remarks: item.remarks,
      attachmentName: item.attachmentName || '',
      attachmentDataUrl: item.attachmentDataUrl || '',
      aiSummary: item.aiSummary || '',
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

  function summarizeReport() {
    setForm((current) => ({
      ...current,
      aiSummary: current.clinicalIndication
        ? `AI Summary: ${current.name} suggests focus on ${current.clinicalIndication.toLowerCase()}. Review with current vitals and treatment response.`
        : `AI Summary: ${current.name} report requires clinician correlation with current symptoms and vitals.`,
    }))
  }

  function saveInvestigation() {
    const nextName = form.name.trim() || query.trim()
    if (!nextName) return

    const record: WorkspaceInvestigation = {
      id: editingId || createId('inv'),
      name: nextName,
      priority: form.priority,
      status: form.status,
      clinicalIndication: form.clinicalIndication.trim(),
      remarks: form.remarks.trim(),
      lastUpdated: nowTimestamp(),
      attachmentName: form.attachmentName || undefined,
      attachmentDataUrl: form.attachmentDataUrl || undefined,
      aiSummary: form.aiSummary || undefined,
    }

    setWorkspace((current) => {
      if (!current) return current
      const investigations = editingId
        ? current.investigations.map((item) => (item.id === editingId ? record : item))
        : [record, ...current.investigations]

      return addTimelineEvent(
        {
          ...current,
          investigations,
        },
        {
          title: `${record.name} ${editingId ? 'Updated' : 'Ordered'}`,
          module: 'Investigations',
          details: `${record.priority} · ${record.status}`,
          major: true,
          attachmentName: record.attachmentName,
          attachmentDataUrl: record.attachmentDataUrl,
        },
      )
    })

    clearForm()
  }

  function removeInvestigation(id: string) {
    setWorkspace((current) => {
      if (!current) return current
      return {
        ...current,
        investigations: current.investigations.filter((item) => item.id !== id),
      }
    })
  }

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-6">
        <header className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="md" onClick={() => navigate(`/patients/${patient.id}/intelligence`)}>Back</Button>
          <h1 className="text-lg font-semibold text-text">Investigations</h1>
          <Button size="md" onClick={clearForm}>New</Button>
        </header>

        <Card>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className="text-sm font-medium text-text">Search ordered investigations</label>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or indication"
                className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div className="rounded-xl bg-surface-muted px-3 py-3 text-xs font-semibold text-text-muted">
              Pending {workspace.investigations.filter((item) => item.status === 'Pending').length} · Completed {workspace.investigations.filter((item) => item.status === 'Completed').length} · Abnormal {workspace.investigations.filter((item) => item.status === 'Abnormal').length}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text">Investigation Master</label>
              <input
                value={query}
                onChange={(event) => {
                  const next = event.target.value
                  setQuery(next)
                  setForm((current) => ({ ...current, name: next }))
                }}
                placeholder="Search investigation"
                className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-border bg-surface-muted">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="flex w-full items-center justify-between gap-3 border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-white"
                    onClick={() => {
                      setForm((current) => ({ ...current, name: item }))
                      setQuery(item)
                    }}
                  >
                    <span className="text-sm font-medium text-text">{item}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-text">Priority</label>
                <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as InvestigationPriority }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text">
                  {priorities.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text">Status</label>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as InvestigationStatus }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text">
                  {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text">Clinical Indication</label>
              <input value={form.clinicalIndication} onChange={(event) => setForm((current) => ({ ...current, clinicalIndication: event.target.value }))} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
            </div>

            <div>
              <label className="text-sm font-medium text-text">Remarks</label>
              <textarea value={form.remarks} onChange={(event) => setForm((current) => ({ ...current, remarks: event.target.value }))} rows={3} className="mt-1 min-h-24 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text hover:bg-surface-muted">
                Upload Report
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={(event) => uploadFile(event.target.files?.[0] ?? null)} />
              </label>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text hover:bg-surface-muted">
                Capture Report Photo
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => uploadFile(event.target.files?.[0] ?? null)} />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button fullWidth onClick={summarizeReport}>AI Summarize Report</Button>
              <Button variant="secondary" fullWidth onClick={saveInvestigation}>{editingId ? 'Update Investigation' : 'Order Investigation'}</Button>
            </div>

            {form.aiSummary ? <div className="rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-700">{form.aiSummary}</div> : null}
            {form.attachmentDataUrl ? <img src={form.attachmentDataUrl} alt={form.attachmentName || 'Report attachment'} className="max-h-52 rounded-xl border border-border object-cover" /> : null}
          </div>
        </Card>

        <section className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text">{item.name}</p>
                    <p className="text-xs text-text-muted">{item.priority} · {item.status} · {item.lastUpdated}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="md" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="ghost" size="md" onClick={() => removeInvestigation(item.id)}>Delete</Button>
                  </div>
                </div>
                <p className="text-sm text-text-muted">{item.clinicalIndication || 'No clinical indication'}</p>
                {item.aiSummary ? <div className="rounded-xl bg-primary-50 px-3 py-2 text-xs text-primary-700">{item.aiSummary}</div> : null}
                {item.attachmentDataUrl ? <img src={item.attachmentDataUrl} alt={item.attachmentName || 'Investigation attachment'} className="max-h-52 rounded-xl border border-border object-cover" /> : null}
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppLayout>
  )
}
