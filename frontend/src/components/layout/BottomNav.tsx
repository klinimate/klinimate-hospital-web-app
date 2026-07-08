import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Home', icon: HomeIcon },
  { to: '/patients', label: 'Patients', icon: PatientsIcon },
  { to: '/cases', label: 'Cases', icon: CasesIcon },
  { to: '/notifications', label: 'Alerts', icon: BellIcon },
  { to: '/profile', label: 'Profile', icon: UserIcon },
] as const

export function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 backdrop-blur-sm"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex min-h-14 min-w-16 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary-700'
                  : 'text-text-muted hover:text-text',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.75}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10.5 12 3l9 7.5M5.25 9.75V20.25A1.5 1.5 0 0 0 6.75 21.75h10.5a1.5 1.5 0 0 0 1.5-1.5V9.75"
      />
    </svg>
  )
}

function PatientsIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.75}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  )
}

function CasesIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.75}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
      />
    </svg>
  )
}

function BellIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.75}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.031A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.031m-5.714.001a24.255 24.255 0 0 1-.621-.003"
      />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.75}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  )
}
