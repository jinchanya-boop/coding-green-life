import { useMemo, useRef, useState } from 'react'
import { Mascot } from './Mascot'

interface OrderableStep {
  id: string
  text: string
  correctOrder: number
}

const CHIP_COLORS = ['#5EEAD4', '#F4B942', '#8FD694', '#F2765C', '#38BDF8', '#C4B5FD', '#FDBA74']
const STEP_ICONS = ['🎯', '🔍', '🧭', '🛠️', '📊', '🌟', '🚀', '✅']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function OrderingActivity({
  goal,
  steps,
  onChecked,
}: {
  goal: string
  steps: OrderableStep[]
  onChecked: (correctFraction: number) => void
}) {
  const [order, setOrder] = useState<OrderableStep[]>(() => shuffle(steps))
  const [checked, setChecked] = useState(false)
  const dragIndexRef = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const correctCount = useMemo(() => {
    if (!checked) return 0
    return order.filter((s, i) => s.correctOrder === i + 1).length
  }, [checked, order])

  const move = (index: number, dir: -1 | 1) => {
    if (checked) return
    const target = index + dir
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[index], next[target]] = [next[target], next[index]]
    setOrder(next)
  }

  const reorder = (from: number, to: number) => {
    if (checked || from === to) return
    const next = [...order]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setOrder(next)
  }

  const handleCheck = () => {
    setChecked(true)
    const fraction = order.filter((s, i) => s.correctOrder === i + 1).length / order.length
    onChecked(fraction)
  }

  const mood: 'idle' | 'great' | 'okay' = !checked ? 'idle' : correctCount === order.length ? 'great' : 'okay'
  const mascotMessage = !checked
    ? 'ลองจัดลำดับดูนะ ลากการ์ดสลับที่กัน หรือกดปุ่มขึ้น-ลงก็ได้!'
    : correctCount === order.length
      ? 'เก่งมากกก! จัดลำดับได้ถูกต้องครบทุกขั้นตอนเลย 🎉'
      : `ใกล้แล้วนะ! ถูก ${correctCount} จาก ${order.length} ขั้นตอน ลองสังเกตดูอีกครั้ง`

  return (
    <div className="space-y-4">
      <Mascot mood={mood} message={mascotMessage} />

      <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
        <p className="text-xs text-[var(--color-mint)] mb-1">เป้าหมาย</p>
        <p className="text-sm font-medium">{goal}</p>
      </div>

      <div className="space-y-2">
        {order.map((s, i) => {
          const isCorrectPos = checked && s.correctOrder === i + 1
          const color = CHIP_COLORS[i % CHIP_COLORS.length]
          const isDragOver = dragOverIndex === i
          return (
            <div
              key={s.id}
              draggable={!checked}
              onDragStart={() => (dragIndexRef.current = i)}
              onDragOver={(e) => {
                e.preventDefault()
                if (!checked) setDragOverIndex(i)
              }}
              onDragLeave={() => setDragOverIndex((cur) => (cur === i ? null : cur))}
              onDrop={(e) => {
                e.preventDefault()
                if (dragIndexRef.current !== null) reorder(dragIndexRef.current, i)
                dragIndexRef.current = null
                setDragOverIndex(null)
              }}
              onDragEnd={() => {
                dragIndexRef.current = null
                setDragOverIndex(null)
              }}
              className="flex items-center gap-3 rounded-xl p-3 border text-sm transition-transform"
              style={{
                borderColor: checked ? (isCorrectPos ? 'var(--color-mint)' : 'var(--color-coral)') : isDragOver ? color : 'var(--color-surface-3)',
                background: 'var(--color-surface-2)',
                transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
                cursor: checked ? 'default' : 'grab',
              }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 font-display font-semibold"
                style={{ background: `${color}2A`, color, border: `1.5px solid ${color}` }}
              >
                {i + 1}
              </span>
              <span className="text-lg shrink-0" aria-hidden>
                {STEP_ICONS[i % STEP_ICONS.length]}
              </span>
              <span className="flex-1">{s.text}</span>
              {!checked && (
                <div className="flex flex-col shrink-0 items-center">
                  <span className="text-[var(--color-ink-faint)] text-xs mb-0.5" aria-hidden>⠿</span>
                  <div className="flex flex-col">
                    <button onClick={() => move(i, -1)} aria-label="เลื่อนขึ้น" className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] leading-none px-1">
                      ▲
                    </button>
                    <button onClick={() => move(i, 1)} aria-label="เลื่อนลง" className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] leading-none px-1">
                      ▼
                    </button>
                  </div>
                </div>
              )}
              {checked && <span className="text-lg shrink-0">{isCorrectPos ? '✅' : '❌'}</span>}
            </div>
          )
        })}
      </div>
      {!checked ? (
        <button
          onClick={handleCheck}
          className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
          style={{ background: 'var(--color-mint)' }}
        >
          ตรวจคำตอบ
        </button>
      ) : (
        <div
          className="rounded-lg p-3.5 text-sm font-medium text-center"
          style={{ background: correctCount === order.length ? 'rgba(244,185,66,0.15)' : 'rgba(94,234,212,0.1)' }}
        >
          {correctCount === order.length ? '🎉 ' : ''}จัดลำดับถูก {correctCount} / {order.length} ขั้นตอน
        </div>
      )}
    </div>
  )
}
