import { useEffect, useRef, useState, type SyntheticEvent } from 'react'

// Maze layout: '#' = wall, '.' = open path (dot spawns here unless it's a start cell)
const MAZE = [
  '###############',
  '#.............#',
  '#.##.#####.##.#',
  '#.............#',
  '#.###.###.###.#',
  '#.............#',
  '#.##.#####.##.#',
  '#.............#',
  '###############',
]
const COLS = MAZE[0].length
const ROWS = MAZE.length
const CELL = 40
const CANVAS_W = COLS * CELL
const CANVAS_H = ROWS * CELL

const PLAYER_START = { col: 1, row: 1 }
const GHOST_STARTS = [
  { col: 13, row: 3 },
  { col: 7, row: 7 },
]

const ROUND_SECONDS = 25
const MOVE_TICK_MS = 170 // player step speed
const GHOST_TICK_EVERY = 2 // ghosts move every Nth tick (slower than player)
const MAX_LIVES = 3

type Dir = 'up' | 'down' | 'left' | 'right' | null

function isWall(col: number, row: number): boolean {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return true
  return MAZE[row][col] === '#'
}

function step(col: number, row: number, dir: Dir): { col: number; row: number } {
  if (dir === 'up') return { col, row: row - 1 }
  if (dir === 'down') return { col, row: row + 1 }
  if (dir === 'left') return { col: col - 1, row }
  if (dir === 'right') return { col: col + 1, row }
  return { col, row }
}

function canStep(col: number, row: number, dir: Dir): boolean {
  const n = step(col, row, dir)
  return !isWall(n.col, n.row)
}

const ALL_DIRS: Dir[] = ['up', 'down', 'left', 'right']
const OPPOSITE: Record<string, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }

function buildInitialDots(): Set<string> {
  const dots = new Set<string>()
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (MAZE[r][c] === '.') dots.add(`${c},${r}`)
    }
  }
  dots.delete(`${PLAYER_START.col},${PLAYER_START.row}`)
  GHOST_STARTS.forEach((g) => dots.delete(`${g.col},${g.row}`))
  return dots
}

export function GreenPatrolGame({ onComplete }: { onComplete: (bonusScore: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [ended, setEnded] = useState(false)

  const playerRef = useRef({ ...PLAYER_START })
  const facingRef = useRef<Dir>('right')
  const heldDirRef = useRef<Dir>(null)
  const ghostsRef = useRef(GHOST_STARTS.map((g) => ({ ...g, dir: 'up' as Dir })))
  const dotsRef = useRef(buildInitialDots())
  const scoreRef = useRef(0)
  const livesRef = useRef(MAX_LIVES)
  const invulnRef = useRef(0)
  const tickCountRef = useRef(0)
  const endedRef = useRef(false)
  const mouthPhaseRef = useRef(0)

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') heldDirRef.current = 'up'
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') heldDirRef.current = 'down'
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') heldDirRef.current = 'left'
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') heldDirRef.current = 'right'
      else return
      e.preventDefault()
    }
    const keyUp = (e: KeyboardEvent) => {
      const released: Dir =
        e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W'
          ? 'up'
          : e.key === 'ArrowDown' || e.key === 's' || e.key === 'S'
            ? 'down'
            : e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A'
              ? 'left'
              : e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D'
                ? 'right'
                : null
      if (released && heldDirRef.current === released) heldDirRef.current = null
    }
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    const finish = () => {
      if (endedRef.current) return
      endedRef.current = true
      setEnded(true)
      setTimeout(() => onComplete(scoreRef.current), 500)
    }

    const moveTimer = setInterval(() => {
      if (endedRef.current) return
      tickCountRef.current++
      mouthPhaseRef.current = (mouthPhaseRef.current + 1) % 6

      // --- player move ---
      const p = playerRef.current
      const dir = heldDirRef.current
      if (dir) {
        const next = step(p.col, p.row, dir)
        if (!isWall(next.col, next.row)) {
          playerRef.current = next
          facingRef.current = dir
          const key = `${next.col},${next.row}`
          if (dotsRef.current.has(key)) {
            dotsRef.current.delete(key)
            scoreRef.current += 5
            setScore(scoreRef.current)
            if (dotsRef.current.size === 0) finish()
          }
        }
      }

      // --- ghosts move (slower) ---
      if (tickCountRef.current % GHOST_TICK_EVERY === 0) {
        ghostsRef.current = ghostsRef.current.map((g) => {
          const preferred = ALL_DIRS.filter((d) => d !== OPPOSITE[g.dir ?? ''] && canStep(g.col, g.row, d))
          const fallback = ALL_DIRS.filter((d) => canStep(g.col, g.row, d))
          const pool = preferred.length > 0 ? preferred : fallback
          const chosen: Dir = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : g.dir
          const moved = step(g.col, g.row, chosen)
          return { col: moved.col, row: moved.row, dir: chosen }
        })
      }

      // --- collision check ---
      if (invulnRef.current > 0) invulnRef.current--
      const pp = playerRef.current
      const hit = ghostsRef.current.some((g) => g.col === pp.col && g.row === pp.row)
      if (hit && invulnRef.current === 0) {
        livesRef.current -= 1
        setLives(livesRef.current)
        invulnRef.current = 6
        playerRef.current = { ...PLAYER_START }
        if (livesRef.current <= 0) finish()
      }

      draw()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, MOVE_TICK_MS)

    const countdown = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdown)
          finish()
          return 0
        }
        return t - 1
      })
    }, 1000)

    const draw = () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
      ctx.fillStyle = '#0D1F1C'
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // walls
      ctx.fillStyle = '#1E4A3E'
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (MAZE[r][c] === '#') ctx.fillRect(c * CELL, r * CELL, CELL, CELL)
        }
      }

      // dots
      ctx.fillStyle = '#5EEAD4'
      dotsRef.current.forEach((key) => {
        const [c, r] = key.split(',').map(Number)
        ctx.beginPath()
        ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 5, 0, Math.PI * 2)
        ctx.fill()
      })

      // ghosts
      ghostsRef.current.forEach((g) => {
        const cx = g.col * CELL + CELL / 2
        const cy = g.row * CELL + CELL / 2
        ctx.fillStyle = '#F2765C'
        ctx.beginPath()
        ctx.arc(cx, cy - 4, CELL / 2 - 6, Math.PI, 0)
        ctx.lineTo(cx + CELL / 2 - 6, cy + CELL / 2 - 8)
        for (let i = 0; i < 3; i++) {
          const bx = cx + (CELL / 2 - 6) - ((2 * (CELL / 2 - 6)) / 3) * (i + 0.5)
          ctx.lineTo(bx, i % 2 === 0 ? cy + CELL / 2 - 14 : cy + CELL / 2 - 8)
        }
        ctx.lineTo(cx - (CELL / 2 - 6), cy + CELL / 2 - 8)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = '#0D1F1C'
        ctx.beginPath()
        ctx.arc(cx - 6, cy - 4, 3, 0, Math.PI * 2)
        ctx.arc(cx + 6, cy - 4, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // player (pac-man style mouth)
      const p = playerRef.current
      const cx = p.col * CELL + CELL / 2
      const cy = p.row * CELL + CELL / 2
      const isBlinking = invulnRef.current > 0 && invulnRef.current % 2 === 0
      ctx.fillStyle = isBlinking ? 'rgba(94,234,212,0.4)' : '#5EEAD4'
      const mouthOpen = (Math.abs(mouthPhaseRef.current - 3) / 3) * 0.28 + 0.02
      const angleMap: Record<string, number> = { right: 0, down: 90, left: 180, up: 270 }
      const baseAngle = (angleMap[facingRef.current ?? 'right'] * Math.PI) / 180
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, CELL / 2 - 5, baseAngle + mouthOpen * Math.PI, baseAngle + (2 - mouthOpen) * Math.PI)
      ctx.closePath()
      ctx.fill()
    }

    draw()

    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      clearInterval(moveTimer)
      clearInterval(countdown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="font-display text-lg font-semibold">🟢 Green Patrol: ลาดตระเวนเก็บใบไม้! รอบโบนัส</p>
        <p className="text-xs text-[var(--color-ink-dim)] mt-1">
          ใช้ปุ่มลูกศร (หรือ WASD) เดินเก็บจุดสีเขียวในเขาวงกต หลบตัวร้ายสีส้มให้ไว!
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span style={{ color: 'var(--color-gold)' }}>คะแนนโบนัส {score}</span>
        <span>
          {'❤️'.repeat(lives)}
          {'🖤'.repeat(Math.max(0, MAX_LIVES - lives))}
        </span>
        <span className="text-[var(--color-ink-dim)]">เหลือเวลา {timeLeft}s</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 linear"
          style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%`, background: 'var(--color-gold)' }}
        />
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-xl border-2"
          style={{ borderColor: 'var(--color-surface-3)', maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* Touch/click D-pad for tablets and devices without a keyboard */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 grid-rows-3 gap-1.5" style={{ width: 160 }}>
          <div />
          <DpadButton dir="up" heldDirRef={heldDirRef} label="↑" />
          <div />
          <DpadButton dir="left" heldDirRef={heldDirRef} label="←" />
          <div />
          <DpadButton dir="right" heldDirRef={heldDirRef} label="→" />
          <div />
          <DpadButton dir="down" heldDirRef={heldDirRef} label="↓" />
          <div />
        </div>
      </div>

      {ended && <p className="text-center text-sm text-[var(--color-mint)]">จบรอบโบนัสแล้ว! ไปต่อกันเลย →</p>}
    </div>
  )
}

function DpadButton({ dir, heldDirRef, label }: { dir: Dir; heldDirRef: { current: Dir }; label: string }) {
  const press = (e: SyntheticEvent) => {
    e.preventDefault()
    heldDirRef.current = dir
  }
  const release = () => {
    if (heldDirRef.current === dir) heldDirRef.current = null
  }
  return (
    <button
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      className="aspect-square rounded-lg flex items-center justify-center text-lg font-bold select-none"
      style={{ background: 'var(--color-surface-2)', border: '1.5px solid var(--color-surface-3)', color: 'var(--color-mint)', touchAction: 'none' }}
    >
      {label}
    </button>
  )
}
