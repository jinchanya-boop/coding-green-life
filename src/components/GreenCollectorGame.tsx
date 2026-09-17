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

const CANVAS_W = 640
const CANVAS_H = 440
const BIN_ROW_TOP = CANVAS_H - 120
const BIN_H = 100
const BIN_MARGIN = 10
const BIN_W = (CANVAS_W - BIN_MARGIN * 5) / 4
const PLAYER_SPEED = 230
const MAX_HEARTS = 3
const PICKUP_RADIUS = 30
const DROP_RADIUS = 46
const HAZARD_RADIUS = 16
const HAZARD_HIT_RADIUS = 30

interface Vec {
  x: number
  y: number
}

interface FloatText {
  text: string
  x: number
  y: number
  life: number
  color: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

interface Hazard extends Vec {
  vx: number
  vy: number
}

export interface CollectorResult {
  correctCount: number
  wrongCount: number
  errorTypes: string[]
  timeSeconds: number
}

function binCenter(i: number): Vec {
  return { x: BIN_MARGIN + i * (BIN_W + BIN_MARGIN) + BIN_W / 2, y: BIN_ROW_TOP + BIN_H / 2 }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomItemSpot(): Vec {
  return { x: 60 + Math.random() * (CANVAS_W - 120), y: 50 + Math.random() * 170 }
}

export function GreenCollectorGame({ onComplete }: { onComplete: (result: CollectorResult) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerRef = useRef<Vec>({ x: CANVAS_W / 2, y: 260 })
  const keysRef = useRef({ up: false, down: false, left: false, right: false })
  const carryingRef = useRef<WasteItem | null>(null)
  const itemSpotRef = useRef<Vec>(randomItemSpot())
  const queueRef = useRef<WasteItem[]>(shuffle(WASTE_ITEMS))
  const queueIndexRef = useRef(0)
  const resolvedRef = useRef(0)
  const heartsRef = useRef(MAX_HEARTS)
  const invulnUntilRef = useRef(0)
  const scoreRef = useRef(0)
  const correctRef = useRef(0)
  const wrongRef = useRef(0)
  const errorTypesRef = useRef<string[]>([])
  const comboRef = useRef(0)
  const floatTextsRef = useRef<FloatText[]>([])
  const particlesRef = useRef<Particle[]>([])
  const shakeRef = useRef(0)
  const startedAtRef = useRef(Date.now())
  const rafRef = useRef<number | null>(null)
  const endedRef = useRef(false)
  const hazardsRef = useRef<Hazard[]>([
    { x: 120, y: 120, vx: 90, vy: 60 },
    { x: 480, y: 160, vx: -70, vy: 80 },
  ])

  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [carryingLabel, setCarryingLabel] = useState<string | null>(null)

  const currentItem = () => queueRef.current[queueIndexRef.current]

  const finish = () => {
    if (endedRef.current) return
    endedRef.current = true
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    onComplete({
      correctCount: correctRef.current,
      wrongCount: wrongRef.current,
      errorTypes: errorTypesRef.current,
      timeSeconds: Math.round((Date.now() - startedAtRef.current) / 1000),
    })
  }

  const spawnBurst = (x: number, y: number, color: string) => {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * (70 + Math.random() * 60),
        vy: Math.sin(angle) * (70 + Math.random() * 60) - 40,
        life: 0.6 + Math.random() * 0.3,
        color,
      })
    }
  }

  const advanceItem = () => {
    queueIndexRef.current += 1
    carryingRef.current = null
    setCarryingLabel(null)
    if (queueIndexRef.current >= queueRef.current.length) {
      finish()
      return
    }
    itemSpotRef.current = randomItemSpot()
  }

  useEffect(() => {
    const keyMap: Record<string, keyof typeof keysRef.current> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }
    const keyDown = (e: KeyboardEvent) => {
      const k = keyMap[e.key]
      if (k) keysRef.current[k] = true
    }
    const keyUp = (e: KeyboardEvent) => {
      const k = keyMap[e.key]
      if (k) keysRef.current[k] = false
    }
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(40, now - last) / 1000
      last = now

      // player movement
      let dx = 0
      let dy = 0
      if (keysRef.current.up) dy -= 1
      if (keysRef.current.down) dy += 1
      if (keysRef.current.left) dx -= 1
      if (keysRef.current.right) dx += 1
      if (dx !== 0 && dy !== 0) {
        dx *= Math.SQRT1_2
        dy *= Math.SQRT1_2
      }
      const p = playerRef.current
      p.x = Math.max(24, Math.min(CANVAS_W - 24, p.x + dx * PLAYER_SPEED * dt))
      p.y = Math.max(24, Math.min(CANVAS_H - 24, p.y + dy * PLAYER_SPEED * dt))

      // hazards bounce around
      hazardsRef.current.forEach((h) => {
        h.x += h.vx * dt
        h.y += h.vy * dt
        if (h.x < HAZARD_RADIUS || h.x > CANVAS_W - HAZARD_RADIUS) h.vx *= -1
        if (h.y < HAZARD_RADIUS || h.y > BIN_ROW_TOP - HAZARD_RADIUS) h.vy *= -1
        h.x = Math.max(HAZARD_RADIUS, Math.min(CANVAS_W - HAZARD_RADIUS, h.x))
        h.y = Math.max(HAZARD_RADIUS, Math.min(BIN_ROW_TOP - HAZARD_RADIUS, h.y))

        const dist = Math.hypot(h.x - p.x, h.y - p.y)
        if (dist < HAZARD_HIT_RADIUS && now > invulnUntilRef.current) {
          heartsRef.current -= 1
          setHearts(heartsRef.current)
          invulnUntilRef.current = now + 900
          shakeRef.current = 1
          floatTextsRef.current.push({ text: 'โดนแล้ว! 💥', x: p.x, y: p.y - 30, life: 0.8, color: '#EF4444' })
          if (heartsRef.current <= 0) {
            finish()
          }
        }
      })

      // pickup check
      if (!carryingRef.current) {
        const spot = itemSpotRef.current
        const dist = Math.hypot(spot.x - p.x, spot.y - p.y)
        if (dist < PICKUP_RADIUS) {
          const item = currentItem()
          carryingRef.current = item
          setCarryingLabel(item.name)
          floatTextsRef.current.push({ text: 'หยิบแล้ว! ไปหาถังที่ถูก →', x: p.x, y: p.y - 30, life: 0.9, color: 'var(--color-mint)' })
        }
      } else {
        // drop-off check
        for (let i = 0; i < LANES.length; i++) {
          const center = binCenter(i)
          const dist = Math.hypot(center.x - p.x, center.y - p.y)
          if (dist < DROP_RADIUS) {
            resolveDrop(LANES[i])
            break
          }
        }
      }

      floatTextsRef.current = floatTextsRef.current
        .map((f) => ({ ...f, y: f.y - 40 * dt, life: f.life - dt }))
        .filter((f) => f.life > 0)
      particlesRef.current = particlesRef.current
        .map((pt) => ({ ...pt, x: pt.x + pt.vx * dt, y: pt.y + pt.vy * dt, vy: pt.vy + 160 * dt, life: pt.life - dt }))
        .filter((pt) => pt.life > 0)
      if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 6)

      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) draw(ctx, now)
      }

      if (!endedRef.current) rafRef.current = requestAnimationFrame(loop)
    }

    const resolveDrop = (binCategory: WasteCategory) => {
      const item = carryingRef.current!
      // stop counting immediately so lingering in the drop radius for a
      // few frames can't register the same delivery multiple times
      carryingRef.current = null
      setCarryingLabel(null)

      resolvedRef.current += 1
      const isCorrect = binCategory === item.correct
      const p = playerRef.current
      if (isCorrect) {
        comboRef.current += 1
        const gain = 10 + Math.min(20, comboRef.current * 2)
        scoreRef.current += gain
        correctRef.current += 1
        setScore(scoreRef.current)
        spawnBurst(p.x, p.y, BIN_COLOR[binCategory])
        floatTextsRef.current.push({
          text: comboRef.current >= 3 ? `🔥 COMBO x${comboRef.current}! +${gain}` : `เยี่ยม! +${gain}`,
          x: p.x,
          y: p.y - 30,
          life: 0.9,
          color: BIN_COLOR[binCategory],
        })
      } else {
        comboRef.current = 0
        wrongRef.current += 1
        errorTypesRef.current.push(
          `${item.name}: ทิ้งลง "${CATEGORY_LABEL[binCategory]}" ที่ถูกคือ "${CATEGORY_LABEL[item.correct]}"`
        )
        shakeRef.current = 0.6
        floatTextsRef.current.push({ text: `ผิดถัง — ที่ถูกคือ ${CATEGORY_LABEL[item.correct]}`, x: p.x, y: p.y - 30, life: 1, color: '#EF4444' })
      }
      setProgress(resolvedRef.current)
      setTimeout(() => advanceItem(), 250)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const drawBin = (ctx: CanvasRenderingContext2D, i: number, cat: WasteCategory) => {
    const x = BIN_MARGIN + i * (BIN_W + BIN_MARGIN)
    const color = BIN_COLOR[cat]
    ctx.beginPath()
    ctx.roundRect(x, BIN_ROW_TOP, BIN_W, BIN_H, 14)
    ctx.fillStyle = color
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = '#0D1F1C'
    ctx.stroke()

    ctx.font = '30px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(BIN_ICON[cat], x + BIN_W / 2, BIN_ROW_TOP + 42)

    ctx.font = 'bold 13px Kanit, sans-serif'
    ctx.fillStyle = '#0D1F1C'
    ctx.fillText(CATEGORY_LABEL[cat], x + BIN_W / 2, BIN_ROW_TOP + 70)
    ctx.font = '10px Sarabun, sans-serif'
    ctx.fillText(cat.toUpperCase(), x + BIN_W / 2, BIN_ROW_TOP + 86)
  }

  const draw = (ctx: CanvasRenderingContext2D, now: number) => {
    const shakeX = shakeRef.current > 0 ? (Math.random() - 0.5) * 10 * shakeRef.current : 0
    ctx.save()
    ctx.translate(shakeX, 0)
    ctx.clearRect(-20, 0, CANVAS_W + 40, CANVAS_H)

    // play field
    const grad = ctx.createLinearGradient(0, 0, 0, BIN_ROW_TOP)
    grad.addColorStop(0, '#173A31')
    grad.addColorStop(1, '#0F2721')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CANVAS_W, BIN_ROW_TOP)

    // subtle grid dots for texture
    ctx.fillStyle = 'rgba(94,234,212,0.08)'
    for (let gx = 20; gx < CANVAS_W; gx += 40) {
      for (let gy = 20; gy < BIN_ROW_TOP; gy += 40) {
        ctx.beginPath()
        ctx.arc(gx, gy, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // bins row background
    ctx.fillStyle = '#0B1E19'
    ctx.fillRect(0, BIN_ROW_TOP - 4, CANVAS_W, CANVAS_H - BIN_ROW_TOP + 4)
    LANES.forEach((cat, i) => drawBin(ctx, i, cat))

    // hazards
    hazardsRef.current.forEach((h) => {
      ctx.font = '30px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('🦟', h.x, h.y + 10)
    })

    // waste item on the ground (if not carried)
    if (!carryingRef.current) {
      const spot = itemSpotRef.current
      const bob = Math.sin(now / 300) * 4
      ctx.font = '34px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(currentItem().emoji, spot.x, spot.y + bob)
    }

    // player truck
    const p = playerRef.current
    const invuln = now < invulnUntilRef.current
    ctx.globalAlpha = invuln ? 0.5 + 0.3 * Math.sin(now / 60) : 1
    ctx.font = '40px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🚚', p.x, p.y + 12)
    ctx.globalAlpha = 1
    if (carryingRef.current) {
      ctx.font = '24px sans-serif'
      ctx.fillText(carryingRef.current.emoji, p.x, p.y - 22)
    }

    // particles
    particlesRef.current.forEach((pt) => {
      ctx.globalAlpha = Math.max(0, Math.min(1, pt.life))
      ctx.fillStyle = pt.color
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    })

    // floating texts
    floatTextsRef.current.forEach((f) => {
      ctx.globalAlpha = Math.max(0, Math.min(1, f.life))
      ctx.fillStyle = f.color
      ctx.font = 'bold 15px Kanit, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(f.text, f.x, f.y)
      ctx.globalAlpha = 1
    })

    ctx.restore()
  }

  const holdKey = (k: keyof typeof keysRef.current, val: boolean) => (e: React.SyntheticEvent) => {
    e.preventDefault()
    keysRef.current[k] = val
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[var(--color-ink-dim)]">
        <span>ด่านที่ {Math.min(progress + 1, WASTE_ITEMS.length)} / {WASTE_ITEMS.length}</span>
        <span className="flex items-center gap-2">
          <span>{'❤️'.repeat(hearts)}{'🖤'.repeat(MAX_HEARTS - hearts)}</span>
          <span style={{ color: 'var(--color-gold)' }}>คะแนน {score}</span>
        </span>
      </div>
      <div className="rounded-2xl overflow-hidden border border-[var(--color-surface-3)]" style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}>
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="w-full h-full block" />
      </div>
      <p className="text-center text-xs text-[var(--color-ink-dim)]">
        {carryingLabel ? `กำลังถือ: ${carryingLabel} — ขับไปทิ้งถังที่ถูกให้ตรงสี!` : 'ขับรถไปรับขยะที่ตกอยู่ แล้วนำไปทิ้งถังที่ถูกต้อง หลบยุงพิษด้วย! 🦟'}
      </p>
      <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto">
        <div />
        <button
          onMouseDown={holdKey('up', true)}
          onMouseUp={holdKey('up', false)}
          onMouseLeave={holdKey('up', false)}
          onTouchStart={holdKey('up', true)}
          onTouchEnd={holdKey('up', false)}
          className="rounded-lg py-3 text-xl border border-[var(--color-surface-3)]"
          style={{ background: 'var(--color-surface-2)' }}
          aria-label="ขึ้น"
        >
          ▲
        </button>
        <div />
        <button
          onMouseDown={holdKey('left', true)}
          onMouseUp={holdKey('left', false)}
          onMouseLeave={holdKey('left', false)}
          onTouchStart={holdKey('left', true)}
          onTouchEnd={holdKey('left', false)}
          className="rounded-lg py-3 text-xl border border-[var(--color-surface-3)]"
          style={{ background: 'var(--color-surface-2)' }}
          aria-label="ซ้าย"
        >
          ◀
        </button>
        <button
          onMouseDown={holdKey('down', true)}
          onMouseUp={holdKey('down', false)}
          onMouseLeave={holdKey('down', false)}
          onTouchStart={holdKey('down', true)}
          onTouchEnd={holdKey('down', false)}
          className="rounded-lg py-3 text-xl border border-[var(--color-surface-3)]"
          style={{ background: 'var(--color-surface-2)' }}
          aria-label="ลง"
        >
          ▼
        </button>
        <button
          onMouseDown={holdKey('right', true)}
          onMouseUp={holdKey('right', false)}
          onMouseLeave={holdKey('right', false)}
          onTouchStart={holdKey('right', true)}
          onTouchEnd={holdKey('right', false)}
          className="rounded-lg py-3 text-xl border border-[var(--color-surface-3)]"
          style={{ background: 'var(--color-surface-2)' }}
          aria-label="ขวา"
        >
          ▶
        </button>
      </div>
    </div>
  )
}
