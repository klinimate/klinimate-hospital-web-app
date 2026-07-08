import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export function NewPatientPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    id: 'PT-NEW',
    name: '',
    age: '',
    gender: 'Female',
    department: 'General Medicine',
    room: '',
    chiefComplaint: '',
    bloodGroup: 'O+',
    phone: '',
  })

  function handleChange(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(`/patients/${form.id}/admission`)
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <header>
          <h1 className="text-xl font-semibold text-text">New Patient Registration</h1>
          <p className="mt-1 text-sm text-text-muted">
            Capture intake details and begin admission workflow
          </p>
        </header>

        <Card>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Age"
                type="number"
                value={form.age}
                onChange={(event) => handleChange('age', event.target.value)}
                required
              />
              <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                Gender
                <select
                  value={form.gender}
                  onChange={(event) => handleChange('gender', event.target.value)}
                  className="min-h-12 rounded-xl border border-border bg-white px-4 text-base text-text"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                Department
                <select
                  value={form.department}
                  onChange={(event) => handleChange('department', event.target.value)}
                  className="min-h-12 rounded-xl border border-border bg-white px-4 text-base text-text"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Obstetrics">Obstetrics</option>
                </select>
              </label>
              <Input
                label="Room"
                value={form.room}
                onChange={(event) => handleChange('room', event.target.value)}
                placeholder="Ward B-12"
              />
            </div>
            <Input
              label="Chief complaint"
              value={form.chiefComplaint}
              onChange={(event) => handleChange('chiefComplaint', event.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                Blood group
                <select
                  value={form.bloodGroup}
                  onChange={(event) => handleChange('bloodGroup', event.target.value)}
                  className="min-h-12 rounded-xl border border-border bg-white px-4 text-base text-text"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                </select>
              </label>
              <Input
                label="Phone"
                value={form.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <Button type="submit" size="lg" fullWidth>
              Start Admission
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
