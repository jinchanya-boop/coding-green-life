import { useRef, useState } from 'react'
import type { BlockDef, CodeChallenge } from '../data/mission6Content'
import { runProgram } from '../data/mission6Content'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const KIND_COLOR: Record<string, string> = {
  set: '#38BDF8',
  forEachStart: '#A78BFA',
  forEachEnd: '#A78BFA',
  if: '#FB923C',
  else: '#FBBF24',
  endIf: '#FB923C',
  increment: '#4ADE80',
  output: '#F4B942',
}

interface DragPayload {
  source: 'pool' | 'built'
  blockId: string
}

export function CodeBuilderActivity({
  challenge,
  onSolved,
}: {
  challenge: CodeChallenge
  onSolved: (passed: boolean, attempts: number) => void
}) {
  const [pool, setPool] = useState<BlockDef[]>(() => shuffle(challenge.pool))
  const [built, setBuilt] = useState<BlockDef[]>([])
  const [attempts, setAttempts] = useState(0)
  const [runResult, setRunResult] = useState<{ trace: string[]; output: number | null; error?: string } | null>(null)
  const [passed, setPassed] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | 'end' | null>(null)
  const dragDataRef = useRef<DragPayload | null>(null)

  const addToEnd = (b: BlockDef) => {
    if (passed) return
    setRunResult(null)
    setPool((p) => p.filter((x) => x.id !== b.id))
    setBuilt((seq) => [...seq, b])
  }
  const insertAt = (b: BlockDef, index: number) => {
    if (passed) return
    setRunResult(null)
    setPool((p) => p.filter((x) => x.id !== b.id))
    setBuilt((seq) => {
      const next = [...seq]
      next.splice(index, 0, b)
      return next
    })
  }
  const removeBlock = (b: BlockDef) => {
    if (passed) return
    setRunResult(null)
    setBuilt((seq) => seq.filter((x) => x.id !== b.id))
    setPool((p) => [...p, b])
  }
  const reorder = (fromId: string, toIndex: number) => {
    if (passed) return
    setBuilt((seq) => {
      const fromIndex = seq.findIndex((x) => x.id === fromId)
      if (fromIndex === -1) return seq
      const next = [...seq]
      const [moved] = next.splice(fromIndex, 1)
      const adjusted = fromIndex < toIndex ? toIndex - 1 : toIndex
      next.splice(adjusted, 0, moved)
      return next
    })
  }
  const move = (index: number, dir: -1 | 1) => {
    if (passed) return
    const target = index + dir
    if (target < 0 || target >= built.length) return
    const next = [...built]
    ;[next[index], next[target]] = [next[target], next[index]]
    setBuilt(next)
  }

  const handleRun = () => {
    const attemptNumber = attempts + 1
    setAttempts(attemptNumber)
    const result = runProgram(built, challenge.dataset)
    setRunResult(result)
    if (!result.error && result.output === challenge.expectedOutput) {
      setPassed(true)
      onSolved(true, attemptNumber)
    }
  }

  const giveUp = () => {
    setPassed(true)
    onSolved(false, attempts || 1)
  }

  // compute indentation depth per row
  let depth = 0
  const rows = built.map((b) => {
    let thisDepth = depth
    if (b.kind === 'forEachEnd' || b.kind === 'endIf') {
      depth = Math.max(0, depth - 1)
      thisDepth = depth
    } else if (b.kind === 'else') {
      thisDepth = Math.max(0, depth - 1)
    }
    const row = { block: b, depth: thisDepth }
    if (b.kind === 'forEachStart' || b.kind === 'if') depth++
    return row
  })

  const onPoolDragStart = (b: BlockDef) => () => {
    dragDataRef.current = { source: 'pool', blockId: b.id }
  }
  const onBuiltDragStart = (b: BlockDef) => () => {
    dragDataRef.current = { source: 'built', blockId: b.id }
  }
  const handleDropAt = (index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverIndex(null)
    const payload = dragDataRef.current
    dragDataRef.current = null
    if (!payload) return
    if (payload.source === 'pool') {
      const block = pool.find((p) => p.id === payload.blockId)
      if (block) insertAt(block, index)
    } else {
      reorder(payload.blockId, index)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
        <p className="text-sm font-medium">{challenge.storySetup}</p>
        <p className="text-xs text-[var(--color-ink-dim)] mt-1.5">
          ข้อมูล {challenge.datasetLabel}: {challenge.dataset.length} รายการ — คำตอบที่ถูกต้องคือตัวเลข 1 ค่า
        </p>
      </div>

      <div>
        <p className="text-xs text-[var(--color-ink-dim)] mb-2">โค้ดของเธอ — ลากบล็อกจากคลังมาวาง หรือแตะเพื่อต่อท้าย</p>
        <div
          className="rounded-xl p-3 font-mono text-xs space-y-1 min-h-24"
          style={{ background: '#0B1E19', border: '1px solid var(--color-surface-3)' }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOverIndex('end')
          }}
          onDrop={handleDropAt(built.length)}
        >
          {rows.length === 0 && <p className="text-[var(--color-ink-faint)] italic">// ยังไม่มีโค้ด — ลากบล็อกจากคลังด้านล่างมาวางตรงนี้</p>}
          {rows.map(({ block, depth: d }, i) => (
            <div
              key={block.id}
              draggable={!passed}
              onDragStart={onBuiltDragStart(block)}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverIndex(i)
              }}
              onDrop={handleDropAt(i)}
              className="flex items-center gap-2 rounded px-1.5 py-1"
              style={{
                paddingLeft: 8 + d * 18,
                background: dragOverIndex === i ? 'rgba(94,234,212,0.1)' : 'transparent',
                outline: dragOverIndex === i ? '1px dashed var(--color-mint)' : 'none',
              }}
            >
              <span className="text-[var(--color-ink-faint)] w-4 shrink-0">{i + 1}</span>
              <button
                onClick={() => removeBlock(block)}
                disabled={passed}
                style={{ color: KIND_COLOR[block.kind] }}
                className="disabled:cursor-default text-left"
              >
                {block.label}
              </button>
              {!passed && (
                <span className="flex gap-0.5 ml-auto shrink-0">
                  <button onClick={() => move(i, -1)} className="text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] px-0.5">▲</button>
                  <button onClick={() => move(i, 1)} className="text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] px-0.5">▼</button>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {!passed && (
        <div>
          <p className="text-xs text-[var(--color-ink-dim)] mb-2">คลังบล็อก</p>
          <div className="flex flex-wrap gap-2">
            {pool.map((b) => (
              <div
                key={b.id}
                draggable
                onDragStart={onPoolDragStart(b)}
                onClick={() => addToEnd(b)}
                className="font-mono text-xs rounded-md px-2.5 py-1.5 border cursor-grab"
                style={{ borderColor: KIND_COLOR[b.kind], color: KIND_COLOR[b.kind], background: `${KIND_COLOR[b.kind]}14` }}
              >
                {b.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {runResult && (
        <div
          className="rounded-lg p-3.5 text-xs font-mono space-y-1"
          style={{
            background: runResult.error || runResult.output !== challenge.expectedOutput ? 'rgba(242,118,92,0.1)' : 'rgba(94,234,212,0.1)',
            color: 'var(--color-ink)',
          }}
        >
          <p className="text-[var(--color-mint)] font-display font-medium mb-1 not-italic">▶ ผลการรัน (Console)</p>
          {runResult.error ? (
            <p style={{ color: 'var(--color-coral)' }}>⚠ Error: {runResult.error}</p>
          ) : (
            <>
              {runResult.trace.slice(-6).map((line, i) => (
                <p key={i} className="text-[var(--color-ink-dim)]">
                  {line}
                </p>
              ))}
              <p className="mt-1.5" style={{ color: runResult.output === challenge.expectedOutput ? 'var(--color-mint)' : 'var(--color-coral)' }}>
                {runResult.output === challenge.expectedOutput
                  ? `✅ ผลลัพธ์ถูกต้อง! (${runResult.output})`
                  : `❌ ได้ผลลัพธ์ ${runResult.output ?? 'ไม่มี'} แต่ควรจะได้ค่าที่ถูกต้อง ลองตรวจโค้ดอีกครั้ง`}
              </p>
            </>
          )}
        </div>
      )}

      {!passed ? (
        <div className="flex gap-3">
          <button
            onClick={handleRun}
            disabled={built.length === 0}
            className="flex-1 rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
            style={{ background: 'var(--color-mint)' }}
          >
            ▶ RUN
          </button>
          {attempts >= 3 && (
            <button onClick={giveUp} className="rounded-lg py-3 px-4 text-sm border border-[var(--color-surface-3)] text-[var(--color-ink-dim)]">
              ไปต่อ
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-lg p-3.5 text-sm text-center" style={{ background: 'rgba(94,234,212,0.12)', color: 'var(--color-mint)' }}>
          {runResult?.output === challenge.expectedOutput ? `โปรแกรมทำงานถูกต้อง! (${attempts} ครั้งที่ลอง)` : `ไปต่อ (${attempts} ครั้งที่ลอง)`}
        </div>
      )}
    </div>
  )
}
