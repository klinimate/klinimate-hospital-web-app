import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-4">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold text-text">Forgot Password</h1>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Klinimate healthcare organization accounts are shared functional accounts. Ask your hospital administrator or IT team to reset the credential for your organization.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button fullWidth>Contact Organization Admin</Button>
            <Link to="/login" className="block w-full">
              <Button variant="secondary" fullWidth>
                Back to Sign In
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AuthLayout>
  )
}