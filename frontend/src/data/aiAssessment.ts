export type TriageLevel = 'Green' | 'Yellow' | 'Red' | 'Black'

export interface AIAssessmentData {
  patientName: string
  triage: TriageLevel
  confidenceScore: number
  summary: string
  probableDiagnosis: string[]
  differentialDiagnosis: string[]
  investigations: string[]
  treatmentPlan: string[]
  escalationRecommendation: string
  specialty: string
}

export function buildMockAssessment(patientName: string): AIAssessmentData {
  return {
    patientName,
    triage: 'Yellow',
    confidenceScore: 94,
    summary:
      '52-year-old patient with fever, productive cough, tachypnea, and mild hypoxemia. Clinical pattern is concerning for community-acquired lower respiratory infection with early systemic involvement. Immediate stabilization, diagnostics, and close reassessment are advised.',
    probableDiagnosis: [
      'Community-acquired pneumonia (moderate severity)',
      'Acute lower respiratory tract infection with hypoxemia',
      'Early sepsis secondary to pulmonary source',
    ],
    differentialDiagnosis: [
      'Acute exacerbation of chronic obstructive airway disease',
      'Pulmonary embolism (if disproportionate hypoxia persists)',
      'Cardiogenic pulmonary edema with superimposed infection',
    ],
    investigations: [
      'CBC with differential',
      'CRP and procalcitonin',
      'Serum lactate and blood cultures before antibiotics',
      'Chest X-ray PA view',
      'ABG if respiratory distress worsens',
      'Renal and liver function tests',
    ],
    treatmentPlan: [
      'Start oxygen to target SpO2 >= 94%',
      'Begin empiric IV antibiotics as per hospital protocol',
      'IV fluids with hemodynamic monitoring',
      'Antipyretic and supportive care',
      'Vitals and early warning monitoring every 2 hours',
    ],
    escalationRecommendation:
      'Escalate to senior clinician review within 30 minutes if respiratory distress persists or saturation falls below 92% despite oxygen support.',
    specialty: 'Pulmonology / Critical Care',
  }
}
