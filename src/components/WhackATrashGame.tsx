import { useEffect, useRef, useState } from 'react'

const GOOD_EMOJIS = ['🍌', '🥤', '🧻', '📦', '🍾', '🍬', '🔋', '📄']
const BAD_EMOJIS = ['🐝', '🦋', '🌼']
const HOLE_COUNT = 6
const ROUND_SECONDS = 10

const HAMMER_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><text x='0' y='34' font-size='36'>🔨</text></svg>`
)}") 6 34, pointer`

interface HoleTarget {
  id: number
  kind: 'good' | 'bad'
  emoji: string
}

interface Pop {
  id: number
  text: string
  color: string
  holeIndex: number
}

export function WhackATrashGame({ onComplete }: { onComplete: (bonusScore: number) => void }) {
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
          const isBad = Math.random() < 0.25
          const emoji = isBad
            ? BAD_EMOJIS[Math.floor(Math.random() * BAD_EMOJIS.length)]
            : GOOD_EMOJIS[Math.floor(Math.random() * GOOD_EMOJIS.length)]
          const id = idRef.current++
          const next = [...prev]
          next[idx] = { id, kind: isBad ? 'bad' : 'good', emoji }

          const clearTimer = setTimeout(() => {
            setHoles((cur) => {
              if (cur[idx]?.id !== id) return cur
              const c = [...cur]
              c[idx] = null
              return c
            })
            clearTimersRef.current.delete(id)
          }, 750 + Math.random() * 250)
          clearTimersRef.current.set(id, clearTimer)

          return next
        })
        scheduleSpawn()
      }, 320 + Math.random() * 380)
    }
    scheduleSpawn()

    const countdown = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdown)
          endedRef.current = true
          if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current)
          clearTimersRef.current.forEach((t2) => clearTimeout(t2))
          setTimeout(() => onComplete(scoreRef.current), 500)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => {
      clearInterval(countdown)
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current)
      clearTimersRef.current.forEach((t) => clearTimeout(t))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const whack = (index: number) => {
    const target = holes[index]
    if (!target || endedRef.current) return
    setHoles((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
    const popId = idRef.current++
    if (target.kind === 'good') {
      scoreRef.current += 10
      setScore(scoreRef.current)
      setPops((p) => [...p, { id: popId, text: '+10', color: 'var(--color-mint)', holeIndex: index }])
    } else {
      scoreRef.current = Math.max(0, scoreRef.current - 5)
      setScore(scoreRef.current)
      setPops((p) => [...p, { id: popId, text: '-5 อย่าตี!', color: 'var(--color-coral)', holeIndex: index }])
    }
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== popId)), 600)
  }

  return (
    <div className="space-y-4" style={{ cursor: HAMMER_CURSOR }}>
      <div className="text-center">
        <p className="font-display text-lg font-semibold">🔨 ตีตุ่มขยะ! รอบโบนัส</p>
        <p className="text-xs text-[var(--color-ink-dim)] mt-1">
          แตะขยะที่โผล่ขึ้นมาให้ไว — แต่อย่าตีผีเสื้อ/ผึ้ง/ดอกไม้ที่โผล่มาปนนะ!
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span style={{ color: 'var(--color-gold)' }}>คะแนนโบนัส {score}</span>
        <span className="text-[var(--color-ink-dim)]">เหลือเวลา {timeLeft}s</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 linear"
          style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%`, background: 'var(--color-gold)' }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {holes.map((target, i) => (
          <button
            key={i}
            onClick={() => whack(i)}
            className="relative aspect-square rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: 'radial-gradient(circle at 50% 40%, #1B3D34, #0D1F1C)', border: '3px solid #234A40', cursor: HAMMER_CURSOR }}
          >
            {target && (
              <span
                className="text-3xl"
                style={{ animation: 'pop-in 0.15s ease-out' }}
              >
                {target.emoji}
              </span>
            )}
            {pops
              .filter((p) => p.holeIndex === i)
              .map((p) => (
                <span
                  key={p.id}
                  className="absolute font-display font-bold text-sm"
                  style={{ color: p.color, animation: 'float-up 0.6s ease-out forwards' }}
                >
                  {p.text}
                </span>
              ))}
          </button>
        ))}
      </div>
      <style>{`
        @keyframes pop-in { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes float-up { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-30px); opacity: 0; } }
      `}</style>
    </div>
  )
}
