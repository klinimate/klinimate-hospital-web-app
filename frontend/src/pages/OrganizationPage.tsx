import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function OrganizationPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <header>
          <h1 className="text-xl font-semibold text-text">Organization</h1>
          <p className="mt-1 text-sm text-text-muted">
            Hospital settings, user profile, and workspace access.
          </p>
        </header>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
              AG
            </div>
            <div>
              <p className="font-medium text-text">City General Hospital</p>
              <p className="text-sm text-text-muted">Dr. Ananya Sharma · Consultant Physician</p>
            </div>
          </div>
        </Card>

        <Card>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Workspace</dt>
              <dd className="font-medium text-text">Healthcare Organization</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Active Role</dt>
              <dd className="font-medium text-text">Consultant</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Access</dt>
              <dd className="font-medium text-text">Patients, Register, Klinimate</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-text">Organization Tools</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button variant="secondary" size="lg" fullWidth>
              User Management
            </Button>
            <Button variant="secondary" size="lg" fullWidth>
              Subscription
            </Button>
            <Button variant="secondary" size="lg" fullWidth>
              Reports
            </Button>
            <Button variant="secondary" size="lg" fullWidth>
              Settings
            </Button>
          </div>
        </Card>

        <Link to="/login">
          <Button variant="secondary" size="lg" fullWidth>
            Sign Out
          </Button>
        </Link>
      </div>
    </AppLayout>
  )
}