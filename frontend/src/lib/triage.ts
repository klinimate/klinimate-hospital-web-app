export type TriageLevel = 'GREEN' | 'YELLOW' | 'RED' | 'BLACK'

interface TriageResult {
  level: TriageLevel
  label: string
  colorClass: string
  redFlags: string[]
  recommendedActions: string[]
  alertMessage?: string
}

function parseNumber(value?: string) {
  if (!value) return NaN
  const matched = value.match(/-?\d+/)
  return matched ? Number(matched[0]) : NaN
}

export function computeTriageFromVitals(vitals: Record<string, string>, patientText = ''): TriageResult {
  const systolic = parseNumber(vitals.bp)
  const hr = parseNumber(vitals.pulse)
  const spo2 = parseNumber(vitals.spo2)
  const temp = parseNumber(vitals.temperature)

  const redFlags: string[] = []

  // BLACK criteria (best-effort heuristics)
  if (/unresponsive|no response|no palpable pulse|no pulse|cardiac arrest/i.test(patientText)) {
    redFlags.push('Unresponsive / no signs of life')
    return {
      level: 'BLACK',
      label: 'BLACK – Cardiac Arrest / No Signs of Life',
      colorClass: 'bg-black text-white',
      redFlags,
      recommendedActions: [
        'Start CPR/ACLS immediately',
        'Activate Code Blue',
        'Klinimate Intensivist notified',
      ],
      alertMessage: '⚫ Code Blue Activated – Klinimate Intensivist Alerted',
    }
  }

  // RED criteria
  if ((spo2 && spo2 < 90) || (systolic && systolic < 90) || (hr && hr > 120) || /altered mental status|confused|agitated/i.test(patientText)) {
    if (spo2 && spo2 < 90) redFlags.push(`SpO₂ ${spo2}%`)
    if (systolic && systolic < 90) redFlags.push(`SBP ${systolic} mmHg`)
    if (hr && hr > 120) redFlags.push(`HR ${hr}/min`)
    if (/dehydration|dry lips|poor skin turgor|sunken eyes/i.test(patientText)) redFlags.push('Signs of dehydration')

    return {
      level: 'RED',
      label: 'RED – Critical',
      colorClass: 'bg-rose-600 text-white',
      redFlags,
      recommendedActions: [
        'Immediate medical review',
        'Klinimate Intensivist notified',
        'Start emergency management',
        'Prepare ICU admission or referral',
      ],
      alertMessage: '🔴 Urgent Alert Sent to Klinimate Intensivist',
    }
  }

  // YELLOW criteria
  if ((spo2 && spo2 < 94) || (systolic && systolic < 100) || (hr && hr > 100) || (temp && temp >= 38) || /chest pain|breathless|breathlessness|mild respiratory/i.test(patientText)) {
    if (spo2 && spo2 < 94) redFlags.push(`SpO₂ ${spo2}%`)
    if (systolic && systolic < 100) redFlags.push(`SBP ${systolic} mmHg`)
    if (hr && hr > 100) redFlags.push(`HR ${hr}/min`)
    if (temp && temp >= 38) redFlags.push(`Temp ${temp}°C`)

    return {
      level: 'YELLOW',
      label: 'YELLOW – Needs Review',
      colorClass: 'bg-amber-400 text-amber-900',
      redFlags,
      recommendedActions: [
        'Review by treating doctor',
        'Repeat vital signs',
        'Order appropriate investigations',
        'Increase monitoring frequency',
        'Klinimate Intensivist will be notified automatically',
      ],
      alertMessage: '🟡 Klinimate Intensivist Notified – Awaiting Clinical Review',
    }
  }

  // Default GREEN
  return {
    level: 'GREEN',
    label: 'GREEN – Stable',
    colorClass: 'bg-emerald-600 text-white',
    redFlags: [],
    recommendedActions: [
      'Continue routine management',
      'Routine monitoring',
      'Continue treatment as planned',
    ],
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
