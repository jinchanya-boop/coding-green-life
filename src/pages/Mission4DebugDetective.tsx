import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MissionShell } from '../components/MissionShell'
import { ReflectionForm, type ReflectionAnswers } from '../components/ReflectionForm'
import { DialogueScene, type DialogueLine } from '../components/DialogueScene'
import { BugHuntGame } from '../components/BugHuntGame'
import { BonusRaceGame } from '../components/BonusRaceGame'
import { MISSIONS } from '../data/missions'
import { DEBUG_SCENARIOS } from '../data/mission4Content'
import { useStudent } from '../context/StudentContext'

const mission = MISSIONS.find((m) => m.id === 'm4')!

const INTRO_DIALOGUE: DialogueLine[] = [
  { speaker: 'ระบบเตือนภัย', variant: 'alert', text: 'แจ้งเตือน! ตรวจพบพฤติกรรมผิดปกติในระบบคำนวณของเมือง!', color: '#F87171' },
  { speaker: 'น้องกรีน', variant: 'green', text: 'ไม่ต้องตกใจไป! ภารกิจนี้ต้องใช้นักสืบบั๊กมือฉมัง นั่นก็คือเธอไงล่ะ!' },
  { speaker: 'น้องกรีน', variant: 'green', text: 'ก่อนไปจับบั๊กในโค้ด มาวอร์มร่างกายด้วยการจับบั๊กตัวจริงกันก่อนดีกว่า!' },
]

type Step = 'read' | 'findBug' | 'fix' | 'result'
type Stage = 'intro' | 'warmup' | 'round' | 'reflect' | 'done'

export default function Mission4DebugDetective() {
  const navigate = useNavigate()
  const { recordMissionResult } = useStudent()
  const [stage, setStage] = useState<Stage>('intro')
  const [startedAt] = useState(() => Date.now())
  const [roundIndex, setRoundIndex] = useState(0)
  const [step, setStep] = useState<Step>('read')
  const [bugChoice, setBugChoice] = useState<number | null>(null)
  const [fixChoice, setFixChoice] = useState<number | null>(null)
  const [bugWrongFlash, setBugWrongFlash] = useState<number | null>(null)
  const [fixWrongFlash, setFixWrongFlash] = useState<number | null>(null)
  const [bugTries, setBugTries] = useState(0)
  const [fixTries, setFixTries] = useState(0)
  const [roundScores, setRoundScores] = useState<number[]>([])
  const [errorTypes, setErrorTypes] = useState<string[]>([])
  const [finalScore, setFinalScore] = useState(0)

  const scenario = DEBUG_SCENARIOS[roundIndex]

  const handleBugChoice = (idx: number) => {
    if (bugChoice !== null) return
    setBugTries((t) => t + 1)
    if (idx === scenario.correctBugIndex) {
      setBugChoice(idx)
      setTimeout(() => setStep('fix'), 600)
    } else {
      setErrorTypes((prev) => [...prev, `${scenario.title}: เลือกประเภทบั๊กผิด — "${scenario.bugOptions[idx]}"`])
      setBugWrongFlash(idx)
      setTimeout(() => setBugWrongFlash(null), 700)
    }
  }

  const handleFixChoice = (idx: number) => {
    if (fixChoice !== null) return
    setFixTries((t) => t + 1)
    if (idx === scenario.correctFixIndex) {
      setFixChoice(idx)
      const roundScore = Math.max(20, 100 - (bugTries + fixTries) * 15)
      setRoundScores((prev) => [...prev, roundScore])
      setTimeout(() => setStep('result'), 300)
    } else {
      setErrorTypes((prev) => [...prev, `${scenario.title}: เลือกวิธีแก้ผิด — "${scenario.fixOptions[idx]}"`])
      setFixWrongFlash(idx)
      setTimeout(() => setFixWrongFlash(null), 700)
    }
  }

  const nextRound = () => {
    if (roundIndex + 1 < DEBUG_SCENARIOS.length) {
      setRoundIndex((i) => i + 1)
      setStep('read')
      setBugChoice(null)
      setFixChoice(null)
      setBugTries(0)
      setFixTries(0)
      setBugWrongFlash(null)
      setFixWrongFlash(null)
      setStage('warmup')
    } else {
      const avg = Math.round(roundScores.reduce((a, b) => a + b, 0) / roundScores.length)
      setFinalScore(avg)
      setStage('reflect')
    }
  }

  const handleReflectionSubmit = (answers: ReflectionAnswers) => {
    const timeSeconds = Math.round((Date.now() - startedAt) / 1000)
    recordMissionResult(
      'm4',
      {
        score: finalScore,
        maxScore: 100,
        correctCount: DEBUG_SCENARIOS.length,
        wrongCount: errorTypes.length,
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
        <DialogueScene lines={INTRO_DIALOGUE} onDone={() => setStage('warmup')} buttonLabel="ไปวอร์มร่างกาย!" />
      )}

      {stage === 'warmup' &&
        (roundIndex === 1 ? (
          <BonusRaceGame onComplete={() => setStage('round')} />
        ) : (
          <BugHuntGame onComplete={() => setStage('round')} />
        ))}

      {stage === 'round' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-mint)]">
            คดีที่ {roundIndex + 1} / {DEBUG_SCENARIOS.length} · {scenario.title}
          </p>

          <div className="bg-[var(--color-surface-2)] rounded-xl p-4 border border-[var(--color-surface-3)] font-mono text-xs leading-relaxed">
            {scenario.code.map((line, i) => (
              <div key={i} className="text-[var(--color-ink-dim)]">
                <span className="text-[var(--color-ink-faint)] mr-2">{i + 1}</span>
                {line}
              </div>
            ))}
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="text-xs text-[var(--color-coral)] mb-1">อาการที่พบ</p>
            <p className="text-sm">{scenario.symptom}</p>
          </div>

          {step === 'read' && (
            <button
              onClick={() => setStep('findBug')}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
              style={{ background: 'var(--color-mint)' }}
            >
              เริ่มวิเคราะห์บั๊ก
            </button>
          )}

          {step === 'findBug' && (
            <div className="space-y-2.5">
              <p className="text-sm font-medium">สาเหตุของบั๊กคืออะไร?</p>
              {scenario.bugOptions.map((opt, idx) => {
                const isChosenCorrect = bugChoice === idx
                const isWrongFlash = bugWrongFlash === idx
                return (
                  <button
                    key={idx}
                    onClick={() => handleBugChoice(idx)}
                    disabled={bugChoice !== null}
                    className="w-full text-left rounded-lg py-2.5 px-3.5 text-sm border disabled:cursor-default transition-colors"
                    style={{
                      borderColor: isChosenCorrect ? 'var(--color-mint)' : isWrongFlash ? 'var(--color-coral)' : 'var(--color-surface-3)',
                      background: isWrongFlash ? 'rgba(242,118,92,0.12)' : 'var(--color-surface-2)',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
              {bugWrongFlash !== null && (
                <p className="text-xs text-[var(--color-coral)]">ยังไม่ใช่ ลองข้ออื่นดูนะ</p>
              )}
            </div>
          )}

          {step === 'fix' && (
            <div className="space-y-2.5">
              <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(94,234,212,0.1)', color: 'var(--color-mint)' }}>
                วิเคราะห์ถูกต้อง! ตอนนี้เลือกวิธีแก้ที่เหมาะสม
              </div>
              <p className="text-sm font-medium">ควรแก้โค้ดอย่างไร?</p>
              {scenario.fixOptions.map((opt, idx) => {
                const isChosenCorrect = fixChoice === idx
                const isWrongFlash = fixWrongFlash === idx
                return (
                  <button
                    key={idx}
                    onClick={() => handleFixChoice(idx)}
                    disabled={fixChoice !== null}
                    className="w-full text-left rounded-lg py-2.5 px-3.5 text-sm border font-mono disabled:cursor-default transition-colors"
                    style={{
                      borderColor: isChosenCorrect ? 'var(--color-mint)' : isWrongFlash ? 'var(--color-coral)' : 'var(--color-surface-3)',
                      background: isWrongFlash ? 'rgba(242,118,92,0.12)' : 'var(--color-surface-2)',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
              {fixWrongFlash !== null && (
                <p className="text-xs text-[var(--color-coral)]">ยังไม่ใช่ ลองข้ออื่นดูนะ</p>
              )}
            </div>
          )}

          {step === 'result' && (
            <div className="rounded-lg p-4 text-sm space-y-2" style={{ background: 'rgba(94,234,212,0.1)' }}>
              <p style={{ color: 'var(--color-mint)' }}>แก้บั๊กสำเร็จ! RUN ผ่านแล้ว ✅</p>
              <p className="text-[var(--color-ink-dim)]">{scenario.explain}</p>
              <button onClick={nextRound} className="mt-1 underline text-[var(--color-ink)]">
                {roundIndex + 1 < DEBUG_SCENARIOS.length ? 'คดีถัดไป →' : 'ไปสรุปผล →'}
              </button>
            </div>
          )}
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
