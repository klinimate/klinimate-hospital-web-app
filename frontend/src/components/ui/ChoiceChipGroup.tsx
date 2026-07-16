import { TextArea } from '@/components/ui/TextArea'

interface ChoiceChipGroupProps {
  label: string
  options: string[]
  selected: string
  onSelect: (value: string) => void
  notes?: string
  onNotesChange?: (value: string) => void
  showNotes?: boolean
  onToggleNotes?: () => void
  noteLabel?: string
}

export function ChoiceChipGroup({
  label,
  options,
  selected,
  onSelect,
  notes = '',
  onNotesChange,
  showNotes = false,
  onToggleNotes,
  noteLabel = 'Manual note',
}: ChoiceChipGroupProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-text">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === selected
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`rounded-full border px-3 py-2 text-sm ${
                isActive
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-border bg-white text-text'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
      {onToggleNotes ? (
        <button type="button" className="text-sm font-medium text-primary-700" onClick={onToggleNotes}>
          {showNotes ? 'Hide manual note' : 'Add manual note'}
        </button>
      ) : null}
      {showNotes && onNotesChange ? <TextArea label={noteLabel} rows={2} value={notes} onChange={(event) => onNotesChange(event.target.value)} /> : null}
    </div>
  )
}
