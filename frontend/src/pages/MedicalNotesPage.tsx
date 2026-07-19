import { useEffect, useMemo, useRef, useState } from 'react'
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
  type WorkspaceNote,
  writeWorkspace,
} from '@/lib/patientWorkspace'

function drawOnCanvas(canvas: HTMLCanvasElement, x: number, y: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#0b1f4d'
  ctx.lineTo(x, y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, y)
}

export function MedicalNotesPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState<PatientWorkspaceData | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | 'With Attachments'>('All')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [attachmentName, setAttachmentName] = useState('')
  const [attachmentDataUrl, setAttachmentDataUrl] = useState('')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const patient = patients.find((entry) => entry.id === patientId)

  useEffect(() => {
    if (!patient) return
    const loaded = readWorkspace(patient)
    setWorkspace(loaded)
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

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    return workspace.notes.filter((item) => {
      const matchesSearch = !query || item.note.toLowerCase().includes(query)
      const matchesFilter = filter === 'All' || !!item.attachmentDataUrl || !!item.drawingDataUrl
      return matchesSearch && matchesFilter
    })
  }, [workspace.notes, search, filter])

  function resetForm() {
    setEditingId(null)
    setNoteText('')
    setAttachmentName('')
    setAttachmentDataUrl('')
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
    }
  }

  function handleFileUpload(file?: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAttachmentName(file.name)
      setAttachmentDataUrl(typeof reader.result === 'string' ? reader.result : '')
    }
    reader.readAsDataURL(file)
  }

  function openEdit(note: WorkspaceNote) {
    setEditingId(note.id)
    setNoteText(note.note)
    setAttachmentName(note.attachmentName || '')
    setAttachmentDataUrl(note.attachmentDataUrl || '')

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      if (note.drawingDataUrl) {
        const image = new Image()
        image.onload = () => ctx.drawImage(image, 0, 0)
        image.src = note.drawingDataUrl
      }
    }
  }

  function saveNote() {
    if (!noteText.trim() && !attachmentDataUrl && !canvasRef.current) return

    const drawingDataUrl = canvasRef.current?.toDataURL('image/png')
    const hasDrawing = drawingDataUrl && drawingDataUrl.length > 400

    const nextNote: WorkspaceNote = {
      id: editingId || createId('note'),
      note: noteText.trim(),
      createdAt: nowTimestamp(),
      author: 'Dr. Ananya Sharma',
      attachmentName: attachmentName || undefined,
      attachmentDataUrl: attachmentDataUrl || undefined,
      drawingDataUrl: hasDrawing ? drawingDataUrl : undefined,
    }

    setWorkspace((current) => {
      if (!current) return current
      const notes = editingId
        ? current.notes.map((item) => (item.id === editingId ? nextNote : item))
        : [nextNote, ...current.notes]

      return addTimelineEvent(
        {
          ...current,
          notes,
        },
        {
          title: editingId ? 'Medical Note Updated' : 'Medical Note Added',
          module: 'Medical Notes',
          details: nextNote.note || 'Attachment saved',
          major: false,
          attachmentName: nextNote.attachmentName,
          attachmentDataUrl: nextNote.attachmentDataUrl || nextNote.drawingDataUrl,
        },
      )
    })

    resetForm()
  }

  function deleteNote(id: string) {
    setWorkspace((current) => {
      if (!current) return current
      return {
        ...current,
        notes: current.notes.filter((item) => item.id !== id),
      }
    })
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget
    canvas.setPointerCapture(event.pointerId)
    setIsDrawing(true)
    const rect = canvas.getBoundingClientRect()
    drawOnCanvas(canvas, event.clientX - rect.left, event.clientY - rect.top)
  }

  function moveDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    drawOnCanvas(canvas, event.clientX - rect.left, event.clientY - rect.top)
  }

  function stopDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget
    setIsDrawing(false)
    canvas.releasePointerCapture(event.pointerId)
    const ctx = canvas.getContext('2d')
    ctx?.beginPath()
  }

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-6">
        <header className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="md" onClick={() => navigate(`/patients/${patient.id}/intelligence`)}>
            Back
          </Button>
          <h1 className="text-lg font-semibold text-text">Medical Notes</h1>
          <Button size="md" onClick={resetForm}>New Note</Button>
        </header>

        <Card>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <div>
              <label className="text-sm font-medium text-text">Search Notes</label>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search note text"
                className="mt-1 min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-text outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <Button variant={filter === 'All' ? 'primary' : 'secondary'} size="md" onClick={() => setFilter('All')}>All</Button>
            <Button variant={filter === 'With Attachments' ? 'primary' : 'secondary'} size="md" onClick={() => setFilter('With Attachments')}>With Attachments</Button>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text">Note</label>
              <textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                rows={5}
                placeholder="Clinical note"
                className="mt-1 min-h-28 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text hover:bg-surface-muted">
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null)} />
              </label>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text hover:bg-surface-muted">
                Camera Capture
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null)} />
              </label>
            </div>

            <div>
              <div className="text-sm font-medium text-text">Draw Handwritten Note (Stylus/Touch)</div>
              <canvas
                ref={canvasRef}
                width={900}
                height={280}
                onPointerDown={startDrawing}
                onPointerMove={moveDrawing}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                className="mt-1 h-56 w-full rounded-xl border border-border bg-white touch-none"
              />
            </div>

            {attachmentDataUrl ? (
              <img src={attachmentDataUrl} alt={attachmentName || 'Attachment'} className="max-h-48 rounded-xl border border-border object-cover" />
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button fullWidth onClick={saveNote}>{editingId ? 'Update Note' : 'Save Note'}</Button>
              <Button variant="secondary" fullWidth onClick={resetForm}>Clear</Button>
            </div>
          </div>
        </Card>

        <section className="space-y-3">
          {filteredNotes.map((note) => (
            <Card key={note.id}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text">{note.author}</p>
                    <p className="text-xs text-text-muted">{note.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="md" onClick={() => openEdit(note)}>Edit</Button>
                    <Button variant="ghost" size="md" onClick={() => deleteNote(note.id)}>Delete</Button>
                  </div>
                </div>
                <p className="text-sm text-text-muted">{note.note}</p>
                {note.attachmentDataUrl ? <img src={note.attachmentDataUrl} alt={note.attachmentName || 'Attachment'} className="max-h-52 rounded-xl border border-border object-cover" /> : null}
                {note.drawingDataUrl ? <img src={note.drawingDataUrl} alt="Handwritten note" className="max-h-52 rounded-xl border border-border object-cover" /> : null}
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppLayout>
  )
}
