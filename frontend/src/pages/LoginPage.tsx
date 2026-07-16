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
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center justify-center gap-[36px]">
        <header className="flex w-full flex-col items-center justify-center text-center">
          <img
            src="/klinimate-icon.png"
            alt="Klinimate"
            width={100}
            height={100}
          />
          <h1 className="mt-[16px] text-[45px] font-extrabold uppercase tracking-[0.09em] text-[#0B1F4D]">
            KLINIMATE
          </h1>
          <p className="mt-[18px] max-w-full text-[30px] font-semibold leading-tight text-[#111827]">
            AI-Powered Clinical Intelligence
          </p>
          <p className="mt-[8px] text-[18px] font-medium leading-7 text-[#6B7280]">
            for Hospitals & Health Systems
          </p>
        </header>

        <div className="w-full rounded-[20px] border border-[#E5E7EB] bg-white p-[40px] shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="doctor@hospital.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-[56px] rounded-[14px] px-5"
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-[56px] rounded-[14px] px-5"
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              className="h-[60px] rounded-[14px] bg-primary-600 text-[18px] font-bold shadow-sm hover:bg-primary-700"
            >
              Log In
            </Button>
          </form>

          <div className="mt-[18px] text-center">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#0F766E] hover:text-[#0C5A56]"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="mt-[24px] text-center text-[12px] text-[#6B7280]">
            <div>© 2026 KLINIMATE PRIVATE LIMITED</div>
            <div>All Rights Reserved</div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
