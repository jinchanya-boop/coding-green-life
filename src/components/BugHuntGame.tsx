import { useEffect, useRef, useState } from 'react'

const BUG_EMOJIS = ['🪲', '🐛', '👾', '🕷️']
const PROTECTED_EMOJI = '🐞'
const HOLE_COUNT = 6
const ROUND_SECONDS = 8

interface HoleTarget {
  id: number
  protected: boolean
  emoji: string
}

interface Pop {
  id: number
  text: string
  color: string
  holeIndex: number
}

const SQUISH_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><text x='0' y='44' font-size='48'>🔨</text></svg>`
)}") 8 44, pointer`

export function BugHuntGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [holes, setHoles] = useState<(HoleTarget | null)[]>(Array(HOLE_COUNT).fill(null))
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [pops, setPops] = useState<Pop[]>([])
  const scoreRef = useRef(0)
  const idRef = useRef(0)
  const endedRef = useRef(false)
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const scheduleSpawn = () => {
      spawnTimerRef.current = setTimeout(() => {
        if (endedRef.current) return
        setHoles((prev) => {
          const emptyIndices = prev.map((h, i) => (h === null ? i : -1)).filter((i) => i >= 0)
          if (emptyIndices.length === 0) return prev
          const idx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
          const isProtected = Math.random() < 0.2
          const emoji = isProtected ? PROTECTED_EMOJI : BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)]
          const id = idRef.current++
          const next = [...prev]
          next[idx] = { id, protected: isProtected, emoji }

          const clearTimer = setTimeout(() => {
            setHoles((cur) => {
              if (cur[idx]?.id !== id) return cur
              const c = [...cur]
              c[idx] = null
              return c
            })
            clearTimersRef.current.delete(id)
          }, 950 + Math.random() * 300)
          clearTimersRef.current.set(id, clearTimer)
          return next
        })
        scheduleSpawn()
      }, 480 + Math.random() * 420)
    }
    scheduleSpawn()

    const countdown = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdown)
          endedRef.current = true
          if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current)
          clearTimersRef.current.forEach((tm) => clearTimeout(tm))
          setTimeout(() => onComplete(scoreRef.current), 400)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => {
      clearInterval(countdown)
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current)
      clearTimersRef.current.forEach((tm) => clearTimeout(tm))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tap = (index: number) => {
    const target = holes[index]
    if (!target || endedRef.current) return
    setHoles((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
    const gain = target.protected ? -5 : 10
    scoreRef.current = Math.max(0, scoreRef.current + gain)
    setScore(scoreRef.current)
    const popId = idRef.current++
    setPops((p) => [
      ...p,
      {
        id: popId,
        text: target.protected ? '-5 อย่าตี!' : '+10',
        color: target.protected ? 'var(--color-coral)' : 'var(--color-mint)',
        holeIndex: index,
      },
    ])
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== popId)), 650)
  }

  return (
    <div className="space-y-4" style={{ cursor: SQUISH_CURSOR }}>
      <div className="text-center">
        <p className="font-display text-lg font-semibold">🔍 วอร์มร่างกาย: ล่าบั๊กตัวจริง!</p>
        <p className="text-xs text-[var(--color-ink-dim)] mt-1">
          แตะบั๊กกวนใจให้ไว — แต่อย่าแตะเต่าทอง 🐞 นะ มันช่วยกำจัดแมลงศัตรูพืชในสวน ไม่ใช่ตัวร้าย!
        </p>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: 'var(--color-gold)' }}>คะแนน {score}</span>
        <span className="text-[var(--color-ink-dim)]">เหลือเวลา {timeLeft}s</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 linear"
          style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%`, background: 'var(--color-coral)' }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {holes.map((target, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className="relative aspect-square rounded-xl flex items-center justify-center text-5xl overflow-hidden"
            style={{ background: 'var(--color-surface-2)', border: '2px solid var(--color-surface-3)', cursor: SQUISH_CURSOR }}
          >
            {target?.emoji}
            {pops
              .filter((p) => p.holeIndex === i)
              .map((p) => (
                <span
                  key={p.id}
                  className="absolute font-display font-bold text-sm"
                  style={{ color: p.color, animation: 'bug-float-up 0.65s ease-out forwards' }}
                >
                  {p.text}
                </span>
              ))}
          </button>
        ))}
      </div>
      <style>{`
        @keyframes bug-float-up { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-32px); opacity: 0; } }
      `}</style>
    </div>
  )
}
