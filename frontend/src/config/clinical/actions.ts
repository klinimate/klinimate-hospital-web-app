/**
 * Bedside action checklists mapped by triage category. Keep items short
 * so UI can render checklist labels cleanly.
 */

export const ACTION_CHECKLISTS: Record<'GREEN' | 'YELLOW' | 'RED' | 'BLACK', string[]> = {
  GREEN: [
    'Continue routine observations',
    'Review medications and continue current treatment',
    'Plan next ward round',
    'Document care and family communication',
  ],

  YELLOW: [
    'Repeat vitals in 15–30 minutes',
    'Apply oxygen support as indicated',
    'Order relevant investigations',
    'Inform senior ward clinician',
    'Document escalation trigger and plan',
  ],

  RED: [
    'Call for immediate senior assistance',
    'Start resuscitation / stabilization per local protocol',
    'Secure airway and support oxygenation',
    'Prepare transfer to higher care or ICU',
    'Notify Klinimate Intensivist',
  ],

  BLACK: [
    'Activate code / resuscitation team',
    'Follow end-of-life or palliative pathway if applicable',
    'Notify treating consultant and Klinimate Admin',
    'Document time of event and actions taken',
  ],
}

export default ACTION_CHECKLISTS
