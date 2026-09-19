import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { Mascot } from '../components/Mascot'
import { ASSESSMENT_QUESTIONS, SKILL_LABEL } from '../data/assessmentContent'
import { useStudent } from '../context/StudentContext'
import { shuffleOptions } from '../lib/shuffle'
import type { AssessmentSkill } from '../types'

const OPTION_COLORS = ['#5EEAD4', '#F4B942', '#8FD694', '#38BDF8']

export default function Assessment() {
  const { type } = useParams<{ type: 'pre' | 'post' }>()
  const navigate = useNavigate()
  const { recordAssessment } = useStudent()
  const isPost = type === 'post'

  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [done, setDone] = useState(false)

  const q = ASSESSMENT_QUESTIONS[index]
  const isLast = index === ASSESSMENT_QUESTIONS.length - 1
  const { options: shuffledOptions, correctIndex: shuffledCorrectIndex } = useMemo(() => shuffleOptions(q.options, q.correctIndex), [q.id])

  const handleConfirm = () => {
    if (selected === null || confirmed) return
    setConfirmed(true)
    setResults((prev) => ({ ...prev, [q.id]: selected === shuffledCorrectIndex }))
  }

  const handleNext = () => {
    if (isLast) {
      const scoreBySkill = {} as Record<AssessmentSkill, { correct: number; total: number }>
      for (const question of ASSESSMENT_QUESTIONS) {
        if (!scoreBySkill[question.skill]) scoreBySkill[question.skill] = { correct: 0, total: 0 }
        scoreBySkill[question.skill].total += 1
        if (results[question.id]) scoreBySkill[question.skill].correct += 1
      }
      recordAssessment(isPost ? 'post' : 'pre', scoreBySkill)
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setConfirmed(false)
    }
  }

  const totalCorrect = Object.values(results).filter(Boolean).length

  return (
    <div className="min-h-screen eco-grid-bg pb-16 relative">
      <AmbientBackground />
      <header className="border-b border-[var(--color-surface-2)] relative z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/world')} className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] text-sm">
            ← Green City
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-5">
          <p className="text-xs tracking-wide text-[var(--color-mint)]">{isPost ? 'POST-ASSESSMENT' : 'PRE-ASSESSMENT'}</p>
          <h1 className="font-display text-2xl font-semibold mt-1">
            {isPost ? 'แบบประเมินหลังเรียน' : 'แบบประเมินก่อนเรียน'}
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 relative z-10">
        {!started && (
          <div className="space-y-5">
            <Mascot
              mood="idle"
              message={
                isPost
                  ? 'มาดูกันว่าหลังจากผจญภัยมาทั้งหมด ทักษะของเธอพัฒนาไปแค่ไหนแล้ว!'
                  : 'ก่อนเริ่มผจญภัย มาวัดพื้นฐานทักษะของเธอกันก่อนนะ คำถามนี้ไม่มีผลต่อคะแนนภารกิจ ตอบตามที่รู้จริงได้เลย'
              }
            />
            <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
              <p className="text-sm text-[var(--color-ink-dim)]">
                {ASSESSMENT_QUESTIONS.length} ข้อ ครอบคลุม 4 ด้าน: Computational Thinking, Algorithm, Coding, Problem Solving
              </p>
            </div>
            <button
              onClick={() => setStarted(true)}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
              style={{ background: 'var(--color-mint)' }}
            >
              เริ่มทำแบบประเมิน
            </button>
          </div>
        )}

        {started && !done && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[var(--color-ink-dim)]">
              <span>
                ข้อที่ {index + 1} / {ASSESSMENT_QUESTIONS.length}
              </span>
              <span className="text-[var(--color-mint)]">{SKILL_LABEL[q.skill]}</span>
            </div>
            <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
              <p className="text-sm font-medium">{q.prompt}</p>
            </div>
            <div className="space-y-2.5">
              {shuffledOptions.map((opt, idx) => {
                const color = OPTION_COLORS[idx % OPTION_COLORS.length]
                const isChosenCorrect = confirmed && idx === shuffledCorrectIndex
                const isPicked = selected === idx
                return (
                  <button
                    key={idx}
                    onClick={() => !confirmed && setSelected(idx)}
                    disabled={confirmed}
                    className="w-full text-left rounded-xl py-2.5 px-3.5 text-sm border disabled:cursor-default flex items-center gap-2.5"
                    style={{
                      borderColor: isChosenCorrect ? 'var(--color-mint)' : isPicked ? 'var(--color-gold)' : 'var(--color-surface-3)',
                      background: 'var(--color-surface-2)',
                    }}
                  >
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                      style={{ background: `${color}22`, border: `1.5px solid ${color}` }}
                    >
                      {idx + 1}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {!confirmed ? (
              <button
                onClick={handleConfirm}
                disabled={selected === null}
                className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
                style={{ background: 'var(--color-mint)' }}
              >
                ยืนยันคำตอบ
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
                style={{ background: 'var(--color-mint)' }}
              >
                {isLast ? 'ดูผลลัพธ์' : 'ถัดไป →'}
              </button>
            )}
          </div>
        )}

        {done && (
          <div className="text-center space-y-5 py-8">
            <div className="text-5xl">📊</div>
            <p className="font-display text-2xl font-semibold">
              ตอบถูก {totalCorrect} / {ASSESSMENT_QUESTIONS.length}
            </p>
            <p className="text-sm text-[var(--color-ink-dim)]">
              {isPost ? 'บันทึกผลประเมินหลังเรียนแล้ว ไปดูพัฒนาการของเธอได้ที่ Green City' : 'บันทึกผลประเมินก่อนเรียนแล้ว พร้อมเริ่มผจญภัย!'}
            </p>
            <button
              onClick={() => navigate('/world')}
              className="rounded-lg px-6 py-3 font-display font-medium text-[var(--color-bg-deep)]"
              style={{ background: 'var(--color-mint)' }}
            >
              กลับสู่ Green City
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
