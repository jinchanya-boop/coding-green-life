import { useMemo, useRef, useState } from 'react'
import type { AlgoBlock, AlgorithmScenario, BlockType } from '../data/mission3Content'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const SHAPE_COLOR: Record<BlockType, string> = {
  START: '#22C55E',
  END: '#F4B942',
  INPUT: '#38BDF8',
  OUTPUT: '#A78BFA',
  PROCESS: '#94A3B8',
  IF: '#FB923C',
  ELSE: '#FBBF24',
}

function FlowShape({ block, dimmed }: { block: AlgoBlock; dimmed?: boolean }) {
  const color = SHAPE_COLOR[block.type]
  const baseStyle: React.CSSProperties = {
    background: `${color}26`,
    border: `2px solid ${color}`,
    color: 'var(--color-ink)',
    opacity: dimmed ? 0.55 : 1,
  }

  if (block.type === 'START' || block.type === 'END') {
    return (
      <div className="px-6 py-2.5 rounded-full text-sm font-display font-semibold text-center" style={baseStyle}>
        {block.label}
      </div>
    )
  }
  if (block.type === 'INPUT' || block.type === 'OUTPUT') {
    return (
      <div
        className="py-2.5 text-sm text-center"
        style={{
          ...baseStyle,
          minWidth: 130,
          paddingLeft: 34,
          paddingRight: 34,
          clipPath: 'polygon(18px 0%, 100% 0%, calc(100% - 18px) 100%, 0% 100%)',
        }}
      >
        {block.label}
      </div>
    )
  }
  if (block.type === 'IF') {
    return (
      <div
        className="text-sm text-center font-medium flex items-center justify-center"
        style={{
          ...baseStyle,
          minWidth: 210,
          minHeight: 92,
          paddingLeft: 40,
          paddingRight: 40,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }}
      >
        {block.label}
      </div>
    )
  }
  if (block.type === 'ELSE') {
    return (
      <div className="px-5 py-1.5 rounded-full text-xs font-display font-medium text-center border-dashed" style={baseStyle}>
        {block.label}
      </div>
    )
  }
  // PROCESS
  return (
    <div className="px-6 py-2.5 rounded-md text-sm text-center" style={baseStyle}>
      {block.label}
    </div>
  )
}

function Arrow() {
  return (
    <div className="flex flex-col items-center h-6" aria-hidden>
      <div style={{ width: 2, height: 14, background: 'var(--color-surface-3)' }} />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '7px solid var(--color-surface-3)',
        }}
      />
    </div>
  )
}

interface DragPayload {
  source: 'pool' | 'chain'
  blockId: string
}

export function AlgorithmBuilderActivity({
  scenario,
  onSolved,
}: {
  scenario: AlgorithmScenario
  onSolved: (fraction: number, attempts: number) => void
}) {
  const [pool, setPool] = useState<AlgoBlock[]>(() => shuffle(scenario.pool))
  const [built, setBuilt] = useState<AlgoBlock[]>([])
  const [hints, setHints] = useState<string[] | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [solved, setSolved] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | 'end' | null>(null)
  const dragDataRef = useRef<DragPayload | null>(null)

  const addBlock = (b: AlgoBlock) => {
    if (solved) return
    setHints(null)
    setPool((p) => p.filter((x) => x.id !== b.id))
    setBuilt((seq) => [...seq, b])
  }

  const insertBlockAt = (b: AlgoBlock, index: number) => {
    if (solved) return
    setHints(null)
    setPool((p) => p.filter((x) => x.id !== b.id))
    setBuilt((seq) => {
      const next = [...seq]
      next.splice(index, 0, b)
      return next
    })
  }

  const removeBlock = (b: AlgoBlock) => {
    if (solved) return
    setHints(null)
    setBuilt((seq) => seq.filter((x) => x.id !== b.id))
    setPool((p) => [...p, b])
  }

  const reorderChain = (fromId: string, toIndex: number) => {
    if (solved) return
    setBuilt((seq) => {
      const fromIndex = seq.findIndex((x) => x.id === fromId)
      if (fromIndex === -1) return seq
      const next = [...seq]
      const [moved] = next.splice(fromIndex, 1)
      const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex
      next.splice(adjustedIndex, 0, moved)
      return next
    })
  }

  const move = (index: number, dir: -1 | 1) => {
    if (solved) return
    const target = index + dir
    if (target < 0 || target >= built.length) return
    const next = [...built]
    ;[next[index], next[target]] = [next[target], next[index]]
    setBuilt(next)
  }

  const fraction = useMemo(() => {
    const sol = scenario.solution
    let match = 0
    for (let i = 0; i < Math.min(built.length, sol.length); i++) {
      if (built[i].type === sol[i]) match++
    }
    return match / sol.length
  }, [built, scenario.solution])

  const handleCheck = () => {
    const attemptNumber = attempts + 1
    setAttempts(attemptNumber)
    const sol = scenario.solution
    const issues: string[] = []
    if (built[0]?.type !== 'START') issues.push('ต้องเริ่มต้นด้วยบล็อก START')
    if (built[built.length - 1]?.type !== 'END') issues.push('ต้องจบด้วยบล็อก END')
    if (!built.some((b) => b.type === 'IF')) issues.push('ยังไม่มีเงื่อนไข (IF)')
    if (built.length !== sol.length) issues.push('ลำดับขั้นตอนยังไม่สมบูรณ์ หรือมีบล็อกที่ไม่จำเป็นปนอยู่')
    const outputIdx = built.findIndex((b) => b.type === 'OUTPUT')
    const ifIdx = built.findIndex((b) => b.type === 'IF')
    if (outputIdx !== -1 && ifIdx !== -1 && outputIdx < ifIdx) issues.push('มี Output ก่อนที่จะตรวจสอบเงื่อนไข')

    if (issues.length === 0 && fraction === 1) {
      setSolved(true)
      onSolved(1, attemptNumber)
    } else if (issues.length === 0) {
      issues.push('ลำดับใกล้เคียงแล้ว แต่ยังมีบางจุดคลาดเคลื่อน ลองตรวจดูอีกครั้ง')
      setHints(issues)
    } else {
      setHints(issues)
    }
  }

  const giveUpAndAccept = () => {
    setSolved(true)
    onSolved(fraction, attempts || 1)
  }

  const onPoolDragStart = (b: AlgoBlock) => (e: React.DragEvent) => {
    dragDataRef.current = { source: 'pool', blockId: b.id }
    e.dataTransfer.effectAllowed = 'move'
  }
  const onChainDragStart = (b: AlgoBlock) => (e: React.DragEvent) => {
    dragDataRef.current = { source: 'chain', blockId: b.id }
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDropAt = (index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverIndex(null)
    const payload = dragDataRef.current
    dragDataRef.current = null
    if (!payload) return
    if (payload.source === 'pool') {
      const block = pool.find((p) => p.id === payload.blockId)
      if (block) insertBlockAt(block, index)
    } else {
      reorderChain(payload.blockId, index)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
        <p className="text-sm font-medium">{scenario.storySetup}</p>
      </div>

      <div>
        <p className="text-xs text-[var(--color-ink-dim)] mb-2">
          Flowchart ของเธอ — ลากบล็อกจากคลังด้านล่างมาวางต่อกันได้เลย (หรือแตะเพื่อนำออก)
        </p>
        <div
          className="rounded-xl p-3 min-h-20 flex flex-col items-center"
          style={{ background: 'rgba(0,0,0,0.15)', border: dragOverIndex === 'end' ? '2px dashed var(--color-mint)' : '2px dashed transparent' }}
          onDragOver={(e) => {
            e.preventDefault()
            if (dragOverIndex !== 'end') setDragOverIndex('end')
          }}
          onDrop={handleDropAt(built.length)}
        >
          {built.length === 0 && (
            <p className="text-xs text-[var(--color-ink-faint)] italic py-3">ยังไม่มีบล็อก — ลากจากคลังด้านล่างมาวางตรงนี้</p>
          )}
          {built.map((b, i) => (
            <div key={b.id} className="w-full flex flex-col items-center">
              {i > 0 && <Arrow />}
              <div
                draggable={!solved}
                onDragStart={onChainDragStart(b)}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (dragOverIndex !== i) setDragOverIndex(i)
                }}
                onDrop={handleDropAt(i)}
                className="relative flex items-center gap-2"
                style={{
                  outline: dragOverIndex === i ? '2px dashed var(--color-mint)' : 'none',
                  outlineOffset: 3,
                  cursor: solved ? 'default' : 'grab',
                }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"
                  style={{ background: 'var(--color-surface-3)' }}
                >
                  {i + 1}
                </span>
                <button onClick={() => removeBlock(b)} disabled={solved} className="disabled:cursor-default">
                  <FlowShape block={b} />
                </button>
                {!solved && (
                  <div className="flex flex-col shrink-0">
                    <button onClick={() => move(i, -1)} aria-label="เลื่อนขึ้น" className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] leading-none px-1 text-xs">▲</button>
                    <button onClick={() => move(i, 1)} aria-label="เลื่อนลง" className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] leading-none px-1 text-xs">▼</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!solved && (
        <div>
          <p className="text-xs text-[var(--color-ink-dim)] mb-2">คลังบล็อก (ลากขึ้นไปวาง หรือแตะเพื่อเพิ่มต่อท้าย)</p>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {pool.map((b) => (
              <div
                key={b.id}
                draggable
                onDragStart={onPoolDragStart(b)}
                onClick={() => addBlock(b)}
                style={{ cursor: 'grab' }}
              >
                <FlowShape block={b} />
              </div>
            ))}
          </div>
        </div>
      )}

      {hints && (
        <div className="rounded-lg p-3.5 text-sm space-y-1" style={{ background: 'rgba(242,118,92,0.12)', color: 'var(--color-coral)' }}>
          {hints.map((h, i) => (
            <p key={i}>• {h}</p>
          ))}
        </div>
      )}

      {solved ? (
        <div className="rounded-lg p-3.5 text-sm" style={{ background: 'rgba(94,234,212,0.12)', color: 'var(--color-mint)' }}>
          Algorithm ถูกต้อง! ({attempts} ครั้งที่ลอง)
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleCheck}
            disabled={built.length === 0}
            className="flex-1 rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
            style={{ background: 'var(--color-mint)' }}
          >
            ตรวจสอบ Algorithm
          </button>
          {attempts >= 3 && (
            <button
              onClick={giveUpAndAccept}
              className="rounded-lg py-3 px-4 text-sm border border-[var(--color-surface-3)] text-[var(--color-ink-dim)]"
            >
              ไปต่อ
            </button>
          )}
        </div>
      )}
    </div>
  )
}
