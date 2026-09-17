import { useEffect, useRef, useState } from 'react'

const LANES_Y = [55, 120, 185]
const CANVAS_W = 640
const CANVAS_H = 240
const CAR_X = 90
const BASE_SPEED = 180
const BOOST_SPEED = 340
const BOOST_MS = 3000
const ROUND_SECONDS = 18
const ITEM_EMOJIS = ['🌿', '⚡', '💚']
const OBSTACLE_EMOJI = '🚧'

const QUIZ_POOL = [
  { q: 'ขวดพลาสติก PET รีไซเคิลได้ไหม?', options: ['ได้', 'ไม่ได้'], correct: 0 },
  { q: 'เศษอาหารควรทิ้งถังไหน?', options: ['ถังอินทรีย์', 'ถังทั่วไป'], correct: 0 },
  { q: 'ถ่านไฟฉายใช้แล้วเป็นขยะประเภทไหน?', options: ['ขยะอันตราย', 'ขยะทั่วไป'], correct: 0 },
  { q: 'ปิดไฟเมื่อไม่ใช้ช่วยประหยัดอะไร?', options: ['พลังงาน', 'น้ำ'], correct: 0 },
  { q: 'กระดาษใช้แล้วนำไปทำอะไรได้?', options: ['รีไซเคิลเป็นกระดาษใหม่', 'ต้องทิ้งอย่างเดียว'], correct: 0 },
]

interface Obj {
  id: number
  lane: number
  x: number
  isObstacle: boolean
  emoji: string
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

export function BonusRaceGame({ onComplete }: { onComplete: (score: number) => void }) {
  const carLaneRef = useRef(1)
  const carYRef = useRef(LANES_Y[1])
  const objectsRef = useRef<Obj[]>([])
  const floatTextsRef = useRef<FloatText[]>([])
  const particlesRef = useRef<Particle[]>([])
  const shakeRef = useRef(0)
  const idRef = useRef(0)
  const scoreRef = useRef(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const boostUntilRef = useRef(0)
  const [boosting, setBoosting] = useState(false)
  const [quiz, setQuiz] = useState<(typeof QUIZ_POOL)[number] | null>(null)
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null)
  const pausedRef = useRef(false)
  const nextQuizAtRef = useRef(4000)
  const startedAtRef = useRef(Date.now())
  const rafRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const endedRef = useRef(false)

  const finish = () => {
    if (endedRef.current) return
    endedRef.current = true
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    onComplete(scoreRef.current)
  }

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (pausedRef.current) return
      if (e.key === 'ArrowUp') carLaneRef.current = Math.max(0, carLaneRef.current - 1)
      if (e.key === 'ArrowDown') carLaneRef.current = Math.min(2, carLaneRef.current + 1)
    }
    window.addEventListener('keydown', keyDown)

    const countdown = setInterval(() => {
      if (pausedRef.current) return
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdown)
          finish()
          return 0
        }
        return t - 1
      })
    }, 1000)

    let lastSpawn = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(40, now - last) / 1000
      last = now

      if (!pausedRef.current) {
        const elapsed = now - startedAtRef.current
        if (elapsed >= nextQuizAtRef.current && !quiz) {
          pausedRef.current = true
          setQuiz(QUIZ_POOL[Math.floor(Math.random() * QUIZ_POOL.length)])
        }

        const speed = now < boostUntilRef.current ? BOOST_SPEED : BASE_SPEED
        setBoosting(now < boostUntilRef.current)

        // move car smoothly to target lane
        const targetY = LANES_Y[carLaneRef.current]
        carYRef.current += (targetY - carYRef.current) * Math.min(1, dt * 10)

        // spawn
        if (now - lastSpawn > 550) {
          lastSpawn = now
          const isObstacle = Math.random() < 0.3
          objectsRef.current.push({
            id: idRef.current++,
            lane: Math.floor(Math.random() * 3),
            x: CANVAS_W + 20,
            isObstacle,
            emoji: isObstacle ? OBSTACLE_EMOJI : ITEM_EMOJIS[Math.floor(Math.random() * ITEM_EMOJIS.length)],
          })
        }

        // update + collide
        objectsRef.current = objectsRef.current.filter((o) => {
          o.x -= speed * dt
          if (Math.abs(o.x - CAR_X) < 22 && o.lane === carLaneRef.current) {
            const py = LANES_Y[o.lane]
            if (o.isObstacle) {
              scoreRef.current = Math.max(0, scoreRef.current - 3)
              shakeRef.current = 1
              floatTextsRef.current.push({ text: '-3 💥', x: CAR_X, y: py - 18, life: 0.7, color: '#F87171' })
              for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8
                particlesRef.current.push({
                  x: CAR_X,
                  y: py,
                  vx: Math.cos(angle) * 70,
                  vy: Math.sin(angle) * 70 - 20,
                  life: 0.5,
                  color: '#F87171',
                })
              }
            } else {
              scoreRef.current += 5
              floatTextsRef.current.push({ text: '+5 ✨', x: CAR_X, y: py - 18, life: 0.7, color: '#FDE68A' })
              for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8
                particlesRef.current.push({
                  x: CAR_X,
                  y: py,
                  vx: Math.cos(angle) * 60,
                  vy: Math.sin(angle) * 60 - 30,
                  life: 0.5,
                  color: '#FDE68A',
                })
              }
            }
            setScore(scoreRef.current)
            return false
          }
          return o.x > -30
        })

        floatTextsRef.current = floatTextsRef.current
          .map((f) => ({ ...f, y: f.y - 30 * dt, life: f.life - dt }))
          .filter((f) => f.life > 0)
        particlesRef.current = particlesRef.current
          .map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, vy: p.vy + 140 * dt, life: p.life - dt }))
          .filter((p) => p.life > 0)
        if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt * 6)
      }

      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) draw(ctx, now)
      }

      if (!endedRef.current) rafRef.current = requestAnimationFrame(loop)
    }

    const draw = (ctx: CanvasRenderingContext2D, now: number) => {
      const shakeX = shakeRef.current > 0 ? (Math.random() - 0.5) * 8 * shakeRef.current : 0
      ctx.save()
      ctx.translate(shakeX, 0)
      ctx.clearRect(-20, 0, CANVAS_W + 40, CANVAS_H)
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
      grad.addColorStop(0, '#173A31')
      grad.addColorStop(1, '#0F2721')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // lane dividers, scrolling
      const speed = now < boostUntilRef.current ? BOOST_SPEED : BASE_SPEED
      const offset = pausedRef.current ? 0 : (now * speed * 0.001) % 30
      ctx.strokeStyle = 'rgba(94,234,212,0.25)'
      ctx.lineWidth = 2
      ctx.setLineDash([16, 14])
      ;[87, 152].forEach((y) => {
        ctx.beginPath()
        ctx.lineDashOffset = -offset
        ctx.moveTo(0, y)
        ctx.lineTo(CANVAS_W, y)
        ctx.stroke()
      })
      ctx.setLineDash([])

      objectsRef.current.forEach((o) => {
        ctx.font = '28px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(o.emoji, o.x, LANES_Y[o.lane] + 8)
      })

      ctx.font = '38px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(now < boostUntilRef.current ? '🏎️💨' : '🏎️', CAR_X, carYRef.current + 10)

      // particles
      particlesRef.current.forEach((p) => {
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2))
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // floating texts
      floatTextsRef.current.forEach((f) => {
        ctx.globalAlpha = Math.max(0, Math.min(1, f.life * 1.5))
        ctx.fillStyle = f.color
        ctx.font = 'bold 15px Kanit, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(f.text, f.x, f.y)
        ctx.globalAlpha = 1
      })

      ctx.restore()
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('keydown', keyDown)
      clearInterval(countdown)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const move = (dir: -1 | 1) => {
    if (pausedRef.current) return
    carLaneRef.current = Math.max(0, Math.min(2, carLaneRef.current + dir))
  }

  const answerQuiz = (idx: number) => {
    if (!quiz) return
    const correct = idx === quiz.correct
    setQuizFeedback(correct ? 'correct' : 'wrong')
    if (correct) {
      boostUntilRef.current = performance.now() + BOOST_MS
      scoreRef.current += 10
      setScore(scoreRef.current)
    }
    setTimeout(() => {
      setQuiz(null)
      setQuizFeedback(null)
      pausedRef.current = false
      nextQuizAtRef.current += 4500 + Math.random() * 1500
    }, 900)
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="font-display text-lg font-semibold">🏁 มินิเกมแข่งรถโบนัส</p>
        <p className="text-xs text-[var(--color-ink-dim)] mt-1">
          เก็บพลังงานเขียว หลบสิ่งกีดขวาง แล้วตอบคำถามให้ถูกเพื่อเร่งเครื่อง NITRO!
        </p>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: boosting ? 'var(--color-gold)' : 'var(--color-ink-dim)' }}>
          {boosting ? '🔥 NITRO BOOST!' : `เวลา ${timeLeft}s`}
        </span>
        <span style={{ color: 'var(--color-gold)' }}>คะแนน {score}</span>
      </div>
      <div className="relative rounded-2xl overflow-hidden border border-[var(--color-surface-3)]" style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}>
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="w-full h-full block" />
        {quiz && (
          <div className="absolute inset-0 flex items-center justify-center p-4" style={{ background: 'rgba(8,21,18,0.92)' }}>
            <div className="w-full max-w-xs space-y-3">
              <p className="text-center text-sm font-medium">{quiz.q}</p>
              {quizFeedback ? (
                <p className="text-center text-sm font-display font-semibold" style={{ color: quizFeedback === 'correct' ? 'var(--color-mint)' : 'var(--color-coral)' }}>
                  {quizFeedback === 'correct' ? '🔥 ถูกต้อง! เร่งเครื่อง!' : 'ยังไม่ถูก ไปต่อกันเลย!'}
                </p>
              ) : (
                <div className="space-y-2">
                  {quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => answerQuiz(idx)}
                      className="w-full rounded-lg py-2.5 text-sm border"
                      style={{ borderColor: 'var(--color-surface-3)', background: 'var(--color-surface-2)' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => move(-1)}
          className="flex-1 rounded-lg py-3 text-xl border border-[var(--color-surface-3)]"
          style={{ background: 'var(--color-surface-2)' }}
          aria-label="เลนบน"
        >
          ▲
        </button>
        <button
          onClick={() => move(1)}
          className="flex-1 rounded-lg py-3 text-xl border border-[var(--color-surface-3)]"
          style={{ background: 'var(--color-surface-2)' }}
          aria-label="เลนล่าง"
        >
          ▼
        </button>
      </div>
    </div>
  )
}
