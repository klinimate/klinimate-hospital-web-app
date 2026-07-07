import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { BottomNav } from '@/components/layout/BottomNav'

const sidebarItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'home' },
  { to: '/cases', label: 'Patients', icon: 'patients' },
  { to: '/notifications', label: 'Consultations', icon: 'consult' },
  { to: '/profile', label: 'ICU Monitor', icon: 'icu' },
  { to: '/dashboard', label: 'AI Assistant', icon: 'ai' },
  { to: '/dashboard', label: 'Reports', icon: 'reports' },
  { to: '/profile', label: 'Settings', icon: 'settings' },
] as const

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh bg-[linear-gradient(135deg,#f7fdf9_0%,#f8fafc_60%,#effdf4_100%)]">
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col lg:flex-row">
        <aside className="hidden w-72 flex-col border-r border-emerald-100 bg-white/80 px-5 py-6 backdrop-blur lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-semibold text-white shadow-sm">
              K
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Klinimate</p>
              <p className="text-sm text-slate-500">Command Centre</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2" aria-label="Sidebar navigation">
            {sidebarItems.map(({ to, label, icon }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-sm">
                      {renderSidebarIcon(icon, isActive)}
                    </span>
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">
              ICU status stable
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              12 critical cases monitored in real time.
            </p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-emerald-100 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  City General Hospital
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Clinical Command Centre
                </h2>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-700 shadow-sm"
                  aria-label="Notifications"
                >
                  🔔
                </button>
                <div className="hidden items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 sm:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                    DS
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Dr. Sharma
                    </p>
                    <p className="text-xs text-slate-500">Lead Physician</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 pb-24 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  )
}

function renderSidebarIcon(icon: string, active: boolean) {
  const colorClass = active ? 'text-emerald-700' : 'text-slate-500'

  switch (icon) {
    case 'patients':
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${colorClass}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19a3 3 0 0 0-6 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        </svg>
      )
    case 'consult':
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${colorClass}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 12h5m-5 5h8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
        </svg>
      )
    case 'icu':
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${colorClass}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M7 8V4m10 4V4M7 16h10M7 20h10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 12h10" />
        </svg>
      )
    case 'ai':
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${colorClass}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m9-6 2-2m-2 2-2-2m2 10 2 2m-2-2-2 2" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
    case 'reports':
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${colorClass}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l4 4v14H7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
        </svg>
      )
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${colorClass}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a2 2 0 0 0-1.9 1.3L9.7 7.2a7.8 7.8 0 0 0-2.7 1.6l-3.5-.7a2 2 0 0 0-2.2 2.7l2 3.5a7.8 7.8 0 0 0 0 3.2l-2 3.5a2 2 0 0 0 2.2 2.7l3.5-.7a7.8 7.8 0 0 0 2.7 1.6l.4 2.9A2 2 0 0 0 12 21a2 2 0 0 0 1.9-1.3l.4-2.9a7.8 7.8 0 0 0 2.7-1.6l3.5.7a2 2 0 0 0 2.2-2.7l-2-3.5a7.8 7.8 0 0 0 0-3.2l2-3.5a2 2 0 0 0-2.2-2.7l-3.5.7a7.8 7.8 0 0 0-2.7-1.6l-.4-2.9A2 2 0 0 0 12 3Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'home':
    default:
      return (
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${colorClass}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
        </svg>
      )
  }
}
