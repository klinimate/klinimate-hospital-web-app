import type { ReactNode } from 'react'

export function TriageCard({
  colorClass,
  label,
  level,
  alertMessage,
  children,
}: {
  colorClass: string
  label: string
  level: string
  alertMessage?: string
  children?: ReactNode
}) {
  return (
    <div className={`w-full rounded-2xl p-4 text-sm shadow-md ${colorClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold opacity-90">Klinimate Clinical Triage</p>
          <h2 className="mt-1 text-lg font-bold">{label}</h2>
          <p className="mt-1 text-xs opacity-90">{level}</p>
        </div>
        <div className="flex flex-col items-end">
          {alertMessage ? (
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              {alertMessage}
            </span>
          ) : null}
        </div>
      </div>
      {children ? <div className="mt-3 text-sm">{children}</div> : null}
    </div>
  )
}
