import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MissionShell } from '../components/MissionShell'
import { ReflectionForm, type ReflectionAnswers } from '../components/ReflectionForm'
import { GreenCollectorGame, type CollectorResult } from '../components/GreenCollectorGame'
import { MISSIONS } from '../data/missions'
import { ANALYSIS_QUESTIONS, WASTE_ITEMS, WEEKLY_DATA } from '../data/mission1Content'
import { useStudent } from '../context/StudentContext'
import { shuffleOptions } from '../lib/shuffle'

const mission = MISSIONS.find((m) => m.id === 'm1')!

type Stage = 'intro' | 'collect' | 'analysis' | 'reflect' | 'done'

export default function Mission1GreenDetective() {
  const navigate = useNavigate()
  const { recordMissionResult } = useStudent()
  const [stage, setStage] = useState<Stage>('intro')

  const [gameResult, setGameResult] = useState<CollectorResult | null>(null)

  const [analysisIndex, setAnalysisIndex] = useState(0)
  const [analysisCorrect, setAnalysisCorrect] = useState(0)
  const [analysisSelected, setAnalysisSelected] = useState<number | null>(null)
  const [analysisFeedback, setAnalysisFeedback] = useState<{ correct: boolean; text: string } | null>(null)

  const [finalScore, setFinalScore] = useState(0)

  const currentQ = ANALYSIS_QUESTIONS[analysisIndex]
  const { options: shuffledOptions, correctIndex: shuffledCorrectIndex } = useMemo(
    () => shuffleOptions(currentQ.options, currentQ.correctIndex),
    [currentQ.id]
  )

  const maxBar = useMemo(() => Math.max(...WEEKLY_DATA.map((d) => d.count)), [])

  const handleGameComplete = (result: CollectorResult) => {
    setGameResult(result)
    setStage('analysis')
  }

  const handleAnalysisAnswer = () => {
    if (analysisFeedback || analysisSelected === null) return
    const correct = analysisSelected === shuffledCorrectIndex
    if (correct) setAnalysisCorrect((c) => c + 1)
    setAnalysisFeedback({ correct, text: correct ? 'วิเคราะห์ถูกต้อง!' : 'ลองทบทวนข้อมูลอีกครั้ง' })
  }

  const nextAnalysis = () => {
    setAnalysisFeedback(null)
    setAnalysisSelected(null)
    if (analysisIndex + 1 < ANALYSIS_QUESTIONS.length) {
      setAnalysisIndex((i) => i + 1)
    } else {
      const classifyCorrect = gameResult?.correctCount ?? 0
      const score = Math.round((classifyCorrect / WASTE_ITEMS.length) * 50 + (analysisCorrect / ANALYSIS_QUESTIONS.length) * 50)
      setFinalScore(score)
      setStage('reflect')
    }
  }

  const handleReflectionSubmit = (answers: ReflectionAnswers) => {
    const classifyCorrect = gameResult?.correctCount ?? 0
    const classifyWrong = gameResult?.wrongCount ?? 0
    const timeSeconds = (gameResult?.timeSeconds ?? 0)
    recordMissionResult(
      'm1',
      {
        score: finalScore,
        maxScore: 100,
        correctCount: classifyCorrect + analysisCorrect,
        wrongCount: classifyWrong + (ANALYSIS_QUESTIONS.length - analysisCorrect),
        errorTypes: gameResult?.errorTypes ?? [],
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
          <p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">{mission.storyIntro}</p>
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="text-sm font-medium mb-1">เป้าหมายการเรียนรู้</p>
            <p className="text-sm text-[var(--color-ink-dim)]">{mission.learningGoal}</p>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="text-sm font-medium mb-1">🚛 ขับรถเก็บขยะ</p>
            <p className="text-sm text-[var(--color-ink-dim)]">
              เปลี่ยนเลนไปทิ้งขยะแต่ละชิ้นให้ถูกถัง แล้วหลบสิ่งกีดขวางที่พุ่งเข้ามา ทำคอมโบต่อเนื่องเพื่อคะแนนโบนัส!
            </p>
          </div>
          <button
            onClick={() => setStage('collect')}
            className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
            style={{ background: 'var(--color-mint)' }}
          >
            เริ่มขับรถ
          </button>
        </div>
      )}

      {stage === 'collect' && <GreenCollectorGame onComplete={handleGameComplete} />}

      {stage === 'analysis' && currentQ && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--color-ink-dim)]">
            นี่คือข้อมูลขยะที่นักสืบเก็บได้ตลอด 1 สัปดาห์ วิเคราะห์ให้ดีก่อนตอบ
          </p>
          <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-surface-3)] space-y-3">
            {WEEKLY_DATA.map((d) => (
              <div key={d.category} className="flex items-center gap-3">
                <span className="text-xs w-24 shrink-0 text-[var(--color-ink-dim)]">{d.category}</span>
                <div className="flex-1 h-5 rounded bg-[var(--color-surface-2)] overflow-hidden">
                  <div
                    className="h-full rounded"
                    style={{ width: `${(d.count / maxBar) * 100}%`, background: 'var(--color-gold)' }}
                  />
                </div>
                <span className="text-xs w-8 text-right">{d.count}</span>
              </div>
            ))}
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="text-xs text-[var(--color-mint)] mb-1">
              คำถามที่ {analysisIndex + 1} / {ANALYSIS_QUESTIONS.length}
            </p>
            <p className="text-sm font-medium">{currentQ.prompt}</p>
          </div>
          <div className="space-y-2.5">
            {shuffledOptions.map((opt, idx) => {
              const isChosenCorrect = analysisFeedback && idx === shuffledCorrectIndex
              const isPicked = analysisSelected === idx
              return (
                <button
                  key={idx}
                  onClick={() => !analysisFeedback && setAnalysisSelected(idx)}
                  disabled={!!analysisFeedback}
                  className="w-full text-left rounded-lg py-2.5 px-3.5 text-sm border disabled:cursor-default"
                  style={{
                    borderColor: isChosenCorrect ? 'var(--color-mint)' : isPicked ? 'var(--color-gold)' : 'var(--color-surface-3)',
                    background: 'var(--color-surface-2)',
                  }}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {!analysisFeedback && (
            <button
              onClick={handleAnalysisAnswer}
              disabled={analysisSelected === null}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
              style={{ background: 'var(--color-mint)' }}
            >
              ยืนยันคำตอบ
            </button>
          )}
          {analysisFeedback && (
            <div
              className="rounded-lg p-3.5 text-sm space-y-2"
              style={{
                background: analysisFeedback.correct ? 'rgba(94,234,212,0.12)' : 'rgba(242,118,92,0.12)',
                color: analysisFeedback.correct ? 'var(--color-mint)' : 'var(--color-coral)',
              }}
            >
              <p>{analysisFeedback.text}</p>
              <button
                onClick={nextAnalysis}
                className="w-full rounded-lg py-2.5 font-display font-medium text-[var(--color-bg-deep)]"
                style={{ background: 'var(--color-mint)' }}
              >
                ถัดไป →
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
