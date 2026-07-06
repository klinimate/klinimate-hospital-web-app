import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function ProfilePage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-5">
        <header>
          <h1 className="text-xl font-semibold text-text">Profile</h1>
          <p className="mt-1 text-sm text-text-muted">
            Your account and hospital details
          </p>
        </header>

        <Card>
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700"
            >
              AS
            </div>
            <div>
              <p className="font-medium text-text">Dr. Ananya Sharma</p>
              <p className="text-sm text-text-muted">Internal Medicine</p>
            </div>
          </div>
        </Card>

        <Card>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Hospital</dt>
              <dd className="font-medium text-text">City General Hospital</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Email</dt>
              <dd className="font-medium text-text">ananya@citygeneral.in</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Role</dt>
              <dd className="font-medium text-text">Consultant Physician</dd>
            </div>
          </dl>
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
