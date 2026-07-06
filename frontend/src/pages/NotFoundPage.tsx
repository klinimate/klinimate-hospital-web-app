import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-text">Page not found</h1>
        <p className="mt-2 text-sm text-text-muted">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link to="/dashboard">
        <Button size="lg">Back to Dashboard</Button>
      </Link>
    </div>
  )
}
