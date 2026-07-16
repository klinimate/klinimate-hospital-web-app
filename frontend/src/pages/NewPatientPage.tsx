import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'

const newPatientSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  age: z.number().int().min(0, 'Age must be valid').max(130, 'Age must be valid'),
  gender: z.enum(['Male', 'Female', 'Other']),
  mobileNumber: z
    .string()
    .min(10, 'Mobile number is required')
    .regex(/^[+\d][\d\s-]{9,15}$/, 'Enter a valid mobile number'),
  chiefComplaint: z.string().min(2, 'Chief complaint is required'),
  duration: z.string().min(1, 'Duration is required'),
  hospitalPatientId: z.string().min(1, 'Hospital patient ID is required'),
  heartRate: z.number().min(0, 'Heart rate is required'),
  bloodPressure: z.string().min(3, 'Blood pressure is required'),
  respiratoryRate: z.number().min(0, 'Respiratory rate is required'),
  spo2: z.number().min(0, 'SpO2 is required').max(100, 'SpO2 must be <= 100'),
  temperature: z.number().min(0, 'Temperature is required'),
  bloodSugar: z.number().min(0, 'Blood sugar is required'),
  gcs: z.number().int().min(3, 'GCS should be 3-15').max(15, 'GCS should be 3-15'),
})

type NewPatientFormValues = z.infer<typeof newPatientSchema>

export function NewPatientPage() {
  const navigate = useNavigate()
  const [statusMessage, setStatusMessage] = useState('')

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
      duration: '',
      hospitalPatientId: '',
      heartRate: 0,
      bloodPressure: '',
      respiratoryRate: 0,
      spo2: 0,
      temperature: 0,
      bloodSugar: 0,
      gcs: 15,
    },
  })

  async function handleSaveDraft(values: NewPatientFormValues) {
    setStatusMessage(`Draft saved for ${values.fullName} (mock).`)
  }

  async function handleSubmitToAI(values: NewPatientFormValues) {
    setStatusMessage(`Submitted to AI for ${values.fullName} (mock).`)
    navigate('/patients/ai-processing', {
      state: {
        patientName: values.fullName,
        patientId: values.hospitalPatientId || 'PT-2048',
      },
    })
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
            onClick={() => navigate('/dashboard')}
          >
            Back
          </Button>
          <h1 className="text-xl font-semibold text-text">New Patient</h1>
          <p className="mt-1 text-sm text-text-muted">
            Capture patient intake and clinical vitals for AI-assisted review
          </p>
        </header>

        <Card>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleSubmitToAI)}>
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                Patient Information
              </h2>
              <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  {errors.gender?.message ? (
                    <span className="text-sm text-red-600">{errors.gender.message}</span>
                  ) : null}
                </label>
              </div>
              <Input
                label="Mobile Number"
                placeholder="+91 98765 43210"
                error={errors.mobileNumber?.message}
                {...register('mobileNumber')}
              />
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                Clinical Information
              </h2>
              <TextArea
                label="Chief Complaint"
                rows={3}
                placeholder="Describe presenting symptoms"
                {...register('chiefComplaint')}
              />
              {errors.chiefComplaint?.message ? (
                <p className="-mt-2 text-sm text-red-600">{errors.chiefComplaint.message}</p>
              ) : null}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Duration" error={errors.duration?.message} {...register('duration')} />
                <Input
                  label="Hospital Patient ID"
                  error={errors.hospitalPatientId?.message}
                  {...register('hospitalPatientId')}
                />
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                Vital Signs
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Heart Rate"
                  type="number"
                  error={errors.heartRate?.message}
                  {...register('heartRate', { valueAsNumber: true })}
                />
                <Input
                  label="Blood Pressure"
                  placeholder="120/80"
                  error={errors.bloodPressure?.message}
                  {...register('bloodPressure')}
                />
                <Input
                  label="Respiratory Rate"
                  type="number"
                  error={errors.respiratoryRate?.message}
                  {...register('respiratoryRate', { valueAsNumber: true })}
                />
                <Input
                  label="SpO2"
                  type="number"
                  error={errors.spo2?.message}
                  {...register('spo2', { valueAsNumber: true })}
                />
                <Input
                  label="Temperature"
                  type="number"
                  step="0.1"
                  error={errors.temperature?.message}
                  {...register('temperature', { valueAsNumber: true })}
                />
                <Input
                  label="Blood Sugar"
                  type="number"
                  error={errors.bloodSugar?.message}
                  {...register('bloodSugar', { valueAsNumber: true })}
                />
                <Input
                  label="GCS"
                  type="number"
                  error={errors.gcs?.message}
                  {...register('gcs', { valueAsNumber: true })}
                />
              </div>
            </section>

            {statusMessage ? (
              <p className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                {statusMessage}
              </p>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                fullWidth
                onClick={handleSubmit(handleSaveDraft)}
                disabled={isSubmitting}
              >
                Save Draft
              </Button>
              <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
                Submit to AI
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
