import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MissionShell } from '../components/MissionShell'
import { ReflectionForm, type ReflectionAnswers } from '../components/ReflectionForm'
import { OrderingActivity } from '../components/OrderingActivity'
import { Mascot } from '../components/Mascot'
import { WhackATrashGame } from '../components/WhackATrashGame'
import { MISSIONS } from '../data/missions'
import {
  ABSTRACTION_QUESTIONS,
  ALGORITHM_ORDER_SCENARIO,
  DECOMPOSITION_SCENARIO,
  PATTERN_QUESTIONS,
} from '../data/mission2Content'
import { useStudent } from '../context/StudentContext'
import { shuffleOptions } from '../lib/shuffle'

const mission = MISSIONS.find((m) => m.id === 'm2')!
const OPTION_COLORS = ['#5EEAD4', '#F4B942', '#8FD694', '#38BDF8']
const OPTION_ICONS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣']

type Stage = 'intro' | 'decomposition' | 'bonus1' | 'pattern' | 'bonus2' | 'abstraction' | 'bonus3' | 'algorithm' | 'reflect' | 'done'

export default function Mission2ThinkBeforeCode() {
  const navigate = useNavigate()
  const { recordMissionResult } = useStudent()
  const [stage, setStage] = useState<Stage>('intro')
  const [startedAt] = useState(() => Date.now())
  const [errorTypes, setErrorTypes] = useState<string[]>([])

  const [decompFraction, setDecompFraction] = useState<number | null>(null)
  const [patternIndex, setPatternIndex] = useState(0)
  const [patternCorrect, setPatternCorrect] = useState(0)
  const [patternSelected, setPatternSelected] = useState<number | null>(null)
  const [patternFeedback, setPatternFeedback] = useState<{ correct: boolean; text: string } | null>(null)
  const [abstractionCorrect, setAbstractionCorrect] = useState(0)
  const [abstractionSelected, setAbstractionSelected] = useState<number | null>(null)
  const [abstractionFeedback, setAbstractionFeedback] = useState<{ correct: boolean; text: string } | null>(null)
  const [algoFraction, setAlgoFraction] = useState<number | null>(null)
  const [finalScore, setFinalScore] = useState(0)
  const [bonusTotal, setBonusTotal] = useState(0)

  const patternQ = PATTERN_QUESTIONS[patternIndex]
  const abstractionQ = ABSTRACTION_QUESTIONS[0]
  const { options: shuffledPatternOptions, correctIndex: shuffledPatternCorrectIndex } = useMemo(
    () => shuffleOptions(patternQ.options, patternQ.correctIndex),
    [patternQ.id]
  )
  const { options: shuffledAbstractionOptions, correctIndex: shuffledAbstractionCorrectIndex } = useMemo(
    () => shuffleOptions(abstractionQ.options, abstractionQ.correctIndex),
    [abstractionQ.id]
  )

  const handlePatternAnswer = () => {
    if (patternFeedback || patternSelected === null) return
    const correct = patternSelected === shuffledPatternCorrectIndex
    if (correct) setPatternCorrect((c) => c + 1)
    else setErrorTypes((prev) => [...prev, `Pattern: ${patternQ.prompt} — ${patternQ.explain}`])
    setPatternFeedback({ correct, text: patternQ.explain })
  }

  const nextPattern = () => {
    setPatternFeedback(null)
    setPatternSelected(null)
    if (patternIndex + 1 < PATTERN_QUESTIONS.length) setPatternIndex((i) => i + 1)
    else setStage('bonus2')
  }

  const handleAbstractionAnswer = () => {
    if (abstractionFeedback || abstractionSelected === null) return
    const correct = abstractionSelected === shuffledAbstractionCorrectIndex
    if (correct) setAbstractionCorrect(1)
    else setErrorTypes((prev) => [...prev, `Abstraction: ${abstractionQ.explain}`])
    setAbstractionFeedback({ correct, text: abstractionQ.explain })
  }

  const finishAll = (algoF: number) => {
    const decompScore = (decompFraction ?? 0) * 30
    const patternScore = (patternCorrect / PATTERN_QUESTIONS.length) * 20
    const abstractionScore = abstractionCorrect * 10
    const algoScore = algoF * 40
    const score = Math.round(decompScore + patternScore + abstractionScore + algoScore)
    setFinalScore(score)
    setStage('reflect')
  }

  const handleReflectionSubmit = (answers: ReflectionAnswers) => {
    const timeSeconds = Math.round((Date.now() - startedAt) / 1000)
    const totalSteps = DECOMPOSITION_SCENARIO.steps.length + ALGORITHM_ORDER_SCENARIO.steps.length + PATTERN_QUESTIONS.length + 1
    const correctApprox = Math.round(
      (decompFraction ?? 0) * DECOMPOSITION_SCENARIO.steps.length +
        patternCorrect +
        abstractionCorrect +
        (algoFraction ?? 0) * ALGORITHM_ORDER_SCENARIO.steps.length
    )
    recordMissionResult(
      'm2',
      {
        score: finalScore,
        maxScore: 100,
        correctCount: correctApprox,
        wrongCount: totalSteps - correctApprox,
        errorTypes,
        timeSeconds,
      },
      answers
    )
    setStage('done')
  }

  return (
    <MissionShell mission={mission}>
      {stage === 'intro' && (
        <div className="space-y-5">
          <Mascot mood="idle" message="สวัสดี! ฉันชื่อน้องกรีน 🌱 มาช่วยกันคิดให้เป็นระบบก่อนเริ่มเขียนโค้ดกันเถอะ!" />
          <p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">{mission.storyIntro}</p>
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="text-sm font-medium mb-1">เป้าหมายการเรียนรู้</p>
            <p className="text-sm text-[var(--color-ink-dim)]">{mission.learningGoal}</p>
          </div>
          <button
            onClick={() => setStage('decomposition')}
            className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
            style={{ background: 'var(--color-mint)' }}
          >
            เริ่มคิดก่อนโค้ด
          </button>
        </div>
      )}

      {stage === 'decomposition' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-mint)]">1 · Decomposition — แตกปัญหาใหญ่เป็นขั้นตอนย่อย</p>
          <OrderingActivity
            goal={DECOMPOSITION_SCENARIO.goal}
            steps={DECOMPOSITION_SCENARIO.steps}
            onChecked={(f) => setDecompFraction(f)}
          />
          {decompFraction !== null && (
            <button
              onClick={() => setStage('bonus1')}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
              style={{ background: 'var(--color-mint)' }}
            >
              ถัดไป → Pattern Recognition
            </button>
          )}
        </div>
      )}

      {stage === 'bonus1' && (
        <WhackATrashGame
          onComplete={(bonus) => {
            setBonusTotal((t) => t + bonus)
            setStage('pattern')
          }}
        />
      )}

      {stage === 'pattern' && patternQ && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-mint)]">
            2 · Pattern Recognition — ข้อ {patternIndex + 1} / {PATTERN_QUESTIONS.length}
          </p>
          <Mascot
            mood={!patternFeedback ? 'idle' : patternFeedback.correct ? 'great' : 'okay'}
            message={!patternFeedback ? 'สังเกตรูปแบบให้ดีนะ แล้วทายว่าช่องต่อไปคืออะไร!' : patternFeedback.text}
          />
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)] space-y-3">
            <p className="text-sm font-medium">{patternQ.prompt}</p>
            <div className="flex flex-wrap gap-2">
              {patternQ.sequence.map((s, i) => {
                const isLast = i === patternQ.sequence.length - 1
                const color = isLast ? 'var(--color-gold)' : OPTION_COLORS[i % OPTION_COLORS.length]
                return (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ background: `${color}22`, border: `1.5px solid ${color}`, color: isLast ? 'var(--color-gold)' : 'var(--color-ink)' }}
                  >
                    {s}
                  </span>
                )
              })}
            </div>
          </div>
          <div className="space-y-2.5">
            {shuffledPatternOptions.map((opt, idx) => {
              const color = OPTION_COLORS[idx % OPTION_COLORS.length]
              const isChosenCorrect = patternFeedback && idx === shuffledPatternCorrectIndex
              const isPicked = patternSelected === idx
              return (
                <button
                  key={idx}
                  onClick={() => !patternFeedback && setPatternSelected(idx)}
                  disabled={!!patternFeedback}
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
                    {OPTION_ICONS[idx]}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
          {!patternFeedback ? (
            <button
              onClick={handlePatternAnswer}
              disabled={patternSelected === null}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
              style={{ background: 'var(--color-mint)' }}
            >
              ยืนยันคำตอบ
            </button>
          ) : (
            <button
              onClick={nextPattern}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
              style={{ background: 'var(--color-mint)' }}
            >
              ถัดไป →
            </button>
          )}
        </div>
      )}

      {stage === 'bonus2' && (
        <WhackATrashGame
          onComplete={(bonus) => {
            setBonusTotal((t) => t + bonus)
            setStage('abstraction')
          }}
        />
      )}

      {stage === 'abstraction' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-mint)]">3 · Abstraction — เลือกเฉพาะข้อมูลที่จำเป็น</p>
          <Mascot
            mood={!abstractionFeedback ? 'idle' : abstractionFeedback.correct ? 'great' : 'okay'}
            message={!abstractionFeedback ? 'ตัดรายละเอียดที่ไม่จำเป็นออกไปนะ เลือกเฉพาะสิ่งที่สำคัญจริงๆ!' : abstractionFeedback.text}
          />
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="text-sm font-medium">{abstractionQ.prompt}</p>
          </div>
          <div className="space-y-2.5">
            {shuffledAbstractionOptions.map((opt, idx) => {
              const color = OPTION_COLORS[idx % OPTION_COLORS.length]
              const isChosenCorrect = abstractionFeedback && idx === shuffledAbstractionCorrectIndex
              const isPicked = abstractionSelected === idx
              return (
                <button
                  key={idx}
                  onClick={() => !abstractionFeedback && setAbstractionSelected(idx)}
                  disabled={!!abstractionFeedback}
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
                    {OPTION_ICONS[idx]}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
          {!abstractionFeedback ? (
            <button
              onClick={handleAbstractionAnswer}
              disabled={abstractionSelected === null}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
              style={{ background: 'var(--color-mint)' }}
            >
              ยืนยันคำตอบ
            </button>
          ) : (
            <button
              onClick={() => setStage('bonus3')}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
              style={{ background: 'var(--color-mint)' }}
            >
              ถัดไป → Algorithmic Thinking
            </button>
          )}
        </div>
      )}

      {stage === 'bonus3' && (
        <WhackATrashGame
          onComplete={(bonus) => {
            setBonusTotal((t) => t + bonus)
            setStage('algorithm')
          }}
        />
      )}

      {stage === 'algorithm' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-mint)]">4 · Algorithmic Thinking — จัดลำดับการตัดสินใจ</p>
          <OrderingActivity
            goal={ALGORITHM_ORDER_SCENARIO.goal}
            steps={ALGORITHM_ORDER_SCENARIO.steps}
            onChecked={(f) => {
              setAlgoFraction(f)
              finishAll(f)
            }}
          />
        </div>
      )}

      {stage === 'reflect' && <ReflectionForm onSubmit={handleReflectionSubmit} />}

      {stage === 'done' && (
        <div className="text-center space-y-5 py-8">
          <div className="text-5xl">{finalScore / 100 >= 0.6 ? '🏅' : '🌱'}</div>
          <p className="font-display text-2xl font-semibold">คะแนน {finalScore} / 100</p>
          <p className="text-sm text-[var(--color-ink-dim)]">
            {finalScore / 100 >= 0.6 ? 'ภารกิจสำเร็จ! ปลดล็อกด่านถัดไปแล้ว' : 'ยังไม่ผ่านเกณฑ์ ลองใหม่อีกครั้งได้เลย'}
          </p>
          {bonusTotal > 0 && (
            <p className="text-xs" style={{ color: 'var(--color-gold)' }}>
              🔨 เก็บคะแนนโบนัสจากรอบตีตุ่มขยะได้ {bonusTotal} แต้ม!
            </p>
          )}
          <button
            onClick={() => navigate('/world')}
            className="rounded-lg px-6 py-3 font-display font-medium text-[var(--color-bg-deep)]"
            style={{ background: 'var(--color-mint)' }}
          >
            กลับสู่ Green City
          </button>
        </div>
      )}
    </MissionShell>
  )
}
