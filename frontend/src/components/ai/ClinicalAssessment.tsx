import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Patient } from '@/data/patients'
import { computeTriageForPatient } from '@/lib/triage'
import VITAL_THRESHOLDS from '@/config/clinical/vitals'

interface Problem { key: string; label: string; reason: string }
interface Recommendation { id: string; title: string; reason: string; suggested?: boolean }

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

export function ClinicalAssessment({ patient }: { patient: Patient }) {
  const triage = useMemo(() => computeTriageForPatient(patient), [patient])
  const [editableRecs, setEditableRecs] = useState<Record<string, Recommendation>>({})
  const [showWhy, setShowWhy] = useState(false)

  const problems: Problem[] = useMemo(() => {
    const out: Problem[] = []
    const bp = parseBP(patient.vitals.bp)
    const pulse = parseNumber(patient.vitals.pulse)
    const temp = parseNumber(patient.vitals.temperature)
    const rr = parseNumber(patient.vitals.respiratoryRate)
    const spo2 = parseNumber(patient.vitals.spo2)
    const sugar = parseNumber(patient.vitals.bloodSugar)

    const isHypoxemia = !Number.isNaN(spo2) && spo2 < (VITAL_THRESHOLDS.spo2.normal?.low ?? 94)
    const isHypotension = !Number.isNaN(bp.sys) && bp.sys < (VITAL_THRESHOLDS.bp.systolic.normal?.low ?? 100)
    const isTachycardia = !Number.isNaN(pulse) && pulse > (VITAL_THRESHOLDS.pulse.normal?.high ?? 100)
    const isFever = !Number.isNaN(temp) && temp >= (VITAL_THRESHOLDS.temperature.warning?.high ?? 38)
    const isTachypnea = !Number.isNaN(rr) && rr > (VITAL_THRESHOLDS.respiratoryRate.normal?.high ?? 20)

    if (isHypoxemia) {
      out.push({ key: 'hypoxemia', label: 'Hypoxemia', reason: `SpO₂ ${patient.vitals.spo2} is below ${VITAL_THRESHOLDS.spo2.normal?.low ?? 94}%` })
    }
    if (isHypotension) {
      out.push({ key: 'hypotension', label: 'Hypotension', reason: `Systolic BP ${bp.sys} mmHg is below ${VITAL_THRESHOLDS.bp.systolic.normal?.low ?? 100} mmHg` })
    }
    if (isTachycardia) {
      out.push({ key: 'tachycardia', label: 'Tachycardia', reason: `Pulse ${patient.vitals.pulse} bpm is elevated over ${VITAL_THRESHOLDS.pulse.normal?.high ?? 100}` })
    }
    // Oliguria detection via notes keywords (best-effort)
    const notesText = (patient.notes || []).join(' ').toLowerCase()
    if (/(oliguria|reduced urine|low urine|reduced urine output)/.test(notesText)) {
      out.push({ key: 'oliguria', label: 'Oliguria', reason: 'Documentation suggests reduced urine output' })
    }
    if (isFever) {
      out.push({ key: 'fever', label: 'Fever', reason: `Temperature ${patient.vitals.temperature} indicates fever` })
    }
    if (isTachypnea) {
      out.push({ key: 'respiratory_distress', label: 'Respiratory distress', reason: `Respiratory rate ${patient.vitals.respiratoryRate} /min exceeds ${VITAL_THRESHOLDS.respiratoryRate.warning?.high ?? 24}` })
    }
    if (/(confused|drowsy|unresponsive|agitated|altered mental)/.test(notesText)) {
      out.push({ key: 'altered_mental', label: 'Altered mental status', reason: 'Notes suggest altered mental status' })
    }
    if (!Number.isNaN(sugar) && sugar > 180) {
      out.push({ key: 'hyperglycemia', label: 'Hyperglycemia', reason: `Blood sugar ${patient.vitals.bloodSugar} is high` })
    }
    if (!Number.isNaN(sugar) && sugar < 70) {
      out.push({ key: 'hypoglycemia', label: 'Hypoglycemia', reason: `Blood sugar ${patient.vitals.bloodSugar} is low` })
    }

    return out
  }, [patient])

  const recommendations = useMemo(() => {
    const recs: Recommendation[] = []
    const push = (id: string, title: string, reason: string) => {
      if (!recs.find((r) => r.id === id)) recs.push({ id, title, reason, suggested: true })
    }

    // General baseline actions
    push('iv-access', 'Establish IV access', 'Patient may require fluids, medicines or emergency interventions')
    push('cardiac-leads', 'Apply cardiac/chest leads', 'Continuous cardiac monitoring for at-risk patients')

    // Problem-specific
    if (problems.find((p) => p.key === 'hypoxemia')) {
      push('oxygen', 'Start oxygen therapy', `SpO₂ ${patient.vitals.spo2} indicates hypoxemia`)
      push('abg', 'Send ABG', 'Evaluate oxygenation, ventilation and acid-base status')
    }
    if (problems.find((p) => p.key === 'hypotension')) {
      push('iv-fluids', 'Start IV fluids (bolus if indicated)', 'Hypotension suggests possible hypoperfusion')
      push('rft', 'Send RFT', 'Assess renal perfusion and baseline renal function')
      push('lactate', 'Send serum lactate', 'Assess tissue perfusion and shock severity')
    }
    if (problems.find((p) => p.key === 'tachycardia')) {
      push('ecg', 'Send ECG', 'Tachycardia or chest symptoms warrant ECG')
      push('troponin', 'Send troponin', 'Assess for myocardial injury when chest pain or tachycardia present')
    }
    if (problems.find((p) => p.key === 'fever')) {
      push('cbc', 'Send CBC + CRP', 'Evaluate for infection and inflammatory response')
      push('blood-cultures', 'Send blood cultures (if infection suspected)', 'Identify bloodstream infection before antibiotics when possible')
      push('antipyretic', 'Give antipyretic', 'Reduce fever and improve comfort')
    }
    if (problems.find((p) => p.key === 'respiratory_distress')) {
      push('cxr', 'Send Chest X-ray', 'Assess for consolidation, pulmonary edema or other causes')
      push('abg-2', 'Send ABG', 'Assess oxygenation and ventilation during respiratory distress')
    }
    if (problems.find((p) => p.key === 'altered_mental')) {
      push('neuro', 'Reassess neurological status and consider CT brain', 'Altered consciousness may indicate central process')
    }
    if (problems.find((p) => p.key === 'oliguria')) {
      push('urine-output', 'Monitor urine output hourly', 'Urine output reflects kidney perfusion and overall circulation')
      push('rft-2', 'Send RFT', 'Assess renal function and electrolyte status')
    }
    if (problems.find((p) => p.key === 'hyperglycemia' || p.key === 'hypoglycemia')) {
      push('glucose', 'Correct blood glucose as indicated', 'Abnormal glucose needs prompt correction to avoid complications')
    }

    // Escalation based on triage
    if (triage.level === 'RED' || triage.level === 'BLACK') {
      push('notify', 'Notify Klinimate Intensivist immediately', 'Red flag triage requires specialist review')
      push('repeat-vitals', 'Repeat vital signs every 15 minutes', 'Early detection of deterioration')
    }

    return recs
  }, [patient, problems, triage])

  function toggleComplete(id: string) {
    setEditableRecs((s) => {
      const copy = { ...s }
      if (copy[id]) {
        copy[id].suggested = !copy[id].suggested
      } else {
        const base = recommendations.find((r) => r.id === id)
        if (base) copy[id] = { ...base }
      }
      return copy
    })
  }

  function editReason(id: string) {
    const current = editableRecs[id] || recommendations.find((r) => r.id === id)
    const next = window.prompt('Edit reason for recommendation', current?.reason || '')
    if (!next) return
    setEditableRecs((s) => ({ ...s, [id]: { ...(s[id] || recommendations.find((r) => r.id === id) || {}), reason: next } }))
  }

  const impression = useMemo(() => {
    if (triage.level === 'GREEN') return 'Patient appears clinically stable based on current data.'
    const parts: string[] = []
    if (problems.length) {
      parts.push(`Patient has ${problems.map((p) => p.label.toLowerCase()).join(' and ')}.`)
    }
    if (triage.level === 'RED') parts.push('Findings suggest clinical instability; consider urgent escalation and close monitoring.')
    if (triage.level === 'YELLOW') parts.push('Patient requires early review and repeated observations.')
    if (triage.level === 'BLACK') parts.push('Unresponsive or critically unwell — immediate resuscitation and specialist review required.')
    return parts.join(' ')
  }, [triage, problems])

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text">Klinimate AI Clinical Assessment</h3>
          <p className="mt-1 text-xs text-text-muted">{triage.label} · <span className="font-medium">Rule-based Assessment</span></p>
        </div>
        <div className="text-sm text-text-muted">Confidence: Rule-based Assessment</div>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <div className={`rounded-2xl px-4 py-3 ${triage.colorClass} text-white`}>{triage.label}</div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text">Major clinical problems</h4>
          {problems.length ? (
            <ul className="mt-2 list-disc pl-5 text-sm text-text-muted">
              {problems.map((p) => (
                <li key={p.key}>{p.label}: <span className="text-text">{p.reason}</span></li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-text-muted">No major problems identified.</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text">AI Clinical Impression</h4>
          <p className="mt-2 text-sm text-text-muted">{impression}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text">Recommended actions</h4>
          <div className="mt-2 space-y-2">
            {recommendations.map((r) => {
              const editable = editableRecs[r.id]
              const checked = editable ? editable.suggested : r.suggested
              const reason = editable ? editable.reason : r.reason
              return (
                <div key={r.id} className="flex items-start justify-between gap-3 rounded-xl bg-surface-muted p-3">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked={!!checked} onChange={() => toggleComplete(r.id)} className="mt-1 h-4 w-4" />
                    <div>
                      <div className="font-medium text-text">{r.title}</div>
                      <div className="mt-1 text-xs text-text-muted">Reason: {reason}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="md" variant="ghost" onClick={() => editReason(r.id)}>Edit</Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <button className="text-sm text-primary-600" onClick={() => setShowWhy((s) => !s)}>
            {showWhy ? 'Hide' : 'Why is Klinimate recommending this?'}
          </button>
          {showWhy ? (
            <div className="mt-2 rounded-xl bg-white p-3 text-sm text-text-muted border border-border">
              <ul className="list-disc pl-5">
                {problems.map((p) => (
                  <li key={p.key}>{p.reason}</li>
                ))}
                {problems.length === 0 && <li>No rule-based red flags detected from vitals and notes.</li>}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="text-xs text-text-muted">Disclaimer: Klinimate AI provides clinical decision support to assist healthcare professionals. Clinical decisions remain the responsibility of the treating physician.</div>
      </div>
    </Card>
  )
}

export default ClinicalAssessment
