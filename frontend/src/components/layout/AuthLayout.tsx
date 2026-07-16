import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-start bg-white px-4 pt-10 pb-12">
      {children}
    </div>
  )
}
