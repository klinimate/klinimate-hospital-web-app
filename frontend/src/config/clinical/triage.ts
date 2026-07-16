export type EscalationLevel = 'none' | 'ward' | 'intensivist' | 'admin'

export interface TriageCategory {
  colour: string
  title: string
  description: string
  clinicalCriteria: string[]
  immediateActions: string[]
  escalationLevel: EscalationLevel
}

export const TRIAGE: Record<'GREEN' | 'YELLOW' | 'RED' | 'BLACK', TriageCategory> = {
  GREEN: {
    colour: '#10B981',
    title: 'Green',
    description: 'Stable; routine monitoring and ward-level care',
    clinicalCriteria: [
      'SpO2 ≥ 94% on room air or baseline oxygen requirement',
      'Systolic BP within configured normal range',
      'Heart rate within configured normal range',
      'Patient alert and maintaining airway',
    ],
    immediateActions: [
      'Continue routine monitoring and medication',
      'Document subjective and objective findings',
      'Plan next review at scheduled interval',
    ],
    escalationLevel: 'ward',
  },

  YELLOW: {
    colour: '#F59E0B',
    title: 'Yellow',
    description: 'Potential deterioration; needs closer observation and repeat checks',
    clinicalCriteria: [
      'SpO2 90–93% or downward trend',
      'Systolic BP approaching lower/higher warning thresholds',
      'Tachycardia (HR above normal limit) or mild respiratory distress',
      'New or worsening clinical complaint',
    ],
    immediateActions: [
      'Repeat vitals and document trends',
      'Increase monitoring frequency and oxygen as indicated',
      'Consider urgent investigations per protocol',
      'Inform treating team / senior ward clinician',
    ],
    escalationLevel: 'ward',
  },

  RED: {
    colour: '#EF4444',
    title: 'Red',
    description: 'Acute deterioration; immediate bedside interventions and escalation',
    clinicalCriteria: [
      'SpO2 < 90% despite oxygen support',
      'Systolic BP < 90 mmHg or rapidly falling',
      'Severe respiratory distress or oxygenation failure',
      'Altered conscious state (new)',
    ],
    immediateActions: [
      'Implement immediate resuscitation measures per local protocol',
      'Secure airway and oxygenation; escalate oxygen/ventilation as needed',
      'Call for urgent senior review and notify Klinimate Intensivist',
      'Prepare for transfer to higher level of care if indicated',
    ],
    escalationLevel: 'intensivist',
  },

  BLACK: {
    colour: '#111827',
    title: 'Black',
    description: 'Imminent or confirmed circulatory/respiratory arrest, end-of-life or non-survivable condition',
    clinicalCriteria: [
      'Cardiac arrest / no palpable pulse',
      'No respiratory effort and not responding to resuscitation',
      'Comfort-only goals documented and active palliative pathway',
    ],
    immediateActions: [
      'Follow advanced life support or local end-of-life protocol',
      'Call code team immediately',
      'Notify Klinimate Admin and treating consultant',
    ],
    escalationLevel: 'admin',
  },
}

export default TRIAGE
