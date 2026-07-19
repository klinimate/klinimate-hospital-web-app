import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useMemo, useRef, useState } from 'react'

const specialtyOptions = [
  'General Medicine',
  'Critical Care Medicine',
  'Cardiology',
  'Neurology',
  'Nephrology',
  'Pulmonology',
  'Gastroenterology',
  'Endocrinology',
  'Infectious Diseases',
  'Medical Oncology',
  'Hematology',
  'Rheumatology',
  'Psychiatry',
  'Dermatology',
  'General Surgery',
  'Orthopaedics',
  'Urology',
  'ENT',
  'Ophthalmology',
  'Obstetrics & Gynaecology',
  'Paediatrics',
  'Neonatology',
  'Anaesthesiology',
  'Palliative Care',
  'Clinical Nutrition',
  'Physiotherapy',
  'Others',
] as const

const empaneledSpecialists = [
  'Dr. Aarav Mehta (Cardiology)',
  'Dr. Nisha Rao (Critical Care)',
  'Dr. Vikram Shah (Neurology)',
  'Dr. Meera Iyer (Nephrology)',
  'Dr. Kavita Menon (Pulmonology)',
  'Dr. Anirudh Nair (Gastroenterology)',
  'Dr. Pooja Sethi (Endocrinology)',
  'Dr. Rohan Bhat (Infectious Diseases)',
  'Dr. Sneha Kulkarni (Medical Oncology)',
  'Dr. Harsh Vora (Hematology)',
  'Dr. Aditi Kapoor (Rheumatology)',
  'Dr. Samir Joshi (Psychiatry)',
  'Dr. Trisha George (Dermatology)',
  'Dr. Nitin Reddy (General Surgery)',
  'Dr. Abhay Verma (Orthopaedics)',
  'Dr. Isha Bansal (Urology)',
  'Dr. Manish Jain (ENT)',
  'Dr. Ruhi Desai (Ophthalmology)',
  'Dr. Pallavi Singh (Obstetrics & Gynaecology)',
  'Dr. Yash Patil (Paediatrics)',
] as const

const defaultConsultationTypes = ['Virtual', 'Bedside', 'Phone'] as const

type ConsultationStatus = 'Scheduled' | 'In Progress' | 'Completed'

interface ConsultationEntry {
  id: string
  specialist: string
  date: string
  time: string
  type: string
  remarks: string
  summary: string
  status: ConsultationStatus
}

const initialConsultations: ConsultationEntry[] = [
  {
    id: 'cons-001',
    specialist: 'Cardiology',
    date: '2026-07-16',
    time: '14:30',
    type: 'Virtual',
    remarks: 'Review recurrent chest discomfort with ECG trend.',
    summary:
      'Senior cardiology review advised serial ECG monitoring, fluid balance optimization, and repeat troponin at six hours.',
    status: 'Completed',
  },
  {
    id: 'cons-002',
    specialist: 'Critical Care Medicine',
    date: '2026-07-18',
    time: '10:15',
    type: 'Bedside',
    remarks: 'Assess oxygen escalation requirement.',
    summary:
      'ICU specialist recommended prone sessions, high-flow oxygen protocol, and close respiratory fatigue monitoring overnight.',
    status: 'In Progress',
  },
]

function formatDisplayDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDisplayTime(value: string) {
  const [hoursRaw, minutesRaw] = value.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value

  const normalizedHours = hours % 12 || 12
  const suffix = hours >= 12 ? 'PM' : 'AM'
  return `${normalizedHours}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function normalizeDateValue(value: string) {
  const input = value.trim()
  if (!input) return ''

  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    const [, year, month, day] = isoMatch
    const date = new Date(`${year}-${month}-${day}T00:00:00`)
    if (!Number.isNaN(date.getTime())) return `${year}-${month}-${day}`
  }

  const dmyMatch = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (dmyMatch) {
    const day = Number(dmyMatch[1])
    const month = Number(dmyMatch[2])
    const year = Number(dmyMatch[3])
    const date = new Date(year, month - 1, day)
    if (
      !Number.isNaN(date.getTime()) &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }
  }

  return ''
}

function normalizeTimeValue(value: string) {
  const input = value.trim().toUpperCase()
  if (!input) return ''

  const match = input.match(/^(\d{1,2})[:.]?(\d{2})\s*(AM|PM)?$/)
  if (!match) return ''

  let hours = Number(match[1])
  const minutes = Number(match[2])
  const period = match[3]

  if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes > 59) return ''

  if (period) {
    if (hours < 1 || hours > 12) return ''
    if (period === 'AM') {
      if (hours === 12) hours = 0
    } else if (hours < 12) {
      hours += 12
    }
  } else if (hours > 23) {
    return ''
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function ConsultationBottomSheet({
  title,
  onClose,
  children,
  footer,
  headerActions,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  headerActions?: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/45">
      <div className="flex h-full items-start justify-center px-3 pt-6 pb-4 sm:px-4">
        <div className="h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-4 py-3">
            <h3 className="text-sm font-semibold text-text">{title}</h3>
            {headerActions ? (
              headerActions
            ) : (
              <Button size="md" variant="ghost" className="min-h-9 px-3 py-1.5 text-xs" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
          <div className="h-[calc(92vh-3.75rem)] overflow-y-auto px-4 py-2.5">{children}</div>
          {footer ? <div className="border-t border-border bg-white px-4 py-2">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}

function FullScreenDialog({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/45">
      <div className="flex h-full items-start justify-center px-3 pt-6 pb-4 sm:px-4">
        <div className="h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-4 py-3">
            <h3 className="text-sm font-semibold text-text">{title}</h3>
            <Button size="md" variant="ghost" className="min-h-9 px-3 py-1.5 text-xs" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="h-[calc(92vh-3.75rem)] overflow-y-auto px-4 py-2.5">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function KlinimatePage() {
  const [specialty, setSpecialty] = useState('')
  const [clinicalQuestion, setClinicalQuestion] = useState('')
  const [specialtyError, setSpecialtyError] = useState('')

  const [showSchedule, setShowSchedule] = useState(false)
  const [showAllConsultations, setShowAllConsultations] = useState(false)
  const [activeConsultation, setActiveConsultation] = useState<ConsultationEntry | null>(null)
  const [successToast, setSuccessToast] = useState('')

  const [consultations, setConsultations] = useState<ConsultationEntry[]>(initialConsultations)
  const [customSpecialists, setCustomSpecialists] = useState<string[]>([])
  const [customConsultationTypes, setCustomConsultationTypes] = useState<string[]>([])
  const [showSpecialistOptions, setShowSpecialistOptions] = useState(false)
  const [showConsultationTypeOptions, setShowConsultationTypeOptions] = useState(false)
  const [scheduleSpecialistQuery, setScheduleSpecialistQuery] = useState('')
  const [scheduleDateInput, setScheduleDateInput] = useState('')
  const [scheduleTimeInput, setScheduleTimeInput] = useState('')
  const [scheduleConsultationTypeQuery, setScheduleConsultationTypeQuery] = useState('Virtual')
  const scheduleDatePickerRef = useRef<HTMLInputElement | null>(null)
  const scheduleTimePickerRef = useRef<HTMLInputElement | null>(null)
  const [scheduleForm, setScheduleForm] = useState({
    specialist: '',
    consultationDate: '',
    consultationTime: '',
    consultationType: 'Virtual',
    remarks: '',
  })

  const recentConsultations = useMemo(() => consultations.slice(0, 3), [consultations])

  function triggerToast(message: string) {
    setSuccessToast(message)
    window.setTimeout(() => {
      setSuccessToast('')
    }, 2200)
  }

  function submitSpecialistRequest() {
    if (!specialty.trim()) {
      setSpecialtyError('Please select a specialty to continue.')
      return
    }

    setSpecialtyError('')
    triggerToast('Specialist consultation request submitted.')
    setSpecialty('')
    setClinicalQuestion('')
  }

  function saveScheduledConsultation() {
    if (
      !scheduleForm.specialist.trim() ||
      !scheduleForm.consultationDate.trim() ||
      !scheduleForm.consultationTime.trim() ||
      !scheduleForm.consultationType.trim()
    ) {
      return
    }

    const created: ConsultationEntry = {
      id: `cons-${Date.now()}`,
      specialist: scheduleForm.specialist.trim(),
      date: scheduleForm.consultationDate,
      time: scheduleForm.consultationTime,
      type: scheduleForm.consultationType.trim(),
      remarks: scheduleForm.remarks.trim(),
      summary: scheduleForm.remarks.trim()
        ? scheduleForm.remarks.trim()
        : 'Consultation scheduled by Klinimate Coordinator. Awaiting specialist assessment summary.',
      status: 'Scheduled',
    }

    const selectedSpecialist = scheduleForm.specialist.trim()
    const specialistExists = [...empaneledSpecialists, ...customSpecialists]
      .some((item) => item.toLowerCase() === selectedSpecialist.toLowerCase())

    if (selectedSpecialist && !specialistExists) {
      setCustomSpecialists((current) => [selectedSpecialist, ...current])
    }

    const selectedConsultationType = scheduleForm.consultationType.trim()
    const typeExists = [...defaultConsultationTypes, ...customConsultationTypes]
      .some((item) => item.toLowerCase() === selectedConsultationType.toLowerCase())

    if (selectedConsultationType && !typeExists) {
      setCustomConsultationTypes((current) => [selectedConsultationType, ...current])
    }

    setConsultations((current) => [created, ...current])
    setScheduleForm({
      specialist: '',
      consultationDate: '',
      consultationTime: '',
      consultationType: 'Virtual',
      remarks: '',
    })
    setScheduleSpecialistQuery('')
    setScheduleDateInput('')
    setScheduleTimeInput('')
    setScheduleConsultationTypeQuery('Virtual')
    setShowSpecialistOptions(false)
    setShowConsultationTypeOptions(false)
    setShowSchedule(false)
    triggerToast('Consultation scheduled successfully.')
  }

  function closeScheduleModal() {
    setShowSchedule(false)
    setShowSpecialistOptions(false)
    setShowConsultationTypeOptions(false)
  }

  function openNativePicker(ref: React.RefObject<HTMLInputElement | null>) {
    if (!ref.current) return
    const input = ref.current
    const pickerInput = input as HTMLInputElement & { showPicker?: () => void }
    if (typeof pickerInput.showPicker === 'function') {
      pickerInput.showPicker()
      return
    }
    input.focus()
    input.click()
  }

  const filteredSpecialists = useMemo(() => {
    const query = scheduleSpecialistQuery.trim().toLowerCase()
    const allSpecialists = [...customSpecialists, ...empaneledSpecialists]
    if (!query) return allSpecialists
    return allSpecialists.filter((item) => item.toLowerCase().includes(query))
  }, [customSpecialists, scheduleSpecialistQuery])

  const customSpecialistLabel = scheduleSpecialistQuery.trim()
  const allKnownSpecialists = [...customSpecialists, ...empaneledSpecialists]
  const showCustomSpecialistOption =
    !!customSpecialistLabel &&
    !allKnownSpecialists.some((item) => item.toLowerCase() === customSpecialistLabel.toLowerCase())

  const allConsultationTypes = [...customConsultationTypes, ...defaultConsultationTypes]
  const filteredConsultationTypes = useMemo(() => {
    const query = scheduleConsultationTypeQuery.trim().toLowerCase()
    if (!query) return allConsultationTypes
    return allConsultationTypes.filter((item) => item.toLowerCase().includes(query))
  }, [allConsultationTypes, scheduleConsultationTypeQuery])

  const customConsultationTypeLabel = scheduleConsultationTypeQuery.trim()
  const showCustomConsultationTypeOption =
    !!customConsultationTypeLabel &&
    !allConsultationTypes.some((item) => item.toLowerCase() === customConsultationTypeLabel.toLowerCase())

  const canSaveSchedule =
    !!scheduleForm.specialist.trim() &&
    !!scheduleForm.consultationDate.trim() &&
    !!scheduleForm.consultationTime.trim() &&
    !!scheduleForm.consultationType.trim()

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3 pb-3">
        <header className="rounded-2xl border border-primary-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <img src="/klinimate-icon.png" alt="Klinimate" className="h-8 w-8 object-contain" />
            <h1 className="text-lg font-bold tracking-wide text-[#0B1F4D]">Klinimate</h1>
          </div>
          <p className="mt-1 text-xs text-text-muted">
            Specialist support and coordination.
          </p>
        </header>

        <Card className="p-3">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-sm font-semibold text-text">🚨 Emergency Support</h2>
            <Button
              fullWidth
              size="md"
              className="min-h-11 justify-center gap-2"
              onClick={() => {
                window.location.href = 'tel:+918850403201'
              }}
            >
              <span aria-hidden="true">📞</span>
              <span>Call Klinimate Intensivist</span>
            </Button>
            <p className="text-[11px] leading-4 text-slate-500">
              Recommended for Yellow and Red category patients requiring expert critical care support.
            </p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-sm font-semibold text-text">🤝 Care Coordination</h2>
            <Button
              fullWidth
              size="md"
              className="min-h-11 justify-center gap-2"
              onClick={() => {
                window.location.href = 'tel:+917710082611'
              }}
            >
              <span aria-hidden="true">📞</span>
              <span>Call Klinimate Coordinator</span>
            </Button>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-sm font-semibold text-text">👨‍⚕️ Request Specialist Consultation</h2>

            <div>
              <label htmlFor="specialty" className="text-xs font-medium text-text">
                Specialty
              </label>
              <select
                id="specialty"
                value={specialty}
                onChange={(event) => {
                  setSpecialty(event.target.value)
                  if (event.target.value.trim()) setSpecialtyError('')
                }}
                className="mt-1 min-h-11 w-full rounded-xl border border-border px-3 text-sm"
              >
                <option value="">Select specialty</option>
                {specialtyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {specialtyError ? <p className="mt-1 text-[11px] text-rose-600">{specialtyError}</p> : null}
            </div>

            <div>
              <label htmlFor="clinical-question" className="text-xs font-medium text-text">
                Clinical Question
              </label>
              <textarea
                id="clinical-question"
                rows={3}
                value={clinicalQuestion}
                onChange={(event) => setClinicalQuestion(event.target.value)}
                className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
                placeholder="Optional"
              />
            </div>

            <Button fullWidth size="md" className="min-h-11" onClick={submitSpecialistRequest}>
              Submit Request
            </Button>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-text">📄 Consultations</h2>
            <div className="flex items-center gap-2">
              <Button
                size="md"
                variant="secondary"
                className="min-h-9 rounded-lg px-2.5 py-1 text-xs"
                onClick={() => setShowSchedule(true)}
              >
                <span aria-hidden="true">📅</span>
                <span>Schedule</span>
              </Button>
              <Button
                size="md"
                variant="secondary"
                className="min-h-9 rounded-lg px-2.5 py-1 text-xs"
                onClick={() => setShowAllConsultations(true)}
              >
                <span aria-hidden="true">👁</span>
                <span>View All</span>
              </Button>
            </div>
          </div>

          <div className="mt-2 space-y-2">
            {recentConsultations.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2 text-left"
                onClick={() => setActiveConsultation(entry)}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-text">{formatDisplayDate(entry.date)}</p>
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                    {entry.status}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-text">{entry.specialist}</p>
                <p
                  className="mt-1 text-xs leading-4 text-text-muted"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {entry.summary}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {showSchedule ? (
          <ConsultationBottomSheet
            title="Schedule Consultation"
            onClose={closeScheduleModal}
            headerActions={
              <div className="flex items-center">
                <button
                  type="button"
                  className="min-h-8 px-1 text-xs font-semibold text-text-muted"
                  onClick={closeScheduleModal}
                >
                  Close
                </button>
              </div>
            }
          >
            <div className="space-y-1.5">
              <div>
                <label htmlFor="schedule-specialist" className="text-xs font-medium text-text">
                  Specialist
                </label>
                <div className="relative mt-1">
                  <input
                    id="schedule-specialist"
                    value={scheduleSpecialistQuery}
                    onFocus={() => setShowSpecialistOptions(true)}
                    onBlur={() => {
                      window.setTimeout(() => {
                        setShowSpecialistOptions(false)
                      }, 120)
                    }}
                    onChange={(event) => {
                      const value = event.target.value
                      setScheduleSpecialistQuery(value)
                      setScheduleForm((current) => ({ ...current, specialist: value }))
                      setShowSpecialistOptions(true)
                    }}
                    className="min-h-11 w-full rounded-xl border border-border px-3 text-sm"
                    placeholder="Search or enter specialist"
                    autoComplete="off"
                  />

                  {showSpecialistOptions ? (
                    <div className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-border bg-white shadow-lg">
                      {filteredSpecialists.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="w-full border-b border-border px-3 py-2 text-left text-xs text-text last:border-b-0"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            setScheduleSpecialistQuery(item)
                            setScheduleForm((current) => ({ ...current, specialist: item }))
                            setShowSpecialistOptions(false)
                          }}
                        >
                          {item}
                        </button>
                      ))}

                      {showCustomSpecialistOption ? (
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-xs font-medium text-primary-700"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            setScheduleSpecialistQuery(customSpecialistLabel)
                            setScheduleForm((current) => ({ ...current, specialist: customSpecialistLabel }))
                            setShowSpecialistOptions(false)
                          }}
                        >
                          + Use "{customSpecialistLabel}" as a new specialist
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="schedule-date" className="text-xs font-medium text-text">
                    Consultation Date
                  </label>
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      id="schedule-date"
                      value={scheduleDateInput}
                      onChange={(event) => {
                        const value = event.target.value
                        const normalized = normalizeDateValue(value)
                        setScheduleDateInput(value)
                        setScheduleForm((current) => ({
                          ...current,
                          consultationDate: normalized,
                        }))
                      }}
                      className="min-h-11 w-full rounded-xl border border-border px-3 text-sm"
                      placeholder="DD/MM/YYYY"
                    />
                    <button
                      type="button"
                      className="min-h-11 rounded-xl border border-border px-2 text-xs font-semibold text-text-muted"
                      onClick={() => openNativePicker(scheduleDatePickerRef)}
                    >
                      Pick
                    </button>
                    <input
                      ref={scheduleDatePickerRef}
                      type="date"
                      tabIndex={-1}
                      value={scheduleForm.consultationDate}
                      onChange={(event) => {
                        const value = event.target.value
                        setScheduleForm((current) => ({ ...current, consultationDate: value }))
                        setScheduleDateInput(
                          value
                            ? (() => {
                                const [year, month, day] = value.split('-')
                                return `${day}/${month}/${year}`
                              })()
                            : '',
                        )
                      }}
                      className="absolute h-0 w-0 opacity-0 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="schedule-time" className="text-xs font-medium text-text">
                    Consultation Time
                  </label>
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      id="schedule-time"
                      value={scheduleTimeInput}
                      onChange={(event) => {
                        const value = event.target.value
                        const normalized = normalizeTimeValue(value)
                        setScheduleTimeInput(value)
                        setScheduleForm((current) => ({
                          ...current,
                          consultationTime: normalized,
                        }))
                      }}
                      className="min-h-11 w-full rounded-xl border border-border px-3 text-sm"
                      placeholder="HH:MM or HH:MM AM"
                    />
                    <button
                      type="button"
                      className="min-h-11 rounded-xl border border-border px-2 text-xs font-semibold text-text-muted"
                      onClick={() => openNativePicker(scheduleTimePickerRef)}
                    >
                      Pick
                    </button>
                    <input
                      ref={scheduleTimePickerRef}
                      type="time"
                      tabIndex={-1}
                      value={scheduleForm.consultationTime}
                      step={60}
                      onChange={(event) => {
                        const value = event.target.value
                        setScheduleForm((current) => ({ ...current, consultationTime: value }))
                        setScheduleTimeInput(value)
                      }}
                      className="absolute h-0 w-0 opacity-0 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="schedule-type" className="text-xs font-medium text-text">
                  Consultation Type
                </label>
                <div className="relative mt-1">
                  <input
                    id="schedule-type"
                    value={scheduleConsultationTypeQuery}
                    onFocus={() => setShowConsultationTypeOptions(true)}
                    onBlur={() => {
                      window.setTimeout(() => {
                        setShowConsultationTypeOptions(false)
                      }, 120)
                    }}
                    onChange={(event) => {
                      const value = event.target.value
                      setScheduleConsultationTypeQuery(value)
                      setScheduleForm((current) => ({ ...current, consultationType: value }))
                      setShowConsultationTypeOptions(true)
                    }}
                    className="min-h-11 w-full rounded-xl border border-border px-3 text-sm"
                    placeholder="Search or enter consultation type"
                    autoComplete="off"
                  />

                  {showConsultationTypeOptions ? (
                    <div className="absolute z-20 mt-1 max-h-36 w-full overflow-y-auto rounded-xl border border-border bg-white shadow-lg">
                      {filteredConsultationTypes.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="w-full border-b border-border px-3 py-2 text-left text-xs text-text last:border-b-0"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            setScheduleConsultationTypeQuery(item)
                            setScheduleForm((current) => ({ ...current, consultationType: item }))
                            setShowConsultationTypeOptions(false)
                          }}
                        >
                          {item}
                        </button>
                      ))}

                      {showCustomConsultationTypeOption ? (
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-xs font-medium text-primary-700"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            setScheduleConsultationTypeQuery(customConsultationTypeLabel)
                            setScheduleForm((current) => ({
                              ...current,
                              consultationType: customConsultationTypeLabel,
                            }))
                            setShowConsultationTypeOptions(false)
                          }}
                        >
                          + Use "{customConsultationTypeLabel}" as a new type
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="schedule-remarks" className="text-xs font-medium text-text">
                  Remarks
                </label>
                <textarea
                  id="schedule-remarks"
                  rows={3}
                  value={scheduleForm.remarks}
                  onChange={(event) => setScheduleForm((current) => ({ ...current, remarks: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
                  placeholder="Optional remarks"
                />
              </div>

              <Button
                fullWidth
                size="md"
                className="min-h-12"
                onClick={saveScheduledConsultation}
                disabled={!canSaveSchedule}
              >
                Schedule Consultation
              </Button>
            </div>
          </ConsultationBottomSheet>
        ) : null}

        {showAllConsultations ? (
          <FullScreenDialog title="All Consultations" onClose={() => setShowAllConsultations(false)}>
            <div className="space-y-2 pb-1">
              {consultations.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-left shadow-sm"
                  onClick={() => setActiveConsultation(entry)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-text">{formatDisplayDate(entry.date)}</p>
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                      {entry.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-text">{entry.specialist}</p>
                  <p
                    className="mt-1 text-xs leading-4 text-text-muted"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {entry.summary}
                  </p>
                </button>
              ))}
            </div>
          </FullScreenDialog>
        ) : null}

        {activeConsultation ? (
          <ConsultationBottomSheet
            title="Consultation Details"
            onClose={() => {
              setActiveConsultation(null)
            }}
          >
            <div className="space-y-2">
              <Card className="p-3">
                <p className="text-xs font-medium text-text-muted">Specialist</p>
                <p className="text-sm font-semibold text-text">{activeConsultation.specialist}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs font-medium text-text-muted">Date & Time</p>
                <p className="text-sm font-semibold text-text">
                  {formatDisplayDate(activeConsultation.date)} • {formatDisplayTime(activeConsultation.time)}
                </p>
              </Card>
              <Card className="p-3">
                <p className="text-xs font-medium text-text-muted">Consultation Type</p>
                <p className="text-sm text-text">{activeConsultation.type}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs font-medium text-text-muted">Consultation Summary</p>
                <p className="text-sm text-text">{activeConsultation.summary}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs font-medium text-text-muted">Status</p>
                <p className="text-sm font-semibold text-primary-700">{activeConsultation.status}</p>
              </Card>
              {activeConsultation.remarks ? (
                <Card className="p-3">
                  <p className="text-xs font-medium text-text-muted">Remarks</p>
                  <p className="text-sm text-text">{activeConsultation.remarks}</p>
                </Card>
              ) : null}
            </div>
          </ConsultationBottomSheet>
        ) : null}

        {successToast ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 mx-auto w-[calc(100%-2rem)] max-w-sm rounded-xl bg-emerald-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-lg">
            {successToast}
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}