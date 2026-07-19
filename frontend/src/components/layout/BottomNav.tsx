import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/patients', label: 'Patients', icon: PatientsIcon },
  { to: '/patients/new', label: 'Register', icon: PlusIcon },
  { to: '/klinimate', label: 'Klinimate', icon: KlinimateIcon },
  { to: '/organization', label: 'Organization', icon: OrganizationIcon },
] as const

export function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 backdrop-blur-sm"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-2xl items-stretch justify-around px-2 py-2">
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

function PlusIcon({ active }: { active: boolean }) {
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
        d="M12 5v14M5 12h14"
      />
    </svg>
  )
}

function KlinimateIcon({ active }: { active: boolean }) {
  return (
    <img
      src="/klinimate-icon.png"
      alt=""
      aria-hidden="true"
      className={[
        'h-6 w-6 object-contain',
        active ? 'opacity-100' : 'opacity-90',
      ].join(' ')}
      draggable={false}
    />
  )
}

function OrganizationIcon({ active }: { active: boolean }) {
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
        d="M4.5 19.5h15M7.5 19.5V7.5h9V19.5M10 7.5V4.5h4v3"
      />
    </svg>
  )
}
