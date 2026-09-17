import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LAB_LEVELS } from '../data/codingLab'
import { LabMcChallenge } from '../components/LabMcChallenge'
import { LabOpenChallenge } from '../components/LabOpenChallenge'
import { OrderingActivity } from '../components/OrderingActivity'
import { Mascot } from '../components/Mascot'
import { AmbientBackground } from '../components/AmbientBackground'
import { useStudent } from '../context/StudentContext'

export default function CodingLabLevel() {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const { recordLabLevel } = useStudent()
  const level = LAB_LEVELS.find((l) => l.id === levelId)

  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)
  const [finalFraction, setFinalFraction] = useState(0)

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-ink-dim)]">ไม่พบระดับนี้</p>
      </div>
    )
  }

  const challenge = level.challenges[index]

  const advance = (wasCorrect: boolean) => {
    const newCorrect = correctCount + (wasCorrect ? 1 : 0)
    if (index + 1 < level.challenges.length) {
      setCorrectCount(newCorrect)
      setIndex((i) => i + 1)
    } else {
      const fraction = newCorrect / level.challenges.length
      setFinalFraction(fraction)
      recordLabLevel(level.id, fraction)
      setDone(true)
    }
  }

  return (
    <div className="min-h-screen eco-grid-bg pb-16 relative">
      <AmbientBackground />
      <header className="border-b border-[var(--color-surface-2)] relative z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/lab')} className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] text-sm">
            ← Coding Lab
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-5">
          <p className="text-xs tracking-wide text-[var(--color-mint)]">
            LEVEL {level.order} · {level.subtitle}
          </p>
          <h1 className="font-display text-2xl font-semibold mt-1">
            {level.icon} {level.title}
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 relative z-10">
        {!done ? (
          <div className="space-y-4">
            <p className="text-xs text-[var(--color-ink-dim)]">
              ข้อที่ {index + 1} / {level.challenges.length}
            </p>
            {challenge.type === 'mc' && <LabMcChallenge challenge={challenge} onAnswered={advance} />}
            {challenge.type === 'open' && <LabOpenChallenge challenge={challenge} onAnswered={advance} />}
            {challenge.type === 'order' && (
              <OrderingActivity
                goal={challenge.goal}
                steps={challenge.steps}
                onChecked={(fraction) => advance(fraction >= 0.75)}
              />
            )}
          </div>
        ) : (
          <div className="text-center space-y-5 py-8">
            <div className="text-5xl">{finalFraction >= 0.7 ? '🏅' : '🌱'}</div>
            <p className="font-display text-2xl font-semibold">คะแนน {Math.round(finalFraction * 100)} / 100</p>
            <Mascot
              mood={finalFraction >= 0.7 ? 'great' : 'okay'}
              message={finalFraction >= 0.7 ? 'เก่งมาก! ปลดล็อกเลเวลถัดไปแล้ว' : 'ยังไม่ผ่านเกณฑ์ ลองใหม่อีกครั้งได้เลยนะ ฝึกได้ไม่จำกัด!'}
            />
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setIndex(0)
                  setCorrectCount(0)
                  setDone(false)
                }}
                className="rounded-lg px-5 py-3 text-sm border border-[var(--color-surface-3)] text-[var(--color-ink-dim)]"
              >
                ลองอีกครั้ง
              </button>
              <button
                onClick={() => navigate('/lab')}
                className="rounded-lg px-6 py-3 font-display font-medium text-[var(--color-bg-deep)]"
                style={{ background: 'var(--color-mint)' }}
              >
                กลับสู่ Coding Lab
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
