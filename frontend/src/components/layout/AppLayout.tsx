import type { ReactNode } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-surface-muted">
      <main
        className="flex-1 px-4 pt-4"
        style={{
          paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
