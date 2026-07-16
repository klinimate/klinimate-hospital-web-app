import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const dashboardSections = [
  { title: 'My Active Cases', count: 3, description: 'Cases in progress' },
  {
    title: 'Awaiting Klinimate Support',
    count: 1,
    description: 'Pending Klinimate response',
  },
  { title: 'Advice Received', count: 2, description: 'Ready for your review' },
  { title: 'Completed Cases', count: 12, description: 'Closed this month' },
] as const

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
      <div className="flex flex-col gap-4">
        {/* Compact doctor card — primary header for authenticated pages */}
        <header className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src="/klinimate-icon.png"
              alt="Klinimate avatar"
              width={48}
              height={48}
              className="object-contain"
            />
            <div>
              <p className="text-sm font-medium text-text">Dr. Ananya Sharma</p>
              <p className="text-xs text-text-muted">City General Hospital</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden />
                <span>Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Action buttons directly below the doctor card */}
        <div className="grid grid-cols-3 gap-3">
          <Link to="/patients/new" className="block">
            <Button size="lg" fullWidth>
              + New Patient
            </Button>
          </Link>
          <Link to="/patients" className="block">
            <Button size="lg" fullWidth variant="secondary">
              View Patients
            </Button>
          </Link>
          <Button size="lg" fullWidth variant="ghost">
            Alerts
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                Overview
              </h2>
              <div className="flex flex-col gap-3">
                {dashboardSections.map((section) => (
                  <Card key={section.title}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-text">{section.title}</p>
                        <p className="mt-0.5 text-sm text-text-muted">
                          {section.description}
                        </p>
                      </div>
                      <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-primary-50 px-3 text-sm font-semibold text-primary-700">
                        {section.count}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-3">
            <Card>
              <p className="text-sm font-semibold text-text">Recent Patients</p>
              <p className="mt-2 text-sm text-text-muted">No recent activity</p>
            </Card>
            <Card>
              <p className="text-sm font-semibold text-text">AI Alerts</p>
              <p className="mt-2 text-sm text-text-muted">No critical alerts</p>
            </Card>
          </aside>
        </div>
      </div>
    </AppLayout>
  )
}
