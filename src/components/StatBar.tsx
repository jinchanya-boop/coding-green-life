export function StatBar({
  label,
  value,
  max,
  color,
  suffix,
}: {
  label: string
  value: number
  max: number
  color: string
  suffix?: string
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1 text-[var(--color-ink-dim)]">
        <span>{label}</span>
        <span>
          {value}
          {suffix ?? ''} / {max}
          {suffix ?? ''}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
