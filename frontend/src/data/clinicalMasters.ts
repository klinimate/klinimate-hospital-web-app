export interface MedicationMasterItem {
  id: string
  name: string
  strengths: string[]
  routes: string[]
}

export interface InvestigationMasterItem {
  id: string
  name: string
}

export const MEDICATION_MASTER: MedicationMasterItem[] = [
  { id: 'med-aspirin', name: 'Aspirin', strengths: ['75 mg', '150 mg'], routes: ['Oral'] },
  { id: 'med-metoprolol', name: 'Metoprolol', strengths: ['25 mg', '50 mg'], routes: ['Oral'] },
  { id: 'med-atorvastatin', name: 'Atorvastatin', strengths: ['10 mg', '20 mg', '40 mg'], routes: ['Oral'] },
  { id: 'med-furosemide', name: 'Furosemide', strengths: ['20 mg', '40 mg'], routes: ['Oral', 'IV'] },
  { id: 'med-paracetamol', name: 'Paracetamol', strengths: ['500 mg', '650 mg'], routes: ['Oral', 'IV'] },
  { id: 'med-enoxaparin', name: 'Enoxaparin', strengths: ['40 mg'], routes: ['Subcutaneous'] },
  { id: 'med-pantoprazole', name: 'Pantoprazole', strengths: ['40 mg'], routes: ['Oral', 'IV'] },
  { id: 'med-ceftriaxone', name: 'Ceftriaxone', strengths: ['1 g', '2 g'], routes: ['IV'] },
  { id: 'med-insulin', name: 'Insulin', strengths: ['Regular', 'Actrapid', 'Mixtard'], routes: ['Subcutaneous', 'IV'] },
  { id: 'med-salbutamol', name: 'Salbutamol', strengths: ['2.5 mg'], routes: ['Nebulized', 'Inhaled'] },
]

export const INVESTIGATION_MASTER: InvestigationMasterItem[] = [
  { id: 'inv-cbc', name: 'CBC' },
  { id: 'inv-lft', name: 'LFT' },
  { id: 'inv-rft', name: 'RFT' },
  { id: 'inv-crp', name: 'CRP' },
  { id: 'inv-procalcitonin', name: 'Procalcitonin' },
  { id: 'inv-abg', name: 'ABG' },
  { id: 'inv-cxr', name: 'Chest X-ray' },
  { id: 'inv-ct-chest', name: 'CT Chest' },
  { id: 'inv-ecg', name: 'ECG' },
  { id: 'inv-troponin', name: 'Troponin' },
  { id: 'inv-blood-culture', name: 'Blood Culture' },
  { id: 'inv-urine-culture', name: 'Urine Culture' },
  { id: 'inv-hba1c', name: 'HbA1c' },
  { id: 'inv-ddimer', name: 'D-Dimer' },
  { id: 'inv-echo', name: '2D Echo' },
  { id: 'inv-usg-abdomen', name: 'USG Abdomen' },
]
