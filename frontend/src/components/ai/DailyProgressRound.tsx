import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ChoiceChipGroup } from '@/components/ui/ChoiceChipGroup'
import { TextArea } from '@/components/ui/TextArea'
import type { Patient } from '@/data/patients'
import { computeTriageFromVitals } from '@/lib/triage'
import INVESTIGATIONS from '@/config/clinical/investigations'
import ALERTS from '@/config/clinical/alerts'
import VITAL_THRESHOLDS from '@/config/clinical/vitals'

interface AssessmentDraft {
  clinicalSummary: string
  problemsIdentified: string
  reasonForRecommendation: string
  immediateActionPlan: string
  recommendedInvestigations: string
  monitoringPlan: string
  needForIntensivistReview: string
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
    showSubjectiveNote: false,
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
    showClinicalNote: false,
    examinationText: '',
    impression: '',
    showImpressionNote: false,
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
    showIntensivistNote: false,
    showOverallNote: false,
    overallNotes: '',
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

  const problemKeys: string[] = []
  const isHypoxemia = !Number.isNaN(spo2) && spo2 < (VITAL_THRESHOLDS.spo2.normal?.low ?? 94)
  const isHypotension = !Number.isNaN(bp.sys) && bp.sys < (VITAL_THRESHOLDS.bp.systolic.normal?.low ?? 100)
  const isTachycardia = !Number.isNaN(pulse) && pulse > (VITAL_THRESHOLDS.pulse.normal?.high ?? 100)
  const isTachypnea = !Number.isNaN(rr) && rr > (VITAL_THRESHOLDS.respiratoryRate.warning?.high ?? 24)
  const isFever = !Number.isNaN(temp) && temp >= (VITAL_THRESHOLDS.temperature.warning?.high ?? 38)

  if (isHypoxemia) problemKeys.push('hypoxemia')
  if (isHypotension) problemKeys.push('hypotension')
  if (isTachycardia) problemKeys.push('tachycardia')
  if (isTachypnea) problemKeys.push('respiratory_distress')
  if (isFever) problemKeys.push('fever')
  if (form.urineOutputExam !== 'Adequate') problemKeys.push('suspectedSepsis')
  if (form.generalCondition === 'Toxic' || form.generalCondition === 'Drowsy' || form.generalCondition === 'Unresponsive') {
    problemKeys.push('alteredConsciousness')
  }

  const currentClinicalStatus = [
    `Patient is ${form.generalCondition.toLowerCase()} on review.`,
    `Respiratory status is ${form.respiratory.toLowerCase()}.`,
    `Cardiovascular status is ${form.cardiovascular.toLowerCase()}.`,
    `Neurological status is ${form.cns.toLowerCase()}.`,
  ].join(' ')

  const majorClinicalProblems = problemKeys.length
    ? `Current concerns: ${[...new Set(problemKeys)].join(', ')}.`
    : 'No major red flags identified at this review.'

  const aiRecommendedActions = [
    'Continue current monitoring and reassess vitals at the next scheduled interval.',
    ...(form.generalCondition === 'Toxic' || form.generalCondition === 'Unresponsive' ? ['Escalate for urgent review.'] : []),
    ...(form.respiratory !== 'Normal' ? ['Consider oxygen support and repeat respiratory assessment.'] : []),
    ...(form.cardiovascular === 'Hypotension' ? ['Review fluid status and blood pressure response.'] : []),
    ...(form.urineOutputExam !== 'Adequate' ? ['Monitor urine output closely and reassess renal perfusion.'] : []),
  ].join(' ')

  // Map problem keys to investigations using the configurable mapping
  const investigationsSet = new Set<string>()
  problemKeys.forEach((k) => {
    const list = INVESTIGATIONS[k]
    if (list && Array.isArray(list)) list.forEach((i) => investigationsSet.add(i))
  })

  const suggestedInvestigations = investigationsSet.size ? Array.from(investigationsSet).join(', ') : 'No new investigations required at this time.'

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

  // Escalation advice based on triage config
  const triageResult = computeTriageFromVitals(form.objective, `${form.generalCondition} ${form.cns} ${form.respiratory} ${form.examinationText}`)
  const needForIntensivist = triageResult.level === 'RED' || triageResult.level === 'BLACK'
    ? ALERTS.callKlinimateIntensivistImmediately.recommendedAction
    : triageResult.level === 'YELLOW'
      ? ALERTS.notifyKlinimateIntensivist.recommendedAction
      : ALERTS.noEscalationRequired.recommendedAction

  return {
    clinicalSummary: currentClinicalStatus,
    problemsIdentified: majorClinicalProblems,
    reasonForRecommendation: whyRecommended,
    immediateActionPlan: aiRecommendedActions,
    recommendedInvestigations: suggestedInvestigations,
    monitoringPlan: suggestedInitialManagement,
    needForIntensivistReview: needForIntensivist,
  }
}

function createReminders(patient: Patient, form: ReturnType<typeof createInitialForm>) {
  const reminders: string[] = []
  const bp = parseBP(form.objective.bp)
  const pulse = parseNumber(form.objective.pulse)
  const spo2 = parseNumber(form.objective.spo2)

  if (!Number.isNaN(bp.sys) && (bp.sys < (VITAL_THRESHOLDS.bp.systolic.normal?.low ?? 100) || bp.sys > (VITAL_THRESHOLDS.bp.systolic.warning?.high ?? 160))) reminders.push('Repeat BP in 30 minutes')
  if (!Number.isNaN(spo2) && spo2 < (VITAL_THRESHOLDS.spo2.warning?.low ?? 90)) reminders.push('Repeat SpO₂ and ABG')
  if (!Number.isNaN(pulse) && pulse > (VITAL_THRESHOLDS.pulse.normal?.high ?? 100)) reminders.push('Repeat pulse and ECG review')
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
  const [recommendation, setRecommendation] = useState('Notify Klinimate Intensivist immediately.')
  const [recommendationReason, setRecommendationReason] = useState('Patient requires review based on current clinical status.')
  const [rounds, setRounds] = useState<DailyProgressRoundEntry[]>([])
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    const nextAssessment = createAssessmentDraft(form)
    setAssessment(nextAssessment)
  }, [form])

  const locationLabel = patient.room.includes('ICU') ? 'ICU' : 'Ward'
  const bedNumber = patient.room.match(/(\d+)/)?.[1] ?? '—'
  const reminders = useMemo(() => createReminders(patient, form), [patient, form])
  const triage = useMemo(() => computeTriageFromVitals(form.objective, `${form.generalCondition} ${form.cns} ${form.respiratory} ${form.examinationText}`), [form])

  function updateField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleSection(key: 'showSubjectiveNote' | 'showClinicalNote' | 'showImpressionNote' | 'showIntensivistNote' | 'showOverallNote') {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }))
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

      <div className={`rounded-2xl p-4 text-sm font-medium shadow-sm ${triage.colorClass}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-90">Klinimate Triage</p>
            <p className="mt-1 text-lg font-semibold">{triage.label}</p>
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-xs">Bedside review</div>
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
          <h4 className="text-sm font-semibold text-text">1. Vitals</h4>
          <span className="text-xs text-text-muted">Quick entry</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'bp', label: 'BP' },
            { key: 'pulse', label: 'Pulse' },
            { key: 'respiratoryRate', label: 'RR' },
            { key: 'temperature', label: 'Temp' },
            { key: 'spo2', label: 'SpO₂' },
            { key: 'bloodSugar', label: 'Sugar' },
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
          <h4 className="text-sm font-semibold text-text">2. Clinical Status</h4>
          <span className="text-xs text-text-muted">Tap to select</span>
        </div>
        <div className="space-y-3 rounded-2xl border border-border bg-surface-muted p-3">
          <ChoiceChipGroup label="Subjective" options={['Better', 'Same', 'Worse', 'New complaint']} selected={form.subjective} onSelect={(value) => updateField('subjective', value)} notes={form.subjectiveText} onNotesChange={(value) => updateField('subjectiveText', value)} showNotes={form.showSubjectiveNote} onToggleNotes={() => toggleSection('showSubjectiveNote')} noteLabel="Subjective note" />
          <ChoiceChipGroup label="General condition" options={['Comfortable', 'Stable', 'Sick', 'Toxic', 'Drowsy', 'Unresponsive']} selected={form.generalCondition} onSelect={(value) => updateField('generalCondition', value)} />
          <ChoiceChipGroup label="Respiratory" options={['Normal', 'Mild respiratory distress', 'Moderate respiratory distress', 'Severe respiratory distress']} selected={form.respiratory} onSelect={(value) => updateField('respiratory', value)} />
          <ChoiceChipGroup label="Cardiovascular" options={['Stable', 'Tachycardia', 'Hypotension']} selected={form.cardiovascular} onSelect={(value) => updateField('cardiovascular', value)} />
          <ChoiceChipGroup label="CNS" options={['Alert', 'Drowsy', 'Confused', 'Unresponsive']} selected={form.cns} onSelect={(value) => updateField('cns', value)} />
          <ChoiceChipGroup label="Urine output" options={['Adequate', 'Reduced', 'No urine output']} selected={form.urineOutputExam} onSelect={(value) => updateField('urineOutputExam', value)} />
          <ChoiceChipGroup label="Clinical note" options={['Add note']} selected={form.showClinicalNote ? 'Add note' : ''} onSelect={() => toggleSection('showClinicalNote')} notes={form.examinationText} onNotesChange={(value) => updateField('examinationText', value)} showNotes={form.showClinicalNote} onToggleNotes={() => toggleSection('showClinicalNote')} noteLabel="Clinical note" />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">3. Investigations</h4>
          <span className="text-xs text-text-muted">Short list</span>
        </div>
        <div className="grid gap-2 rounded-2xl border border-border bg-surface-muted p-3">
          {[['orderInvestigations', 'Order investigations'], ['repeatInvestigations', 'Repeat investigations'], ['reviewInvestigations', 'Review investigations']].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-text">
              <input type="checkbox" checked={form.managementPlan[key as keyof typeof form.managementPlan]} onChange={() => toggleManagementPlan(key as keyof typeof form.managementPlan)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">4. Treatment</h4>
          <span className="text-xs text-text-muted">Care plan</span>
        </div>
        <div className="grid gap-2 rounded-2xl border border-border bg-surface-muted p-3">
          {[
            ['continueCurrentTreatment', 'Continue current treatment'],
            ['oxygenTherapy', 'Oxygen therapy'],
            ['ivFluids', 'IV fluids'],
            ['antibiotics', 'Antibiotics'],
            ['shiftToICU', 'Shift to ICU'],
            ['referSpecialist', 'Refer specialist'],
            ['notifyIntensivist', 'Notify Klinimate Intensivist'],
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
          <h4 className="text-sm font-semibold text-text">5. Klinimate AI Clinical Assessment</h4>
          <span className="text-xs text-text-muted">Editable</span>
        </div>
        <div className="space-y-2 rounded-2xl border border-border bg-surface-muted p-3">
          <label className="text-sm font-medium text-text">Clinical Summary</label>
          <TextArea label="" rows={2} value={assessment.clinicalSummary} onChange={(event) => setAssessment((prev) => ({ ...prev, clinicalSummary: event.target.value }))} />
          <label className="text-sm font-medium text-text">Problems Identified</label>
          <TextArea label="" rows={2} value={assessment.problemsIdentified} onChange={(event) => setAssessment((prev) => ({ ...prev, problemsIdentified: event.target.value }))} />
          <label className="text-sm font-medium text-text">Reason for Recommendation</label>
          <TextArea label="" rows={2} value={assessment.reasonForRecommendation} onChange={(event) => setAssessment((prev) => ({ ...prev, reasonForRecommendation: event.target.value }))} />
          <label className="text-sm font-medium text-text">Immediate Action Plan</label>
          <TextArea label="" rows={2} value={assessment.immediateActionPlan} onChange={(event) => setAssessment((prev) => ({ ...prev, immediateActionPlan: event.target.value }))} />
          <label className="text-sm font-medium text-text">Recommended Investigations</label>
          <TextArea label="" rows={2} value={assessment.recommendedInvestigations} onChange={(event) => setAssessment((prev) => ({ ...prev, recommendedInvestigations: event.target.value }))} />
          <label className="text-sm font-medium text-text">Monitoring Plan</label>
          <TextArea label="" rows={2} value={assessment.monitoringPlan} onChange={(event) => setAssessment((prev) => ({ ...prev, monitoringPlan: event.target.value }))} />
          <label className="text-sm font-medium text-text">Need for Klinimate Intensivist Review</label>
          <TextArea label="" rows={2} value={assessment.needForIntensivistReview} onChange={(event) => setAssessment((prev) => ({ ...prev, needForIntensivistReview: event.target.value }))} />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">6. Consultant Recommendation</h4>
          <span className="text-xs text-text-muted">Editable</span>
        </div>
        <div className="space-y-3 rounded-2xl border border-border bg-surface-muted p-3">
          <label className="text-sm font-medium text-text">Recommendation</label>
          <TextArea label="" rows={2} value={recommendation} onChange={(event) => setRecommendation(event.target.value)} />
          <label className="text-sm font-medium text-text">Reason for Recommendation</label>
          <TextArea label="" rows={2} value={recommendationReason} onChange={(event) => setRecommendationReason(event.target.value)} />
          <button type="button" className="text-sm font-medium text-primary-700" onClick={() => toggleSection('showIntensivistNote')}>Add manual note</button>
          {form.showIntensivistNote ? <TextArea label="Manual note" rows={2} value={form.intensivistRecommendations} onChange={(event) => updateField('intensivistRecommendations', event.target.value)} /> : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">7. Manual Notes</h4>
          <span className="text-xs text-text-muted">Optional</span>
        </div>
        <TextArea label="Overall manual notes" rows={3} value={form.overallNotes} onChange={(event) => updateField('overallNotes', event.target.value)} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-text">8. Save Progress</h4>
          <span className="text-xs text-text-muted">Quick save</span>
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
