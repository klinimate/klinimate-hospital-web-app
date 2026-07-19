import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { patients } from '@/data/patients'
import {
  addTimelineEvent,
  nowTimestamp,
  readWorkspace,
  syncPatientFromWorkspace,
  type PatientWorkspaceData,
  writeWorkspace,
} from '@/lib/patientWorkspace'

const moduleFilters = ['All', 'Vitals', 'Medical Notes', 'Investigations', 'Medications', 'Consultation'] as const

export function TimelinePage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState<PatientWorkspaceData | null>(null)
  const [search, setSearch] = useState('')
  const [selectedModule, setSelectedModule] = useState<(typeof moduleFilters)[number]>('All')
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [isMajor, setIsMajor] = useState(false)

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

  const filteredTimeline = useMemo(() => {
    const next = search.trim().toLowerCase()
    return workspace.timeline.filter((item) => {
      const byModule = selectedModule === 'All' || item.module === selectedModule
      const bySearch =
        !next ||
        item.title.toLowerCase().includes(next) ||
        item.details.toLowerCase().includes(next) ||
        item.module.toLowerCase().includes(next)
      return byModule && bySearch
    })
  }, [workspace.timeline, search, selectedModule])

  function addManualEvent() {
    if (!title.trim()) return
    setWorkspace((current) => {
      if (!current) return current
      return addTimelineEvent(current, {
        title: title.trim(),
        module: selectedModule === 'All' ? 'Consultation' : selectedModule,
        details: details.trim() || 'Manual update',
        timestamp: nowTimestamp(),
        major: isMajor,
      })
    })
    setTitle('')
    setDetails('')
    setIsMajor(false)
  }

  function deleteEvent(id: string) {
    setWorkspace((current) => {
      if (!current) return current
      return {
        ...current,
        timeline: current.timeline.filter((item) => item.id !== id),
      }
    })
  }

  const majorCount = workspace.timeline.filter((item) => item.major).length

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-6">
        <header className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="md" onClick={() => navigate(`/patients/${patient.id}/intelligence`)}>Back</Button>
          <h1 className="text-lg font-semibold text-text">Timeline</h1>
          <div className="rounded-xl bg-surface-muted px-3 py-2 text-xs font-semibold text-text-muted">Major Events {majorCount}</div>
        </header>

        <Card>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className="text-sm font-medium text-text">Search Timeline</label>
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {moduleFilters.map((item) => (
                <Button key={item} variant={selectedModule === item ? 'primary' : 'secondary'} size="md" onClick={() => setSelectedModule(item)}>
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-text">Manual Event Title</label>
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text" />
            </div>
            <div>
              <label className="text-sm font-medium text-text">Details</label>
              <textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={3} className="mt-1 min-h-24 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text" />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-text">
              <input type="checkbox" checked={isMajor} onChange={(event) => setIsMajor(event.target.checked)} />
              Mark as major event
            </label>
            <Button fullWidth onClick={addManualEvent}>Add Timeline Event</Button>
          </div>
        </Card>

        <section className="space-y-3">
          {filteredTimeline.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-text">{item.title}</p>
                    {item.major ? <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-700">Major</span> : null}
                  </div>
                  <p className="mt-1 text-xs text-text-muted">{item.module} · {item.timestamp}</p>
                  <p className="mt-2 text-sm text-text-muted">{item.details}</p>
                  {item.attachmentDataUrl ? <img src={item.attachmentDataUrl} alt={item.attachmentName || 'Timeline attachment'} className="mt-2 max-h-52 rounded-xl border border-border object-cover" /> : null}
                </div>
                <Button variant="ghost" size="md" onClick={() => deleteEvent(item.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppLayout>
  )
}
