import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={[
        'w-full rounded-2xl border border-border bg-white p-4 text-left shadow-sm',
        onClick
          ? 'cursor-pointer transition-colors hover:border-primary-200 hover:bg-primary-50/40 active:bg-primary-50'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Component>
  )
}
