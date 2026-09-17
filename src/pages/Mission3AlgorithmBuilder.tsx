import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MissionShell } from '../components/MissionShell'
import { ReflectionForm, type ReflectionAnswers } from '../components/ReflectionForm'
import { AlgorithmBuilderActivity } from '../components/AlgorithmBuilderActivity'
import { BonusRaceGame } from '../components/BonusRaceGame'
import { MISSIONS } from '../data/missions'
import { ALGORITHM_SCENARIOS } from '../data/mission3Content'
import { useStudent } from '../context/StudentContext'

const mission = MISSIONS.find((m) => m.id === 'm3')!

type Stage = 'intro' | 'scenario1' | 'bonusRace' | 'scenario2' | 'reflect' | 'done'

export default function Mission3AlgorithmBuilder() {
  const navigate = useNavigate()
  const { recordMissionResult } = useStudent()
  const [stage, setStage] = useState<Stage>('intro')
  const [startedAt] = useState(() => Date.now())
  const [s1Fraction, setS1Fraction] = useState(0)
  const [s1Attempts, setS1Attempts] = useState(0)
  const [s2Fraction, setS2Fraction] = useState(0)
  const [s2Attempts, setS2Attempts] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [bonusTotal, setBonusTotal] = useState(0)

  const handleReflectionSubmit = (answers: ReflectionAnswers) => {
    const timeSeconds = Math.round((Date.now() - startedAt) / 1000)
    const errorTypes: string[] = []
    if (s1Fraction < 1) errorTypes.push(`สถานการณ์ที่ 1 (${ALGORITHM_SCENARIOS[0].title}): ใช้ ${s1Attempts} ครั้งกว่าจะได้ ${Math.round(s1Fraction * 100)}%`)
    if (s2Fraction < 1) errorTypes.push(`สถานการณ์ที่ 2 (${ALGORITHM_SCENARIOS[1].title}): ใช้ ${s2Attempts} ครั้งกว่าจะได้ ${Math.round(s2Fraction * 100)}%`)
    recordMissionResult(
      'm3',
      {
        score: finalScore,
        maxScore: 100,
        correctCount: Math.round(s1Fraction * ALGORITHM_SCENARIOS[0].solution.length + s2Fraction * ALGORITHM_SCENARIOS[1].solution.length),
        wrongCount: s1Attempts + s2Attempts,
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
          <p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">{mission.storyIntro}</p>
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="text-sm font-medium mb-1">เป้าหมายการเรียนรู้</p>
            <p className="text-sm text-[var(--color-ink-dim)]">{mission.learningGoal}</p>
          </div>
          <button
            onClick={() => setStage('scenario1')}
            className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
            style={{ background: 'var(--color-mint)' }}
          >
            เริ่มประกอบ Algorithm
          </button>
        </div>
      )}

      {stage === 'scenario1' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-mint)]">สถานการณ์ที่ 1 / 2 · {ALGORITHM_SCENARIOS[0].title}</p>
          <AlgorithmBuilderActivity
            scenario={ALGORITHM_SCENARIOS[0]}
            onSolved={(fraction, attempts) => {
              setS1Fraction(fraction)
              setS1Attempts(attempts)
              setStage('bonusRace')
            }}
          />
        </div>
      )}

      {stage === 'bonusRace' && (
        <BonusRaceGame
          onComplete={(bonus) => {
            setBonusTotal((t) => t + bonus)
            setStage('scenario2')
          }}
        />
      )}

      {stage === 'scenario2' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--color-mint)]">สถานการณ์ที่ 2 / 2 · {ALGORITHM_SCENARIOS[1].title}</p>
          <AlgorithmBuilderActivity
            scenario={ALGORITHM_SCENARIOS[1]}
            onSolved={(fraction, attempts) => {
              setS2Fraction(fraction)
              setS2Attempts(attempts)
              const score = Math.round((s1Fraction * 50 + fraction * 50))
              setFinalScore(score)
              setStage('reflect')
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
              🏁 เก็บคะแนนโบนัสจากมินิเกมแข่งรถได้ {bonusTotal} แต้ม!
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
