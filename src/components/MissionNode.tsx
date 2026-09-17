import type { MissionDef, MissionState } from '../types'

const STATUS_STYLE: Record<MissionState['status'], { ring: string; bg: string; label: string }> = {
  locked: { ring: 'var(--color-surface-3)', bg: 'var(--color-surface)', label: 'ยังไม่ปลดล็อก' },
  unlocked: { ring: 'var(--color-mint)', bg: 'var(--color-surface-2)', label: 'พร้อมเล่น' },
  in_progress: { ring: 'var(--color-gold)', bg: 'var(--color-surface-2)', label: 'ทำต่อ' },
  completed: { ring: 'var(--color-gold)', bg: 'var(--color-surface-3)', label: 'สำเร็จแล้ว' },
}

export function MissionNode({
  mission,
  state,
  align,
  onClick,
}: {
  mission: MissionDef
  state: MissionState
  align: 'left' | 'right' | 'center'
  onClick: () => void
}) {
  const style = STATUS_STYLE[state.status]
  const locked = state.status === 'locked'
  const justify = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'

  return (
    <div className={`flex w-full ${justify}`}>
      <button
        onClick={onClick}
        disabled={locked}
        className="group flex items-center gap-3.5 disabled:cursor-not-allowed"
        style={{ maxWidth: 320 }}
      >
        <div
          className={`flex items-center justify-center rounded-full shrink-0 relative ${
            state.status === 'unlocked' ? 'pulse-ring' : ''
          }`}
          style={{
            width: 64,
            height: 64,
            background: style.bg,
            border: `2.5px solid ${style.ring}`,
            opacity: locked ? 0.5 : 1,
          }}
        >
          <span className="font-display font-semibold text-lg" style={{ color: locked ? 'var(--color-ink-faint)' : 'var(--color-ink)' }}>
            {locked ? '🔒' : mission.order}
          </span>
          {state.status === 'completed' && (
            <span className="absolute -top-1.5 -right-1.5 text-base">🏅</span>
          )}
        </div>
        <div className="text-left">
          <p className="font-display font-medium leading-tight" style={{ color: locked ? 'var(--color-ink-faint)' : 'var(--color-ink)' }}>
            {mission.code} · {mission.title}
          </p>
          <p className="text-xs text-[var(--color-ink-dim)] mt-0.5">{style.label}</p>
        </div>
      </button>
    </div>
  )
}
