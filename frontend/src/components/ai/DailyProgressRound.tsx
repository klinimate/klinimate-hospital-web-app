import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TextArea } from '@/components/ui/TextArea'
import type { Patient } from '@/data/patients'

interface AssessmentDraft {
  currentClinicalStatus: string
  majorClinicalProblems: string
  aiClinicalImpression: string
  aiRecommendedActions: string
  suggestedInvestigations: string
  suggestedInitialManagement: string
  whyRecommended: string
}

interface DailyProgressRoundEntry {
  id: string
  timestamp: string
  summary: string
  subjective: string
  objective: Record<string, string>
  examination: Record<string, string>
  assessment: AssessmentDraft
  managementPlan: Record<string, boolean>
  checklist: Record<string, boolean>
  reminders: string[]
}

function parseNumber(v?: string) {
  if (!v) return NaN
  const m = v.match(/-?\d+(?:\.\d+)?/)
  return m ? Number(m[0]) : NaN
}

function parseBP(bp?: string) {
  if (!bp) return { sys: NaN, dia: NaN }
  const m = bp.match(/(\d{2,3})\s*\/\s*(\d{2,3})/)
  if (!m) return { sys: NaN, dia: NaN }
  return { sys: Number(m[1]), dia: Number(m[2]) }
}

function createInitialForm(patient: Patient) {
  return {
    subjective: 'Same',
    subjectiveText: '',
    objective: {
      bp: patient.vitals.bp,
      pulse: patient.vitals.pulse,
      respiratoryRate: patient.vitals.respiratoryRate,
      temperature: patient.vitals.temperature,
      spo2: patient.vitals.spo2,
      bloodSugar: patient.vitals.bloodSugar,
      urineOutput: patient.urineOutput ?? 'Adequate',
    },
    generalCondition: 'Stable',
    respiratory: 'Normal',
    cardiovascular: 'Stable',
    cns: 'Alert',
    urineOutputExam: 'Adequate',
    examinationText: '',
    impression: '',
    managementPlan: {
      continueCurrentTreatment: true,
      oxygenTherapy: false,
      ivFluids: false,
      antibiotics: false,
      orderInvestigations: false,
      repeatInvestigations: false,
      shiftToICU: false,
      referSpecialist: false,
      notifyIntensivist: false,
      dischargePlanning: false,
    },
    intensivistRecommendations: '',
    checklist: {
      repeatVitals: true,
      monitorUrineOutput: true,
      reviewInvestigations: false,
      reviewAntibiotics: false,
      reviewFluidBalance: false,
      repeatBloodSugar: false,
      familyCounselling: false,
      consultantInformed: false,
    },
  }
}

function createAssessmentDraft(form: ReturnType<typeof createInitialForm>): AssessmentDraft {
  const bp = parseBP(form.objective.bp)
  const pulse = parseNumber(form.objective.pulse)
  const rr = parseNumber(form.objective.respiratoryRate)
  const temp = parseNumber(form.objective.temperature)
  const spo2 = parseNumber(form.objective.spo2)

  const problems: string[] = []
  if (!Number.isNaN(spo2) && spo2 < 94) problems.push('Hypoxemia')
  if (!Number.isNaN(bp.sys) && bp.sys < 90) problems.push('Hypotension')
  if (!Number.isNaN(pulse) && pulse > 100) problems.push('Tachycardia')
  if (!Number.isNaN(rr) && rr > 24) problems.push('Respiratory distress')
  if (!Number.isNaN(temp) && temp >= 38) problems.push('Fever')
  if (form.urineOutputExam !== 'Adequate') problems.push('Reduced urine output')
  if (form.generalCondition === 'Toxic' || form.generalCondition === 'Drowsy' || form.generalCondition === 'Unresponsive') {
    problems.push('Altered conscious state')
  }

  const currentClinicalStatus = [
    `Patient is ${form.generalCondition.toLowerCase()} on review.`,
    `Respiratory status is ${form.respiratory.toLowerCase()}.`,
    `Cardiovascular status is ${form.cardiovascular.toLowerCase()}.`,
    `Neurological status is ${form.cns.toLowerCase()}.`,
  ].join(' ')

  const majorClinicalProblems = problems.length
    ? `Current concerns: ${problems.join(', ')}.`
    : 'No major red flags identified at this review.'

  const aiClinicalImpression = problems.length
    ? `The current picture suggests ${problems.join(', ').toLowerCase()} requiring close review and escalation if worsening.`
    : 'The patient appears stable and continues to require routine monitoring.'

  const aiRecommendedActions = [
    'Continue current monitoring and reassess vitals at the next scheduled interval.',
    ...(form.generalCondition === 'Toxic' || form.generalCondition === 'Unresponsive' ? ['Escalate for urgent review.'] : []),
    ...(form.respiratory !== 'Normal' ? ['Consider oxygen support and repeat respiratory assessment.'] : []),
    ...(form.cardiovascular === 'Hypotension' ? ['Review fluid status and blood pressure response.'] : []),
    ...(form.urineOutputExam !== 'Adequate' ? ['Monitor urine output closely and reassess renal perfusion.'] : []),
  ].join(' ')

  const suggestedInvestigations = [
    ...(form.respiratory !== 'Normal' ? ['Chest X-ray'] : []),
    ...(form.cardiovascular === 'Hypotension' ? ['RFT / lactate'] : []),
    ...(form.urineOutputExam !== 'Adequate' ? ['Urine output review'] : []),
    ...(form.generalCondition === 'Toxic' ? ['CBC / cultures'] : []),
    ...(form.cardiovascular === 'Tachycardia' ? ['ECG'] : []),
  ].join(', ') || 'No new investigations required at this time.'

  const suggestedInitialManagement = [
    ...(form.managementPlan.oxygenTherapy ? ['Oxygen therapy'] : []),
    ...(form.managementPlan.ivFluids ? ['IV fluids'] : []),
    ...(form.managementPlan.antibiotics ? ['Antibiotics'] : []),
    ...(form.managementPlan.orderInvestigations ? ['Order investigations'] : []),
    ...(form.managementPlan.continueCurrentTreatment ? ['Continue current treatment'] : []),
  ].join(', ') || 'Continue routine care and reassessment.'

  const whyRecommended = [
    `Latest vitals show BP ${form.objective.bp}, pulse ${form.objective.pulse}, SpO₂ ${form.objective.spo2}, and temperature ${form.objective.temperature}.`,
    `Clinical exam is ${form.generalCondition.toLowerCase()} with ${form.respiratory.toLowerCase()} respiratory findings.`,
    `Urine output is ${form.urineOutputExam.toLowerCase()}.`,
  ].join(' ')

  return {
    currentClinicalStatus,
    majorClinicalProblems,
    aiClinicalImpression,
    aiRecommendedActions,
    suggestedInvestigations,
    suggestedInitialManagement,
    whyRecommended,
  }
}

function createReminders(patient: Patient, form: ReturnType<typeof createInitialForm>) {
  const reminders: string[] = []
  const bp = parseBP(form.objective.bp)
  const pulse = parseNumber(form.objective.pulse)
  const spo2 = parseNumber(form.objective.spo2)

  if (bp.sys < 100 || bp.sys > 160) reminders.push('Repeat BP in 30 minutes')
  if (spo2 && spo2 < 95) reminders.push('Repeat SpO₂ and ABG')
  if (!Number.isNaN(pulse) && pulse > 100) reminders.push('Repeat pulse and ECG review')
  if (form.objective.bloodSugar) reminders.push('Repeat blood sugar')
  if (form.urineOutputExam !== 'Adequate') reminders.push('Review urine output after fluids')
  if (form.respiratory !== 'Normal') reminders.push('Review chest X-ray')
  if (patient.department.toLowerCase().includes('icu')) reminders.push('Reassess ICU goals of care')

  return reminders.length ? reminders : ['Repeat vitals at the next round', 'Review investigations']
}

function createSummary(form: ReturnType<typeof createInitialForm>) {
  const parts = [`Subjective: ${form.subjective}`]
  if (form.subjectiveText.trim()) parts.push(form.subjectiveText.trim())
  return parts.join(' · ')
}

export function DailyProgressRound({ patient }: { patient: Patient }) {
  const doctorName = 'Dr. Asha Kumar'
  const [form, setForm] = useState(() => createInitialForm(patient))
  const [assessment, setAssessment] = useState<AssessmentDraft>(() => createAssessmentDraft(createInitialForm(patient)))
  const [rounds, setRounds] = useState<DailyProgressRoundEntry[]>([])
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    const nextAssessment = createAssessmentDraft(form)
    setAssessment(nextAssessment)
  }, [form])

  const locationLabel = patient.room.includes('ICU') ? 'ICU' : 'Ward'
  const bedNumber = patient.room.match(/(\d+)/)?.[1] ?? '—'
  const reminders = useMemo(() => createReminders(patient, form), [patient, form])

  function updateField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateObjectiveField(field: string, value: string) {
    setForm((prev) => ({ ...prev, objective: { ...prev.objective, [field]: value } }))
  }

  function toggleManagementPlan(key: keyof typeof form.managementPlan) {
    setForm((prev) => ({
      ...prev,
      managementPlan: { ...prev.managementPlan, [key]: !prev.managementPlan[key] },
    }))
  }

  function toggleChecklist(key: keyof typeof form.checklist) {
    setForm((prev) => ({
      ...prev,
      checklist: { ...prev.checklist, [key]: !prev.checklist[key] },
    }))
  }

  function saveRound() {
    const entry: DailyProgressRoundEntry = {
      id: `${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      summary: createSummary(form),
      subjective: form.subjective + (form.subjectiveText ? ` · ${form.subjectiveText}` : ''),
      objective: form.objective,
      examination: {
        generalCondition: form.generalCondition,
        respiratory: form.respiratory,
        cardiovascular: form.cardiovascular,
        cns: form.cns,
        urineOutputExam: form.urineOutputExam,
        freeText: form.examinationText,
      },
      assessment,
      managementPlan: form.managementPlan,
      checklist: form.checklist,
      reminders,
    }

    setRounds((prev) => [entry, ...prev])
    setSavedMessage('Daily Progress Round saved to the timeline')
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text">Daily Progress Round — Ward & ICU</h3>
          <p className="mt-1 text-xs text-text-muted">Fast bedside documentation for ward rounds and ICU review</p>
        </div>
        <div className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          {locationLabel}
        </div>
      </div>

      <div className="rounded-2xl bg-surface-muted p-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-text-muted">Date & Time</p>
            <p className="mt-1 font-medium text-text">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Doctor</p>
            <p className="mt-1 font-medium text-text">{doctorName}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Ward / ICU</p>
            <p className="mt-1 font-medium text-text">{locationLabel}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Bed Number</p>
            <p className="mt-1 font-medium text-text">{bedNumber}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">1. Subjective</h4>
          <span className="text-xs text-text-muted">Quick options</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Better', 'Same', 'Worse', 'New complaint'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateField('subjective', option)}
              className={`rounded-full border px-3 py-2 text-sm ${form.subjective === option ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border bg-white text-text'}`}
            >
              {option}
            </button>
          ))}
        </div>
        <TextArea label="Optional free text" rows={3} value={form.subjectiveText} onChange={(event) => updateField('subjectiveText', event.target.value)} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">2. Objective</h4>
          <span className="text-xs text-text-muted">Auto-populated from latest vitals</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'bp', label: 'BP' },
            { key: 'pulse', label: 'Pulse' },
            { key: 'respiratoryRate', label: 'Respiratory rate' },
            { key: 'temperature', label: 'Temperature' },
            { key: 'spo2', label: 'SpO₂' },
            { key: 'bloodSugar', label: 'Blood sugar' },
          ].map((item) => (
            <label key={item.key} className="rounded-2xl border border-border bg-surface-muted p-3 text-sm text-text">
              <span className="mb-2 block text-xs text-text-muted">{item.label}</span>
              <input
                value={form.objective[item.key as keyof typeof form.objective]}
                onChange={(event) => updateObjectiveField(item.key, event.target.value)}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
              />
            </label>
          ))}
          <label className="rounded-2xl border border-border bg-surface-muted p-3 text-sm text-text">
            <span className="mb-2 block text-xs text-text-muted">Urine output</span>
            <input value={form.objective.urineOutput} onChange={(event) => updateObjectiveField('urineOutput', event.target.value)} className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm" />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">3. Clinical Examination</h4>
          <span className="text-xs text-text-muted">Bedside choices</span>
        </div>
        <div className="space-y-3 rounded-2xl border border-border bg-surface-muted p-3">
          <div>
            <p className="mb-2 text-sm font-medium text-text">General condition</p>
            <div className="flex flex-wrap gap-2">
              {['Comfortable', 'Stable', 'Sick', 'Toxic', 'Drowsy', 'Unresponsive'].map((option) => (
                <button key={option} type="button" onClick={() => updateField('generalCondition', option)} className={`rounded-full border px-3 py-2 text-sm ${form.generalCondition === option ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border bg-white text-text'}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-text">Respiratory</p>
            <div className="flex flex-wrap gap-2">
              {['Normal', 'Mild respiratory distress', 'Moderate respiratory distress', 'Severe respiratory distress'].map((option) => (
                <button key={option} type="button" onClick={() => updateField('respiratory', option)} className={`rounded-full border px-3 py-2 text-sm ${form.respiratory === option ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border bg-white text-text'}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-text">Cardiovascular</p>
            <div className="flex flex-wrap gap-2">
              {['Stable', 'Tachycardia', 'Hypotension'].map((option) => (
                <button key={option} type="button" onClick={() => updateField('cardiovascular', option)} className={`rounded-full border px-3 py-2 text-sm ${form.cardiovascular === option ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border bg-white text-text'}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-text">CNS</p>
            <div className="flex flex-wrap gap-2">
              {['Alert', 'Drowsy', 'Confused', 'Unresponsive'].map((option) => (
                <button key={option} type="button" onClick={() => updateField('cns', option)} className={`rounded-full border px-3 py-2 text-sm ${form.cns === option ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border bg-white text-text'}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-text">Urine output</p>
            <div className="flex flex-wrap gap-2">
              {['Adequate', 'Reduced', 'No urine output'].map((option) => (
                <button key={option} type="button" onClick={() => updateField('urineOutputExam', option)} className={`rounded-full border px-3 py-2 text-sm ${form.urineOutputExam === option ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border bg-white text-text'}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <TextArea label="Optional free text" rows={3} value={form.examinationText} onChange={(event) => updateField('examinationText', event.target.value)} />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">4. Klinimate AI Clinical Assessment</h4>
          <span className="text-xs text-text-muted">Auto-regenerated</span>
        </div>
        <div className="space-y-2 rounded-2xl border border-border bg-surface-muted p-3">
          <label className="text-sm font-medium text-text">Current Clinical Status</label>
          <TextArea label="" rows={2} value={assessment.currentClinicalStatus} onChange={(event) => setAssessment((prev) => ({ ...prev, currentClinicalStatus: event.target.value }))} />
          <label className="text-sm font-medium text-text">Major Clinical Problems</label>
          <TextArea label="" rows={2} value={assessment.majorClinicalProblems} onChange={(event) => setAssessment((prev) => ({ ...prev, majorClinicalProblems: event.target.value }))} />
          <label className="text-sm font-medium text-text">AI Clinical Impression</label>
          <TextArea label="" rows={2} value={assessment.aiClinicalImpression} onChange={(event) => setAssessment((prev) => ({ ...prev, aiClinicalImpression: event.target.value }))} />
          <label className="text-sm font-medium text-text">AI Recommended Actions</label>
          <TextArea label="" rows={2} value={assessment.aiRecommendedActions} onChange={(event) => setAssessment((prev) => ({ ...prev, aiRecommendedActions: event.target.value }))} />
          <label className="text-sm font-medium text-text">Suggested Investigations</label>
          <TextArea label="" rows={2} value={assessment.suggestedInvestigations} onChange={(event) => setAssessment((prev) => ({ ...prev, suggestedInvestigations: event.target.value }))} />
          <label className="text-sm font-medium text-text">Suggested Initial Management</label>
          <TextArea label="" rows={2} value={assessment.suggestedInitialManagement} onChange={(event) => setAssessment((prev) => ({ ...prev, suggestedInitialManagement: event.target.value }))} />
          <label className="text-sm font-medium text-text">Why is Klinimate recommending this?</label>
          <TextArea label="" rows={2} value={assessment.whyRecommended} onChange={(event) => setAssessment((prev) => ({ ...prev, whyRecommended: event.target.value }))} />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">5. Today’s Clinical Impression</h4>
          <span className="text-xs text-text-muted">Editable</span>
        </div>
        <TextArea label="" rows={3} value={form.impression} onChange={(event) => updateField('impression', event.target.value)} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">6. Today’s Management Plan</h4>
          <span className="text-xs text-text-muted">Checklist</span>
        </div>
        <div className="grid gap-2 rounded-2xl border border-border bg-surface-muted p-3">
          {[
            ['continueCurrentTreatment', 'Continue current treatment'],
            ['oxygenTherapy', 'Oxygen therapy'],
            ['ivFluids', 'IV fluids'],
            ['antibiotics', 'Antibiotics'],
            ['orderInvestigations', 'Order investigations'],
            ['repeatInvestigations', 'Repeat investigations'],
            ['shiftToICU', 'Shift to ICU'],
            ['referSpecialist', 'Refer specialist'],
            ['notifyIntensivist', 'Notify Klinimate Intensivist'],
            ['dischargePlanning', 'Discharge planning'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-text">
              <input type="checkbox" checked={form.managementPlan[key as keyof typeof form.managementPlan]} onChange={() => toggleManagementPlan(key as keyof typeof form.managementPlan)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">7. Klinimate Intensivist Recommendations</h4>
          <span className="text-xs text-text-muted">Dedicated notes</span>
        </div>
        <TextArea label="" rows={3} value={form.intensivistRecommendations} onChange={(event) => updateField('intensivistRecommendations', event.target.value)} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">8. Daily Clinical Checklist</h4>
          <span className="text-xs text-text-muted">Quick review</span>
        </div>
        <div className="grid gap-2 rounded-2xl border border-border bg-surface-muted p-3">
          {[
            ['repeatVitals', 'Repeat vitals'],
            ['monitorUrineOutput', 'Monitor urine output'],
            ['reviewInvestigations', 'Review investigations'],
            ['reviewAntibiotics', 'Review antibiotics'],
            ['reviewFluidBalance', 'Review fluid balance'],
            ['repeatBloodSugar', 'Repeat blood sugar'],
            ['familyCounselling', 'Family counselling completed'],
            ['consultantInformed', 'Consultant informed'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-text">
              <input type="checkbox" checked={form.checklist[key as keyof typeof form.checklist]} onChange={() => toggleChecklist(key as keyof typeof form.checklist)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">9. AI Follow-up Reminders</h4>
          <span className="text-xs text-text-muted">Auto-generated</span>
        </div>
        <div className="space-y-2 rounded-2xl border border-border bg-surface-muted p-3">
          {reminders.map((reminder) => (
            <div key={reminder} className="rounded-xl bg-white px-3 py-2 text-sm text-text">
              {reminder}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">10. Progress Timeline</h4>
          <span className="text-xs text-text-muted">Chronological</span>
        </div>
        <Button size="md" fullWidth onClick={saveRound}>Save daily progress round</Button>
        {savedMessage ? <p className="text-sm text-primary-700">{savedMessage}</p> : null}
        <div className="space-y-2">
          {rounds.length ? rounds.map((round) => (
            <div key={round.id} className="rounded-2xl border border-border bg-white p-3 text-sm text-text-muted">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium text-text">{round.timestamp}</div>
                <div className="text-xs text-text-muted">{round.summary}</div>
              </div>
              <p className="mt-2 text-sm">{round.subjective}</p>
            </div>
          )) : <div className="rounded-2xl border border-dashed border-border bg-surface-muted p-3 text-sm text-text-muted">No rounds saved yet. Save one to build the timeline.</div>}
        </div>
      </section>

      <div className="rounded-2xl border border-primary-100 bg-primary-50/70 p-3 text-xs text-text-muted">
        Klinimate AI provides clinical decision support to assist healthcare professionals. Clinical decisions remain the responsibility of the treating physician.
      </div>
    </Card>
  )
}

export default DailyProgressRound
