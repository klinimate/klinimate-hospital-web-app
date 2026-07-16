/**
 * Recommended investigations keyed by common clinical presentations.
 * Each entry is intentionally simple and declarative to allow the
 * UI or backend to map investigations to order-sets.
 */

export const INVESTIGATIONS_BY_PRESENTATION: Record<string, string[]> = {
  hypoxemia: ['Pulse oximetry (continuous)', 'Arterial blood gas (ABG)', 'Chest X-ray', 'Consider CT chest if indicated'],
  hypotension: ['Point-of-care ultrasound (if available)', 'ECG', 'Lactate', 'Renal function tests (RFT)', 'Full blood count (FBC)'],
  tachycardia: ['ECG', 'Electrolytes', 'Thyroid function tests if indicated', 'Cardiac enzymes if chest pain present'],
  fever: ['Full blood count', 'Blood cultures', 'Urine culture', 'Chest X-ray if respiratory symptoms'],
  alteredConsciousness: ['Blood glucose', 'CT brain (non-contrast) if focal signs', 'Electrolytes', 'Toxicology screen (if indicated)'],
  respiratory_distress: ['Chest X-ray', 'Arterial blood gas (ABG)', 'High-flow oxygen or early ventilation assessment', 'Consider pulmonary imaging as indicated'],
  suspectedSepsis: ['Blood cultures', 'Lactate', 'FBC', 'Urine microscopy/culture', 'Chest X-ray'],
  oliguria: ['Urine microscopy', 'Renal function tests', 'Fluid balance chart', 'Point-of-care ultrasound if indicated'],
  haemorrhage: ['Full blood count', 'Coagulation profile', 'Crossmatch (if needed)', 'Imaging as indicated'],
}

export default INVESTIGATIONS_BY_PRESENTATION
