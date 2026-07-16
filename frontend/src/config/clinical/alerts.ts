/**
 * Alerts configuration
 * Describes triggers for escalation actions. Rules are declarative strings
 * so the UI or evaluation service can interpret them programmatically.
 */

export interface AlertRule {
  id: string
  description: string
  criteria: string[]
  recommendedAction: string
}

export const ALERTS = {
  notifyKlinimateIntensivist: {
    id: 'notify-intensivist',
    description: 'Notify Klinimate Intensivist as soon as practical for review',
    criteria: [
      'SpO2 90-93% on current support or downward trend',
      'Systolic BP 90-100 mmHg or symptomatic hypotension',
      'New altered mental status not meeting immediate arrest criteria',
    ],
    recommendedAction: 'Send message to Klinimate Intensivist; document time and response',
  } as AlertRule,

  callKlinimateIntensivistImmediately: {
    id: 'call-intensivist-immediate',
    description: 'Call Klinimate Intensivist immediately for urgent bedside input',
    criteria: [
      'SpO2 < 90% despite escalation of oxygen',
      'Systolic BP < 90 mmHg or rapidly falling',
      'Cardiac or respiratory arrest, or impending arrest',
      'Acute severe deterioration (airway compromise, severe bleeding)',
    ],
    recommendedAction: 'Immediate phone call / pager to Klinimate Intensivist and activate resuscitation pathway',
  } as AlertRule,

  noEscalationRequired: {
    id: 'no-escalation',
    description: 'No escalation required; continue local ward management',
    criteria: [
      'Vitals within configured normal thresholds',
      'Patient alert, pain and symptoms controlled',
    ],
    recommendedAction: 'Document findings and continue routine monitoring',
  } as AlertRule,
}

export default ALERTS
