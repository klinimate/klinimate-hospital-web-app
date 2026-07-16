/**
 * Vital sign thresholds. All values configurable to allow protocol updates
 * without UI changes. Units are noted in comments where helpful.
 */

export interface Range {
  low?: number
  high?: number
}

export interface VitalThresholds {
  normal: Range
  warning?: Range
  critical?: Range
}

export const VITAL_THRESHOLDS: {
  bp: { systolic: VitalThresholds; diastolic: VitalThresholds }
  pulse: VitalThresholds
  respiratoryRate: VitalThresholds
  temperature: VitalThresholds
  spo2: VitalThresholds
} = {
  bp: {
    systolic: { normal: { low: 100, high: 140 }, warning: { low: 90, high: 160 }, critical: { low: 0, high: 180 } },
    diastolic: { normal: { low: 60, high: 90 }, warning: { low: 50, high: 100 }, critical: { low: 0, high: 120 } },
  },

  pulse: { normal: { low: 60, high: 100 }, warning: { low: 50, high: 120 }, critical: { low: 0, high: 140 } },

  respiratoryRate: { normal: { low: 12, high: 20 }, warning: { low: 10, high: 24 }, critical: { low: 0, high: 40 } },

  temperature: { normal: { low: 36.0, high: 37.5 }, warning: { low: 35.0, high: 38.0 }, critical: { low: 30.0, high: 42.0 } },

  spo2: { normal: { low: 94, high: 100 }, warning: { low: 90, high: 93 }, critical: { low: 0, high: 89 } },
}

export default VITAL_THRESHOLDS
