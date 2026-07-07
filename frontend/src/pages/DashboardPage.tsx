import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const statusCards = [
  { label: 'Active Patients', value: '248', detail: '+12 today', tone: 'emerald' },
  { label: 'Critical Patients', value: '18', detail: '3 escalated', tone: 'rose' },
  { label: 'ICU Beds Occupied', value: '14/20', detail: '70% capacity', tone: 'amber' },
  { label: 'Pending Consultations', value: '23', detail: '5 urgent', tone: 'sky' },
] as const

const recentPatients = [
  { name: 'Aisha Khan', id: 'PT-1042', ward: 'Ward A-12', status: 'Stable' },
  { name: 'Daniel Ortiz', id: 'PT-1049', ward: 'ICU-03', status: 'Critical' },
  { name: 'Mira Patel', id: 'PT-1055', ward: 'Ward C-02', status: 'Monitoring' },
  { name: 'Noah Kim', id: 'PT-1061', ward: 'ER-07', status: 'Needs Review' },
] as const

const alerts = [
  'Rapid oxygen saturation drop detected in ICU-03.',
  'Medication interaction warning for Patient PT-1049.',
  'Lab result backlog exceeds 25 mins for Cardiology.',
] as const

const recommendations = [
  'Prioritize discharge planning for 4 low-risk patients.',
  'Prepare blood bank request for 2 pending transfusion cases.',
  'Schedule follow-up imaging review for post-op ward patients.',
] as const

const quickActions = ['New Admission', 'AI Summary', 'Transfer Request', 'Bed Allocation'] as const

export function DashboardPage() {
  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <section className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-5 text-white shadow-lg sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-50">Good morning</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Dr. Ananya Sharma
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-emerald-50/90 sm:text-base">
                Monitor admissions, urgent alerts and AI-led recommendations from a single clinical view.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-sm font-medium text-emerald-50">Today</p>
              <p className="mt-1 text-sm text-white">{formattedDate}</p>
              <p className="text-sm text-emerald-100">{formattedTime}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statusCards.map((card) => (
            <Card key={card.label} className="border-emerald-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{card.detail}</p>
                </div>
                <div className={`rounded-2xl px-2.5 py-2 text-sm font-semibold ${toneClass(card.tone)}`}>
                  •
                </div>
              </div>
            </Card>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <Card className="border-emerald-100 p-0 overflow-hidden">
            <div className="border-b border-emerald-100 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Recent Patients</h2>
                  <p className="text-sm text-slate-500">Latest updates from inpatient care</p>
                </div>
                <Button variant="ghost" size="md">View All</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-emerald-100 text-left text-sm">
                <thead className="bg-emerald-50/70 text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Patient</th>
                    <th className="px-5 py-3 font-semibold">ID</th>
                    <th className="px-5 py-3 font-semibold">Ward</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 bg-white">
                  {recentPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-emerald-50/40">
                      <td className="px-5 py-3 font-medium text-slate-900">{patient.name}</td>
                      <td className="px-5 py-3 text-slate-600">{patient.id}</td>
                      <td className="px-5 py-3 text-slate-600">{patient.ward}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="border-rose-100 bg-rose-50/60">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Critical Alerts</h2>
                  <p className="text-sm text-slate-500">Immediate attention required</p>
                </div>
                <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">
                  3 New
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {alerts.map((alert) => (
                  <li key={alert} className="rounded-2xl border border-rose-100 bg-white/80 p-3 text-sm text-slate-700">
                    {alert}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                  <p className="text-sm text-slate-500">Common tasks</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button key={action} variant="secondary" size="md">
                    {action}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="border-emerald-100">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">AI Recommendations</h2>
                <p className="text-sm text-slate-500">Suggested next actions for tonight shift</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                Live
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {recommendations.map((item) => (
                <li key={item} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-sm text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-emerald-100 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-900">Shift Snapshot</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                <span>Bed turnaround</span>
                <span className="font-semibold text-emerald-700">12 mins</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                <span>Avg. consult wait</span>
                <span className="font-semibold text-emerald-700">18 mins</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                <span>Discharge readiness</span>
                <span className="font-semibold text-emerald-700">86%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

function toneClass(tone: 'emerald' | 'rose' | 'amber' | 'sky') {
  switch (tone) {
    case 'rose':
      return 'bg-rose-100 text-rose-700'
    case 'amber':
      return 'bg-amber-100 text-amber-700'
    case 'sky':
      return 'bg-sky-100 text-sky-700'
    case 'emerald':
    default:
      return 'bg-emerald-100 text-emerald-700'
  }
}

function statusBadge(status: string) {
  switch (status) {
    case 'Critical':
      return 'bg-rose-100 text-rose-700'
    case 'Needs Review':
      return 'bg-amber-100 text-amber-700'
    case 'Monitoring':
      return 'bg-sky-100 text-sky-700'
    case 'Stable':
    default:
      return 'bg-emerald-100 text-emerald-700'
  }
}
