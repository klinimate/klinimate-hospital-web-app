import type { Patient } from '@/data/patients'
import type { TriageLevel } from '@/lib/triage'

export interface PatientIntelligenceSnapshot {
  updatedLabel: string
  triage: {
    level: TriageLevel
    display: 'Green' | 'Yellow' | 'Red' | 'Black'
    emoji: string
    urgencyLabel: string
    recommendedReview: string
  }
  confidence: {
    label: 'Low' | 'Moderate' | 'High'
    percent: number
  }
  primaryClinicalImpression: string
  primaryRecommendation: string
  clinicalSummary: string
  probableDiagnoses: string[]
  differentialDiagnoses: string[]
  redFlagFindings: string[]
  investigations: {
    urgent: string[]
    routine: string[]
  }
  initialManagementPlan: string[]
  specialistRecommendation: {
    specialty: string
    reason: string
  }
  whyTheseDiagnoses: string[]
  nextActions: string[]
}

function normalizeTriage(level: TriageLevel): PatientIntelligenceSnapshot['triage'] {
  if (level === 'RED') {
    return {
      level,
      display: 'Red',
      emoji: '🔴',
      urgencyLabel: 'Needs Immediate Clinical Review',
      recommendedReview: 'Immediately',
    }
  }

  if (level === 'BLACK') {
    return {
      level,
      display: 'Black',
      emoji: '⚫',
      urgencyLabel: 'Critical Resuscitation Required',
      recommendedReview: 'Immediate emergency response',
    }
  }

  if (level === 'YELLOW') {
    return {
      level,
      display: 'Yellow',
      emoji: '🟡',
      urgencyLabel: 'Needs Urgent Clinical Review',
      recommendedReview: 'Within 15 minutes',
    }
  }

  return {
    level,
    display: 'Green',
    emoji: '🟢',
    urgencyLabel: 'Continue Standard Clinical Monitoring',
    recommendedReview: 'Routine review',
  }
}

export function buildPatientIntelligence(
  patient: Patient,
  triageLevel: TriageLevel,
): PatientIntelligenceSnapshot {
  const triage = normalizeTriage(triageLevel)

  return {
    updatedLabel: '2 minutes ago',
    triage,
    confidence: {
      label: triageLevel === 'GREEN' ? 'High' : triageLevel === 'YELLOW' ? 'High' : 'Moderate',
      percent: triageLevel === 'GREEN' ? 91 : triageLevel === 'YELLOW' ? 94 : 88,
    },
    primaryClinicalImpression:
      triageLevel === 'YELLOW'
        ? 'Community Acquired Pneumonia'
        : triageLevel === 'RED'
          ? 'Evolving Severe Respiratory Infection'
          : 'Acute Medical Condition Under Monitoring',
    primaryRecommendation:
      triageLevel === 'GREEN' ? 'Continue Local Clinical Management' : 'Urgent Clinical Review',
    clinicalSummary:
      `${patient.name}, ${patient.age}/${patient.gender}, with ${patient.chiefComplaint.toLowerCase()} and active episode in ${patient.department}. Current data suggests ${triage.urgencyLabel.toLowerCase()}. Continue focused reassessment with timeline-based updates as new vitals, notes, investigations, and medications are recorded.`,
    probableDiagnoses: [
      'Community Acquired Pneumonia',
      'Early Sepsis',
      'Acute Bronchitis',
    ],
    differentialDiagnoses: [
      'Acute Exacerbation of COPD / Reactive Airway Disease',
      'Pulmonary Embolism',
      'Cardiogenic Pulmonary Edema',
    ],
    redFlagFindings: [
      'Low Oxygen Saturation',
      'Respiratory Rate elevated',
      'Persistent Fever',
      'Tachycardia',
    ],
    investigations: {
      urgent: [
        'CBC with differential',
        'ABG',
        'Chest X-ray',
        'Serum lactate',
      ],
      routine: ['CRP', 'Blood Culture', 'Renal Function Tests', 'Liver Function Tests'],
    },
    initialManagementPlan: [
      'Start Oxygen',
      'IV Fluids',
      'Broad-spectrum Antibiotics',
      'Continuous Monitoring',
      'Repeat Vitals',
    ],
    specialistRecommendation: {
      specialty: triageLevel === 'GREEN' ? 'General Physician' : 'Intensivist',
      reason:
        triageLevel === 'GREEN'
          ? 'Current findings support local team-led management with continued monitoring.'
          : 'Combination of respiratory compromise and systemic inflammatory features warrants specialist review.',
    },
    whyTheseDiagnoses: [
      'SpO₂ below expected range with elevated respiratory rate.',
      'Fever with tachycardia suggests active inflammatory/infective process.',
      'Clinical presentation and timeline trends support a respiratory source.',
    ],
    nextActions: [
      'Start Oxygen',
      'Order Investigations',
      'Consult Intensivist',
      'Repeat Vitals',
      'Review in 30 minutes',
    ],
  }
}
