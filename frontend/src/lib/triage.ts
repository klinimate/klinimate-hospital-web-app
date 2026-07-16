import { TRIAGE } from '@/config/clinical/triage'
import VITAL_THRESHOLDS from '@/config/clinical/vitals'
import ALERTS from '@/config/clinical/alerts'
import ACTION_CHECKLISTS from '@/config/clinical/actions'

export type TriageLevel = 'GREEN' | 'YELLOW' | 'RED' | 'BLACK'

interface TriageResult {
  level: TriageLevel
  label: string
  colour: string
  escalationLevel: string
  colorClass: string
  redFlags: string[]
  recommendedActions: string[]
  alertMessage?: string
}

function parseNumber(value?: string) {
  if (!value) return NaN
  const matched = value.match(/-?\d+(?:\.\d+)?/)
  return matched ? Number(matched[0]) : NaN
}

function hasCriticalKeyword(text: string) {
  return /cardiac arrest|no palpable pulse|no pulse|no signs of life|unresponsive/i.test(text)
}

export function computeTriageFromVitals(vitals: Record<string, string>, patientText = ''): TriageResult {
  const systolic = parseNumber(vitals.bp)
  const hr = parseNumber(vitals.pulse)
  const spo2 = parseNumber(vitals.spo2)
  const temp = parseNumber(vitals.temperature)
  const rr = parseNumber(vitals.respiratoryRate)

  const redFlags: string[] = []

  // BLACK: immediate life-threat based on notes/keywords
  if (hasCriticalKeyword(patientText)) {
    redFlags.push('Unresponsive / no signs of life')
    const cat = TRIAGE.BLACK
    return {
      level: 'BLACK',
      label: `${cat.title} – ${cat.description}`,
      colour: cat.colour,
      escalationLevel: cat.escalationLevel,
      colorClass: 'bg-black text-white',
      redFlags,
      recommendedActions: ACTION_CHECKLISTS.BLACK,
      alertMessage: ALERTS.callKlinimateIntensivistImmediately.recommendedAction,
    }
  }

  // RED: any critical thresholds
  const isRed = (typeof spo2 === 'number' && !Number.isNaN(spo2) && spo2 <= (VITAL_THRESHOLDS.spo2.critical?.high ?? 89)) ||
    (typeof systolic === 'number' && !Number.isNaN(systolic) && systolic < (VITAL_THRESHOLDS.bp.systolic.warning?.low ?? 90)) ||
    (typeof hr === 'number' && !Number.isNaN(hr) && hr > (VITAL_THRESHOLDS.pulse.warning?.high ?? 120)) ||
    (/(altered mental status|confused|agitated|unresponsive)/i.test(patientText))

  if (isRed) {
    if (!Number.isNaN(spo2)) redFlags.push(`SpO₂ ${spo2}%`)
    if (!Number.isNaN(systolic)) redFlags.push(`SBP ${systolic} mmHg`)
    if (!Number.isNaN(hr)) redFlags.push(`HR ${hr}/min`)
    const cat = TRIAGE.RED
    return {
      level: 'RED',
      label: `${cat.title} – ${cat.description}`,
      colour: cat.colour,
      escalationLevel: cat.escalationLevel,
      colorClass: 'bg-rose-600 text-white',
      redFlags,
      recommendedActions: ACTION_CHECKLISTS.RED,
      alertMessage: ALERTS.callKlinimateIntensivistImmediately.recommendedAction,
    }
  }

  // YELLOW: warning thresholds
  const isYellow = (typeof spo2 === 'number' && !Number.isNaN(spo2) && spo2 < (VITAL_THRESHOLDS.spo2.warning?.low ?? 94)) ||
    (typeof systolic === 'number' && !Number.isNaN(systolic) && systolic < (VITAL_THRESHOLDS.bp.systolic.normal?.low ?? 100)) ||
    (typeof hr === 'number' && !Number.isNaN(hr) && hr > (VITAL_THRESHOLDS.pulse.normal?.high ?? 100)) ||
    (typeof temp === 'number' && !Number.isNaN(temp) && temp >= (VITAL_THRESHOLDS.temperature.warning?.high ?? 38)) ||
    (typeof rr === 'number' && !Number.isNaN(rr) && rr > (VITAL_THRESHOLDS.respiratoryRate.warning?.high ?? 24)) ||
    (/chest pain|breathless|breathlessness|mild respiratory/i.test(patientText))

  if (isYellow) {
    if (!Number.isNaN(spo2)) redFlags.push(`SpO₂ ${spo2}%`)
    if (!Number.isNaN(systolic)) redFlags.push(`SBP ${systolic} mmHg`)
    if (!Number.isNaN(hr)) redFlags.push(`HR ${hr}/min`)
    const cat = TRIAGE.YELLOW
    return {
      level: 'YELLOW',
      label: `${cat.title} – ${cat.description}`,
      colour: cat.colour,
      escalationLevel: cat.escalationLevel,
      colorClass: 'bg-amber-500 text-white',
      redFlags,
      recommendedActions: ACTION_CHECKLISTS.YELLOW,
      alertMessage: ALERTS.notifyKlinimateIntensivist.recommendedAction,
    }
  }

  // Default GREEN
  const catGreen = TRIAGE.GREEN
  return {
    level: 'GREEN',
    label: `${catGreen.title} – ${catGreen.description}`,
    colour: catGreen.colour,
    escalationLevel: catGreen.escalationLevel,
    colorClass: 'bg-emerald-600 text-white',
    redFlags: [],
    recommendedActions: ACTION_CHECKLISTS.GREEN,
    alertMessage: ALERTS.noEscalationRequired.recommendedAction,
  }
}

export function computeTriageForPatient(patient: any) {
  const latestVitals = (patient.vitalsTimeline && patient.vitalsTimeline[patient.vitalsTimeline.length - 1]) || patient.vitals || {}
  const patientText = [patient.chiefComplaint, patient.presentingComplaint, patient.history, (patient.notes || []).join(' ')].join(' ')
  return computeTriageFromVitals({
    bp: latestVitals.bp || patient.vitals.bp,
    pulse: latestVitals.pulse || patient.vitals.pulse,
    temperature: latestVitals.temperature || patient.vitals.temperature,
    respiratoryRate: latestVitals.respiratoryRate || patient.vitals.respiratoryRate,
    spo2: latestVitals.spo2 || patient.vitals.spo2,
    bloodSugar: latestVitals.bloodSugar || patient.vitals.bloodSugar,
  }, patientText)
}
