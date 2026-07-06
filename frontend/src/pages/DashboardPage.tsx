import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const dashboardSections = [
  { title: 'My Active Cases', count: 3, description: 'Cases in progress' },
  {
    title: 'Awaiting Expert Review',
    count: 1,
    description: 'Pending specialist input',
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
      <div className="flex flex-col gap-6">
        <header className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-primary-700">
            City General Hospital
          </p>
          <h1 className="mt-1 text-xl font-semibold text-text">
            Dr. Ananya Sharma
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            {formattedDate} · {formattedTime}
          </p>
        </header>

        <Link to="/cases/new" className="block">
          <Button size="lg" fullWidth>
            + New Clinical Case
          </Button>
        </Link>

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
    </AppLayout>
  )
}
