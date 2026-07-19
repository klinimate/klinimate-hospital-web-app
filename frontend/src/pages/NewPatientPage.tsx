import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import { patients, type Patient } from '@/data/patients'
import {
  addTimelineEvent,
  createId,
  createWorkspaceFromPatient,
  writeWorkspace,
} from '@/lib/patientWorkspace'

const newPatientSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  age: z.number().int().min(0, 'Age must be valid').max(130, 'Age must be valid'),
  gender: z.enum(['Male', 'Female', 'Other']),
  mobileNumber: z.string().optional(),
  chiefComplaint: z.string().min(2, 'Chief complaint is required'),
  hospitalPatientId: z.string().min(1, 'Hospital patient ID is required'),
  careSetting: z.enum(['OPD', 'IPD', 'Ward', 'ICU', 'Emergency']),
  pulse: z.string().trim().min(1, 'Pulse is required'),
  bpSystolic: z.string().trim().min(1, 'BP systolic is required'),
  bpDiastolic: z.string().trim().min(1, 'BP diastolic is required'),
  spo2: z.string().trim().min(1, 'SpO2 is required'),
  respiratoryRate: z.string().trim().min(1, 'Respiratory rate is required'),
  temperature: z.string().trim().min(1, 'Temperature is required'),
  urineOutput: z.string().optional(),
  bloodSugar: z.string().optional(),
})

type NewPatientFormValues = z.infer<typeof newPatientSchema>

export function NewPatientPage() {
  const navigate = useNavigate()
  const [successToast, setSuccessToast] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPatientFormValues>({
    resolver: zodResolver(newPatientSchema),
    defaultValues: {
      fullName: '',
      age: 0,
      gender: 'Female',
      mobileNumber: '',
      chiefComplaint: '',
      hospitalPatientId: '',
      careSetting: 'IPD',
      pulse: '',
      bpSystolic: '',
      bpDiastolic: '',
      spo2: '',
      respiratoryRate: '',
      temperature: '',
      urineOutput: '',
      bloodSugar: '',
    },
  })

  function showSuccessToast(message: string) {
    setSuccessToast(message)
    window.setTimeout(() => {
      setSuccessToast('')
    }, 2200)
  }

  function registerPatient(values: NewPatientFormValues) {
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    const patientId = values.hospitalPatientId.trim() || createId('PT')
    const hasInitialVitals =
      !!values.bpSystolic?.trim() ||
      !!values.bpDiastolic?.trim() ||
      !!values.pulse?.trim() ||
      !!values.spo2?.trim() ||
      !!values.respiratoryRate?.trim() ||
      !!values.temperature?.trim() ||
      !!values.urineOutput?.trim() ||
      !!values.bloodSugar?.trim()

    const room =
      values.careSetting === 'Ward'
        ? 'Ward - New Admission'
        : values.careSetting === 'ICU'
          ? 'ICU - New Admission'
          : values.careSetting === 'Emergency'
            ? 'Emergency Bay'
            : values.careSetting === 'OPD'
              ? 'OPD Desk'
              : 'IPD Bed'

    const createdPatient: Patient = {
      id: patientId,
      name: values.fullName,
      age: values.age,
      gender: values.gender,
      careSetting: values.careSetting,
      hospitalDay: 'Day 1',
      room,
      department: 'General Medicine',
      chiefComplaint: values.chiefComplaint,
      presentingComplaint: values.chiefComplaint,
      history: 'Initial assessment pending.',
      allergies: [],
      diagnosis: 'Initial clinical evaluation pending',
      status: 'Admitted',
      priority: 'Medium',
      bloodGroup: 'Unknown',
      phone: values.mobileNumber || 'Not provided',
      emergencyContact: 'Not provided',
      lastUpdated: timestamp,
      vitals: {
        bp: `${values.bpSystolic || '--'}/${values.bpDiastolic || '--'}`,
        pulse: values.pulse || '--',
        temperature: values.temperature || '--',
        respiratoryRate: values.respiratoryRate || '--',
        spo2: values.spo2 || '--',
        bloodSugar: values.bloodSugar || '--',
      },
      vitalsTimeline: hasInitialVitals
        ? [
            {
              time: timestamp,
              bp: `${values.bpSystolic || '--'}/${values.bpDiastolic || '--'}`,
              pulse: values.pulse || '--',
              temperature: values.temperature || '--',
              respiratoryRate: values.respiratoryRate || '--',
              spo2: values.spo2 || '--',
              bloodSugar: values.bloodSugar || '--',
            },
          ]
        : [],
      medications: [],
      urineOutput: values.urineOutput || '--',
      investigations: [],
      aiSummary: hasInitialVitals
        ? 'Initial vitals captured at registration. Continue focused clinical assessment and update timeline events.'
        : 'Patient registered. Capture first vitals and clinical assessment to initialize intelligence summary.',
      recommendations: ['Complete initial clinical assessment', 'Review first set of investigations'],
      notes: [],
    }

    const existingIndex = patients.findIndex((item) => item.id === createdPatient.id)
    if (existingIndex >= 0) {
      patients[existingIndex] = createdPatient
    } else {
      patients.unshift(createdPatient)
    }

    let workspace = createWorkspaceFromPatient(createdPatient)
    workspace = addTimelineEvent(workspace, {
      title: 'Patient Registered',
      module: 'Consultation',
      details: hasInitialVitals
        ? 'Registration completed with initial vitals captured.'
        : 'Registration completed. Initial clinical data captured.',
      major: true,
    })

    writeWorkspace(createdPatient.id, workspace)
    window.localStorage.setItem('klinimate-new-patient-latest', JSON.stringify(values))

    return createdPatient
  }

  async function handleSave(values: NewPatientFormValues) {
    registerPatient(values)
    showSuccessToast('Patient registered successfully.')
  }

  async function handleContinueToPatientIntelligence(values: NewPatientFormValues) {
    const createdPatient = registerPatient(values)
    navigate(`/patients/${createdPatient.id}/dashboard`)
  }

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <header>
          <Button
            type="button"
            variant="ghost"
            size="md"
            className="mb-2"
            onClick={() => navigate('/patients')}
          >
            Back
          </Button>
          <h1 className="text-xl font-semibold text-text">New Patient</h1>
        </header>

        <Card>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleContinueToPatientIntelligence)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
              <Input
                label="Age"
                type="number"
                error={errors.age?.message}
                {...register('age', { valueAsNumber: true })}
              />
              <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                Gender
                <select
                  className="min-h-12 rounded-xl border border-border bg-white px-4 text-base text-text"
                  {...register('gender')}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <Input
                label="Mobile Number"
                placeholder="Optional"
                error={errors.mobileNumber?.message}
                {...register('mobileNumber')}
              />
              <Input
                label="Hospital ID"
                error={errors.hospitalPatientId?.message}
                {...register('hospitalPatientId')}
              />
              <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                Care Setting
                <select
                  className="min-h-12 rounded-xl border border-border bg-white px-4 text-base text-text"
                  {...register('careSetting')}
                >
                  <option value="OPD">OPD</option>
                  <option value="IPD">IPD</option>
                  <option value="Ward">Ward</option>
                  <option value="ICU">ICU</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </label>
            </div>

            <div>
              <TextArea
                label="Chief Complaint"
                rows={3}
                placeholder="Describe presenting symptoms"
                {...register('chiefComplaint')}
              />
              {errors.chiefComplaint?.message ? (
                <p className="mt-2 text-sm text-red-600">{errors.chiefComplaint.message}</p>
              ) : null}
            </div>

            <Card>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-base font-semibold text-text">Current Vitals</h2>
                  <p className="text-xs text-text-muted">Recommended to initialize patient intelligence and timeline.</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Input label="Pulse" placeholder="e.g. 92" error={errors.pulse?.message} {...register('pulse')} />
                  <Input
                    label="BP Systolic"
                    placeholder="e.g. 120"
                    error={errors.bpSystolic?.message}
                    {...register('bpSystolic')}
                  />
                  <Input
                    label="BP Diastolic"
                    placeholder="e.g. 80"
                    error={errors.bpDiastolic?.message}
                    {...register('bpDiastolic')}
                  />
                  <Input label="SpO2" placeholder="e.g. 98%" error={errors.spo2?.message} {...register('spo2')} />
                  <Input
                    label="Respiratory Rate"
                    placeholder="e.g. 18/min"
                    error={errors.respiratoryRate?.message}
                    {...register('respiratoryRate')}
                  />
                  <Input
                    label="Temperature"
                    placeholder="e.g. 37.1C"
                    error={errors.temperature?.message}
                    {...register('temperature')}
                  />
                  <Input label="Urine Output (ml/hr)" placeholder="e.g. 60" {...register('urineOutput')} />
                  <Input label="Blood Sugar" placeholder="e.g. 110 mg/dL" {...register('bloodSugar')} />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                fullWidth
                onClick={handleSubmit(handleSave)}
                disabled={isSubmitting}
              >
                Save
              </Button>
              <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
                Continue to Patient Intelligence
              </Button>
            </div>
          </form>
        </Card>

        {successToast ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 mx-auto w-[calc(100%-2rem)] max-w-sm rounded-xl bg-emerald-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-lg">
            {successToast}
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}
