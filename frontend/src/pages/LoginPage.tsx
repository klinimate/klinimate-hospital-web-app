import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/dashboard', { replace: true })
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col items-center gap-3 text-center">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-2xl font-bold text-white shadow-md"
          >
            K
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text">Klinimate</h1>
            <p className="mt-1 text-sm text-text-muted">
              Clinical Command Centre for Hospitals
            </p>
          </div>
        </header>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="doctor@hospital.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <Button type="submit" size="lg" fullWidth>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-primary-700 hover:text-primary-800"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
