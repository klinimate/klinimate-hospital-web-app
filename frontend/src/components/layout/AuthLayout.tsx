import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center bg-surface-muted px-4 py-8">
      {children}
    </div>
  )
}
