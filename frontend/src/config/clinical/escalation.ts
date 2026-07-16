/**
 * Escalation workflow definitions for Klinimate roles. Each role block
 * describes intended responsibilities, contact methods and expected
 * response timeframe. All values are configurable.
 */

export interface EscalationRole {
  role: string
  responsibilities: string[]
  contactMethods: string[]
  expectedResponseMins: number
}

export const ESCALATION_WORKFLOW: Record<'HMO' | 'INTENSIVIST' | 'ADMIN', EscalationRole> = {
  HMO: {
    role: 'Hospital Medical Officer',
    responsibilities: [
      'Initial bedside assessment and stabilization',
      'Implement immediate ward-level actions',
      'Communicate with treating consultant and nursing team',
    ],
    contactMethods: ['In-person', 'Phone', 'Secure messaging'],
    expectedResponseMins: 15,
  },

  INTENSIVIST: {
    role: 'Klinimate Intensivist',
    responsibilities: [
      'Provide urgent critical care guidance',
      'Authorize transfer to ICU when indicated',
      'Advise on advanced resuscitation and organ support',
    ],
    contactMethods: ['Phone (primary)', 'Secure messaging (secondary)', 'Video consult if required'],
    expectedResponseMins: 10,
  },

  ADMIN: {
    role: 'Klinimate Admin',
    responsibilities: [
      'Coordinate system-wide alerts and duty rosters',
      'Escalate notifications to on-call leadership',
      'Log critical incidents and ensure follow-up',
    ],
    contactMethods: ['Phone', 'Email', 'Admin dashboard notification'],
    expectedResponseMins: 30,
  },
}

export default ESCALATION_WORKFLOW
