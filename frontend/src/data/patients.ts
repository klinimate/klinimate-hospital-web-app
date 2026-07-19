export type AdmissionStatus = 'Admitted' | 'Observation' | 'Discharged' | 'Critical'
export type PatientPriority = 'High' | 'Medium' | 'Low'

export interface PatientVitals {
  bp: string
  pulse: string
  temperature: string
  respiratoryRate: string
  spo2: string
  bloodSugar: string
}

export interface VitalSnapshot {
  time: string
  bp: string
  pulse: string
  temperature: string
  respiratoryRate: string
  spo2: string
  bloodSugar: string
}

export interface Medication {
  name: string
  dose: string
  frequency: string
  route: string
}

export interface Investigation {
  title: string
  status: string
  result: string
  updated: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  careSetting: 'OPD' | 'Emergency' | 'IPD' | 'Ward' | 'ICU' | 'Rehabilitation' | 'Home Care' | 'Virtual Consultation'
  hospitalDay: string
  room: string
  department: string
  chiefComplaint: string
  presentingComplaint: string
  history: string
  allergies: string[]
  diagnosis: string
  status: AdmissionStatus
  priority: PatientPriority
  bloodGroup: string
  phone: string
  emergencyContact: string
  lastUpdated: string
  vitals: PatientVitals
  vitalsTimeline: VitalSnapshot[]
  medications: Medication[]
  urineOutput?: string
  investigations: Investigation[]
  aiSummary: string
  recommendations: string[]
  notes: string[]
}

export const patients: Patient[] = [
  {
    id: 'PT-2048',
    name: 'Aarav Mehta',
    age: 41,
    gender: 'Male',
    careSetting: 'IPD',
    hospitalDay: 'Day 2',
    room: 'Ward B-12',
    department: 'General Medicine',
    chiefComplaint: 'Chest discomfort and fatigue',
    presentingComplaint:
      'Gradual onset chest tightness, exertional dyspnea, and intermittent palpitations.',
    history:
      'Patient known hypertensive for 8 years with irregular medication adherence. No prior MI. Recent weight gain and reduced exercise tolerance.',
    allergies: ['Penicillin', 'NSAIDs'],
    diagnosis: 'Acute coronary syndrome with hypertensive emergency',
    status: 'Admitted',
    priority: 'High',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    emergencyContact: 'Nisha Mehta · +91 91234 56789',
    lastUpdated: '8 min ago',
    vitals: {
      bp: '132/86',
      pulse: '94',
      temperature: '37.4°C',
      respiratoryRate: '20/min',
      spo2: '97%',
      bloodSugar: '118 mg/dL',
    },
    vitalsTimeline: [
      {
        time: '08:00',
        bp: '138/90',
        pulse: '98',
        temperature: '37.5°C',
        respiratoryRate: '21/min',
        spo2: '96%',
        bloodSugar: '122 mg/dL',
      },
      {
        time: '12:00',
        bp: '134/88',
        pulse: '96',
        temperature: '37.4°C',
        respiratoryRate: '20/min',
        spo2: '97%',
        bloodSugar: '118 mg/dL',
      },
      {
        time: '16:00',
        bp: '132/86',
        pulse: '94',
        temperature: '37.4°C',
        respiratoryRate: '20/min',
        spo2: '97%',
        bloodSugar: '115 mg/dL',
      },
    ],
    medications: [
      { name: 'Aspirin', dose: '75 mg', frequency: 'Once daily', route: 'Oral' },
      { name: 'Metoprolol', dose: '50 mg', frequency: 'Twice daily', route: 'Oral' },
      { name: 'Atorvastatin', dose: '40 mg', frequency: 'Once nightly', route: 'Oral' },
      { name: 'Furosemide', dose: '20 mg', frequency: 'Once daily', route: 'Oral' },
    ],
    investigations: [
      {
        title: 'ECG',
        status: 'Complete',
        result: 'Sinus tachycardia with ST depression in V4-V6',
        updated: '9 min ago',
      },
      {
        title: 'Troponin I',
        status: 'Pending',
        result: 'Awaiting lab report',
        updated: '4 min ago',
      },
      {
        title: 'Chest X-ray',
        status: 'Complete',
        result: 'Mild pulmonary congestion, no consolidation',
        updated: '15 min ago',
      },
    ],
    aiSummary:
      'Likely evolving NSTEMI in a hypertensive patient with preserved oxygenation. Continued telemetry and early cardiology consultation recommended.',
    recommendations: [
      'Continue dual antiplatelet therapy and adjust beta blocker after cardiology review.',
      'Monitor urine output and electrolytes every 8 hours.',
      'Reassess pain and dyspnea after next BP measurement.',
    ],
    notes: [
      'Patient reports mild shortness of breath during exertion.',
      'ECG reviewed; telemetry monitoring continued.',
      'Fluid intake maintained at 1.2 L in last 12 hours.',
    ],
  },
  {
    id: 'PT-1987',
    name: 'Meera Iyer',
    age: 32,
    gender: 'Female',
    careSetting: 'IPD',
    hospitalDay: 'Day 1',
    room: 'Observation 4',
    department: 'Obstetrics',
    chiefComplaint: 'Post-op monitoring',
    presentingComplaint:
      'Post-cesarean section monitoring with mild incisional discomfort and stable vitals.',
    history:
      'Primigravida at 38 weeks underwent emergency C-section for fetal distress. No chronic illnesses. Normal antenatal course.',
    allergies: ['None'],
    diagnosis: 'Postpartum care after lower segment cesarean section',
    status: 'Observation',
    priority: 'Medium',
    bloodGroup: 'A+',
    phone: '+91 87654 32109',
    emergencyContact: 'Ravi Iyer · +91 99887 66554',
    lastUpdated: '24 min ago',
    vitals: {
      bp: '126/78',
      pulse: '82',
      temperature: '36.9°C',
      respiratoryRate: '18/min',
      spo2: '99%',
      bloodSugar: '105 mg/dL',
    },
    vitalsTimeline: [
      {
        time: '08:00',
        bp: '128/80',
        pulse: '84',
        temperature: '36.9°C',
        respiratoryRate: '18/min',
        spo2: '99%',
        bloodSugar: '108 mg/dL',
      },
      {
        time: '12:00',
        bp: '126/78',
        pulse: '82',
        temperature: '36.9°C',
        respiratoryRate: '18/min',
        spo2: '99%',
        bloodSugar: '104 mg/dL',
      },
      {
        time: '16:00',
        bp: '124/76',
        pulse: '80',
        temperature: '36.8°C',
        respiratoryRate: '18/min',
        spo2: '99%',
        bloodSugar: '100 mg/dL',
      },
    ],
    medications: [
      { name: 'Iron supplement', dose: '60 mg', frequency: 'Once daily', route: 'Oral' },
      { name: 'Paracetamol', dose: '500 mg', frequency: 'As needed', route: 'Oral' },
      { name: 'Enoxaparin', dose: '40 mg', frequency: 'Once daily', route: 'Subcutaneous' },
    ],
    investigations: [
      {
        title: 'CBC + Electrolytes',
        status: 'Complete',
        result: 'Hemoglobin 11.2 g/dL, electrolytes within normal range',
        updated: '30 min ago',
      },
      {
        title: 'Uterine scan',
        status: 'Complete',
        result: 'No collection, uterine involution normal',
        updated: '18 min ago',
      },
    ],
    aiSummary:
      'Stable post-cesarean patient with controlled pain and no signs of infection. Continue postpartum observation and early ambulation.',
    recommendations: [
      'Maintain thromboprophylaxis and pain regimen.',
      'Encourage breastfeeding and support mobilization.',
    ],
    notes: [
      'Patient ambulated with assistance after analgesia.',
      'No fever or uterine tenderness noted.',
    ],
  },
  {
    id: 'PT-1764',
    name: 'Kavya Rao',
    age: 58,
    gender: 'Female',
    careSetting: 'ICU',
    hospitalDay: 'Day 4',
    room: 'ICU-2',
    department: 'Cardiology',
    chiefComplaint: 'Hypertension flare-up',
    presentingComplaint:
      'Severe headache and dizziness with markedly elevated blood pressure.',
    history:
      'Long-standing hypertension with poor control. Past history of TIA 2 years ago. Non-smoker.',
    allergies: ['Sulfa drugs'],
    diagnosis: 'Hypertensive emergency with suspected end-organ stress',
    status: 'Critical',
    priority: 'High',
    bloodGroup: 'B+',
    phone: '+91 76543 21098',
    emergencyContact: 'Suresh Rao · +91 98765 11223',
    lastUpdated: '2 min ago',
    vitals: {
      bp: '168/102',
      pulse: '112',
      temperature: '37.8°C',
      respiratoryRate: '24/min',
      spo2: '94%',
      bloodSugar: '132 mg/dL',
    },
    vitalsTimeline: [
      {
        time: '08:00',
        bp: '176/108',
        pulse: '118',
        temperature: '37.9°C',
        respiratoryRate: '24/min',
        spo2: '94%',
        bloodSugar: '136 mg/dL',
      },
      {
        time: '12:00',
        bp: '172/104',
        pulse: '116',
        temperature: '37.9°C',
        respiratoryRate: '24/min',
        spo2: '94%',
        bloodSugar: '134 mg/dL',
      },
      {
        time: '16:00',
        bp: '168/102',
        pulse: '112',
        temperature: '37.8°C',
        respiratoryRate: '24/min',
        spo2: '94%',
        bloodSugar: '132 mg/dL',
      },
    ],
    medications: [
      { name: 'Amlodipine', dose: '10 mg', frequency: 'Once daily', route: 'Oral' },
      { name: 'Clonidine', dose: '0.1 mg', frequency: 'Twice daily', route: 'Oral' },
      { name: 'Hydralazine', dose: '25 mg', frequency: 'Every 8 hours', route: 'Oral' },
    ],
    investigations: [
      {
        title: 'CT brain',
        status: 'Complete',
        result: 'No acute bleed or infarct.',
        updated: '20 min ago',
      },
      {
        title: 'Renal panel',
        status: 'Complete',
        result: 'Creatinine 1.1 mg/dL, no acute kidney injury.',
        updated: '1 hr ago',
      },
      {
        title: 'Urine protein',
        status: 'Pending',
        result: 'Sample sent to lab',
        updated: '10 min ago',
      },
    ],
    aiSummary:
      'Critical hypertensive patient with high pulse and end-organ monitoring requirements. Suggest continuous BP monitoring and urgent specialist review.',
    recommendations: [
      'Escalate to senior cardiology and evaluate need for ICU-level therapy.',
      'Closely monitor neurological status and renal output.',
    ],
    notes: [
      'IV antihypertensives started after review.',
      'Monitor for dizziness and reduced urine output.',
      'Patient remains alert; no focal neurological signs.',
    ],
  },
]
