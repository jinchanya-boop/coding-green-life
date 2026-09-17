import { useEffect, useRef, useState } from 'react'
import { CATEGORY_LABEL, WASTE_ITEMS, type WasteCategory, type WasteItem } from '../data/mission1Content'

const LANES: WasteCategory[] = ['organic', 'recycle', 'general', 'hazardous']
const BIN_COLOR: Record<WasteCategory, string> = {
  organic: '#22C55E',
  recycle: '#0EA5E9',
  general: '#94A3B8',
  hazardous: '#EF4444',
}
const BIN_ICON: Record<WasteCategory, string> = {
  organic: '🍃',
  recycle: '♻️',
  general: '🗑️',
  hazardous: '☣️',
}

const ROUND_SECONDS = 40

export interface SorterResult {
  correctCount: number
  wrongCount: number
  errorTypes: string[]
  timeSeconds: number
  bestCombo: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function GreenSorterGame({ onComplete }: { onComplete: (result: SorterResult) => void }) {
  const queueRef = useRef<WasteItem[]>(shuffle(WASTE_ITEMS))
  const queueIdxRef = useRef(0)
  const [currentItem, setCurrentItem] = useState<WasteItem>(queueRef.current[0])
  const [selected, setSelected] = useState(false)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [level, setLevel] = useState(1)
  const [flash, setFlash] = useState<{ text: string; color: string } | null>(null)
  const [dragOverLane, setDragOverLane] = useState<number | null>(null)

  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const bestComboRef = useRef(0)
  const correctRef = useRef(0)
  const wrongRef = useRef(0)
  const errorTypesRef = useRef<string[]>([])
  const startedAtRef = useRef(Date.now())
  const endedRef = useRef(false)

  const nextItem = () => {
    queueIdxRef.current += 1
    if (queueIdxRef.current >= queueRef.current.length) {
      queueRef.current = shuffle(WASTE_ITEMS)
      queueIdxRef.current = 0
    }
    setCurrentItem(queueRef.current[queueIdxRef.current])
    setSelected(false)
  }

  const finish = () => {
    if (endedRef.current) return
    endedRef.current = true
    onComplete({
      correctCount: correctRef.current,
      wrongCount: wrongRef.current,
      errorTypes: errorTypesRef.current,
      timeSeconds: Math.round((Date.now() - startedAtRef.current) / 1000),
      bestCombo: bestComboRef.current,
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          finish()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resolve = (laneIndex: number) => {
    if (endedRef.current) return
    const cat = LANES[laneIndex]
    const isCorrect = cat === currentItem.correct
    if (isCorrect) {
      comboRef.current += 1
      bestComboRef.current = Math.max(bestComboRef.current, comboRef.current)
      const gain = 10 + Math.min(30, comboRef.current * 3)
      scoreRef.current += gain
      correctRef.current += 1
      setScore(scoreRef.current)
      setCombo(comboRef.current)
      setLevel(1 + Math.floor(comboRef.current / 5))
      setFlash({ text: comboRef.current >= 3 ? `🔥 x${comboRef.current} +${gain}` : `+${gain}`, color: BIN_COLOR[cat] })
    } else {
      comboRef.current = 0
      wrongRef.current += 1
      errorTypesRef.current.push(
        `${currentItem.name}: ทิ้งลง "${CATEGORY_LABEL[cat]}" ที่ถูกคือ "${CATEGORY_LABEL[currentItem.correct]}"`
      )
      setCombo(0)
      setFlash({ text: `ผิด! ที่ถูกคือ ${CATEGORY_LABEL[currentItem.correct]}`, color: '#EF4444' })
    }
    setTimeout(() => setFlash(null), 500)
    nextItem()
  }

  const handleDrop = (laneIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverLane(null)
    resolve(laneIndex)
  }

  const handleBinTap = (laneIndex: number) => {
    if (selected) resolve(laneIndex)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-ink-dim)]">เวลา {timeLeft}s · เลเวล {level}</span>
        <span className="flex items-center gap-3">
          {combo > 1 && <span style={{ color: 'var(--color-gold)' }}>🔥 combo {combo}</span>}
          <span style={{ color: 'var(--color-gold)' }}>คะแนน {score}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 linear"
          style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%`, background: 'var(--color-mint)' }}
        />
      </div>

      <div className="relative">
        <div
          draggable
          onDragStart={(e) => e.dataTransfer.setData('text/plain', currentItem.id)}
          onClick={() => setSelected((s) => !s)}
          className="mx-auto rounded-2xl p-6 text-center border-2 select-none"
          style={{
            width: 160,
            background: 'var(--color-surface)',
            borderColor: selected ? 'var(--color-mint)' : 'var(--color-surface-3)',
            cursor: 'grab',
          }}
        >
          <div className="text-5xl mb-2">{currentItem.emoji}</div>
          <p className="text-sm font-medium">{currentItem.name}</p>
          <p className="text-[10px] text-[var(--color-ink-dim)] mt-1">{selected ? 'แตะถังที่ถูกได้เลย' : 'ลากหรือแตะ แล้วแตะถัง'}</p>
        </div>
        {flash && (
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 font-display font-bold text-sm"
            style={{ color: flash.color }}
          >
            {flash.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {LANES.map((cat, i) => (
          <button
            key={cat}
            onClick={() => handleBinTap(i)}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOverLane(i)
            }}
            onDragLeave={() => setDragOverLane((cur) => (cur === i ? null : cur))}
            onDrop={handleDrop(i)}
            className="rounded-xl p-3 text-center border-2 transition-transform"
            style={{
              background: `${BIN_COLOR[cat]}22`,
              borderColor: dragOverLane === i ? BIN_COLOR[cat] : `${BIN_COLOR[cat]}66`,
              transform: dragOverLane === i ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <div className="text-2xl">{BIN_ICON[cat]}</div>
            <p className="text-[11px] font-medium mt-1">{CATEGORY_LABEL[cat]}</p>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-[var(--color-ink-dim)]">
        ลากขยะไปวางบนถัง หรือแตะขยะแล้วแตะถังที่ถูกต้อง — ยิ่งถูกต่อกันยิ่งได้คะแนนคอมโบ!
      </p>
    </div>
  )
}
