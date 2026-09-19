import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MissionShell } from '../components/MissionShell'
import { ReflectionForm, type ReflectionAnswers } from '../components/ReflectionForm'
import { Mascot } from '../components/Mascot'
import { GreenSorterGame, type SorterResult } from '../components/GreenSorterGame'
import { MISSIONS } from '../data/missions'
import { ALGO_CHECK_QUESTIONS } from '../data/mission5Content'
import { useStudent } from '../context/StudentContext'
import { shuffleOptions } from '../lib/shuffle'

const mission = MISSIONS.find((m) => m.id === 'm5')!
const OPTION_COLORS = ['#5EEAD4', '#F4B942', '#8FD694', '#38BDF8']

type Stage = 'intro' | 'sort' | 'algoCheck' | 'reflect' | 'done'

export default function Mission5GreenSorter() {
  const navigate = useNavigate()
  const { recordMissionResult } = useStudent()
  const [stage, setStage] = useState<Stage>('intro')
  const [sortResult, setSortResult] = useState<SorterResult | null>(null)
  const [checkIndex, setCheckIndex] = useState(0)
  const [checkCorrect, setCheckCorrect] = useState(0)
  const [checkSelected, setCheckSelected] = useState<number | null>(null)
  const [checkFeedback, setCheckFeedback] = useState<{ correct: boolean; text: string } | null>(null)
  const [finalScore, setFinalScore] = useState(0)

  const checkQ = ALGO_CHECK_QUESTIONS[checkIndex]
  const { options: shuffledCheckOptions, correctIndex: shuffledCheckCorrectIndex } = useMemo(
    () => shuffleOptions(checkQ.options, checkQ.correctIndex),
    [checkQ.id]
  )

  const handleSortComplete = (result: SorterResult) => {
    setSortResult(result)
    setStage('algoCheck')
  }

  const handleCheckAnswer = () => {
    if (checkFeedback || checkSelected === null) return
    const correct = checkSelected === shuffledCheckCorrectIndex
    if (correct) setCheckCorrect((c) => c + 1)
    setCheckFeedback({ correct, text: checkQ.explain })
  }

  const nextCheck = () => {
    setCheckFeedback(null)
    setCheckSelected(null)
    if (checkIndex + 1 < ALGO_CHECK_QUESTIONS.length) {
      setCheckIndex((i) => i + 1)
    } else {
      const total = (sortResult?.correctCount ?? 0) + (sortResult?.wrongCount ?? 0)
      const accuracy = total > 0 ? (sortResult?.correctCount ?? 0) / total : 0
      const score = Math.round(accuracy * 60 + (checkCorrect / ALGO_CHECK_QUESTIONS.length) * 40)
      setFinalScore(score)
      setStage('reflect')
    }
  }

  const handleReflectionSubmit = (answers: ReflectionAnswers) => {
    recordMissionResult(
      'm5',
      {
        score: finalScore,
        maxScore: 100,
        correctCount: (sortResult?.correctCount ?? 0) + checkCorrect,
        wrongCount: (sortResult?.wrongCount ?? 0) + (ALGO_CHECK_QUESTIONS.length - checkCorrect),
        errorTypes: sortResult?.errorTypes ?? [],
        timeSeconds: sortResult?.timeSeconds ?? 0,
      },
      answers
    )
    setStage('done')
  }

  return (
    <MissionShell mission={mission}>
      {stage === 'intro' && (
        <div className="space-y-5">
          <Mascot mood="idle" message="รอบนี้ต้องไวและแม่นด้วยนะ! ยิ่งตอบถูกต่อกันยิ่งได้คอมโบโบนัส 🔥" />
          <p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">{mission.storyIntro}</p>
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="text-sm font-medium mb-1">เป้าหมายการเรียนรู้</p>
            <p className="text-sm text-[var(--color-ink-dim)]">{mission.learningGoal}</p>
          </div>
          <button
            onClick={() => setStage('sort')}
            className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
            style={{ background: 'var(--color-mint)' }}
          >
            เริ่มคัดแยกขยะ!
          </button>
        </div>
      )}

      {stage === 'sort' && <GreenSorterGame onComplete={handleSortComplete} />}

      {stage === 'algoCheck' && checkQ && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-mint)]">
            วิเคราะห์เกม · ข้อ {checkIndex + 1} / {ALGO_CHECK_QUESTIONS.length}
          </p>
          <Mascot
            mood={!checkFeedback ? 'idle' : checkFeedback.correct ? 'great' : 'okay'}
            message={!checkFeedback ? 'ลองคิดย้อนดูว่าเกมที่เพิ่งเล่นทำงานยังไง!' : checkFeedback.text}
          />
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="text-sm font-medium">{checkQ.prompt}</p>
          </div>
          <div className="space-y-2.5">
            {shuffledCheckOptions.map((opt, idx) => {
              const color = OPTION_COLORS[idx % OPTION_COLORS.length]
              const isChosenCorrect = checkFeedback && idx === shuffledCheckCorrectIndex
              const isPicked = checkSelected === idx
              return (
                <button
                  key={idx}
                  onClick={() => !checkFeedback && setCheckSelected(idx)}
                  disabled={!!checkFeedback}
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
          {!checkFeedback ? (
            <button
              onClick={handleCheckAnswer}
              disabled={checkSelected === null}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
              style={{ background: 'var(--color-mint)' }}
            >
              ยืนยันคำตอบ
            </button>
          ) : (
            <button
              onClick={nextCheck}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
              style={{ background: 'var(--color-mint)' }}
            >
              ถัดไป →
            </button>
          )}
        </div>
      )}

      {stage === 'reflect' && <ReflectionForm onSubmit={handleReflectionSubmit} />}

      {stage === 'done' && (
        <div className="text-center space-y-5 py-8">
          <div className="text-5xl">{finalScore / 100 >= 0.6 ? '🏅' : '🌱'}</div>
          <p className="font-display text-2xl font-semibold">คะแนน {finalScore} / 100</p>
          {sortResult && sortResult.bestCombo >= 3 && (
            <p className="text-xs" style={{ color: 'var(--color-gold)' }}>
              🔥 คอมโบสูงสุด {sortResult.bestCombo} ครั้งติด!
            </p>
          )}
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
