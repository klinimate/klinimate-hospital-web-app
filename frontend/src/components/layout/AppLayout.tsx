import type { ReactNode } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-screen-2xl flex-col bg-surface-muted">
      {/* Global branding removed — keep authenticated pages free of marketing */}

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
