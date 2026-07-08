import type { TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function TextArea({
  label,
  id,
  className = '',
  rows = 4,
  ...props
}: TextAreaProps) {
  const textAreaId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={textAreaId} className="text-sm font-medium text-text">
        {label}
      </label>
      <textarea
        id={textAreaId}
        rows={rows}
        className={[
          'min-h-24 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text',
          'placeholder:text-text-muted',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    </div>
  )
}
