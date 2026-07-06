import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={inputId}
        className={[
          'min-h-12 w-full rounded-xl border border-border bg-white px-4 text-base text-text',
          'placeholder:text-text-muted',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60',
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
