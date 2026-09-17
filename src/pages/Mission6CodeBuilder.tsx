import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MissionShell } from '../components/MissionShell'
import { ReflectionForm, type ReflectionAnswers } from '../components/ReflectionForm'
import { CodeBuilderActivity } from '../components/CodeBuilderActivity'
import { DialogueScene, type DialogueLine } from '../components/DialogueScene'
import { MISSIONS } from '../data/missions'
import { CODE_CHALLENGES } from '../data/mission6Content'
import { useStudent } from '../context/StudentContext'

const mission = MISSIONS.find((m) => m.id === 'm6')!

const TUTORIAL_DIALOGUE: DialogueLine[] = [
  { speaker: 'โค้ชโค้ด', variant: 'gold', text: 'ยินดีต้อนรับสู่ Code Builder! ก่อนเริ่ม มารู้จักบล็อกพื้นฐานกันก่อนนะ' },
  { speaker: 'โค้ชโค้ด', variant: 'gold', text: 'SET คือการตั้งค่าเริ่มต้นให้ตัวแปร เช่น SET count = 0 หมายถึงเริ่มนับจาก 0 ไว้ก่อน' },
  { speaker: 'น้องกรีน', variant: 'green', text: 'แล้ว FOR EACH ล่ะ ทำหน้าที่อะไร?' },
  { speaker: 'โค้ชโค้ด', variant: 'gold', text: 'FOR EACH คือการวนซ้ำไล่ดูข้อมูลทีละชิ้น เช่น ไล่ตรวจขยะทีละชิ้นในรายการทั้งหมด' },
  { speaker: 'โค้ชโค้ด', variant: 'gold', text: 'ส่วน IF...THEN คือการตรวจเงื่อนไข ถ้าเป็นจริงถึงจะทำคำสั่งที่อยู่ข้างในบล็อกนั้น' },
  { speaker: 'น้องกรีน', variant: 'green', text: 'เข้าใจละ! พร้อมลุยเขียนโค้ดจริงแล้ว ไปกันเลย!' },
]

type Stage = 'intro' | 'challenge1' | 'challenge2' | 'reflect' | 'done'

export default function Mission6CodeBuilder() {
  const navigate = useNavigate()
  const { recordMissionResult } = useStudent()
  const [stage, setStage] = useState<Stage>('intro')
  const [startedAt] = useState(() => Date.now())
  const [c1Passed, setC1Passed] = useState(true)
  const [c1Attempts, setC1Attempts] = useState(0)
  const [c2Passed, setC2Passed] = useState(true)
  const [c2Attempts, setC2Attempts] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  const handleReflectionSubmit = (answers: ReflectionAnswers) => {
    const timeSeconds = Math.round((Date.now() - startedAt) / 1000)
    const errorTypes: string[] = []
    if (!c1Passed) errorTypes.push(`${CODE_CHALLENGES[0].title}: ไม่ผ่าน ใช้ ${c1Attempts} ครั้งในการลองรัน`)
    if (!c2Passed) errorTypes.push(`${CODE_CHALLENGES[1].title}: ไม่ผ่าน ใช้ ${c2Attempts} ครั้งในการลองรัน`)
    recordMissionResult(
      'm6',
      {
        score: finalScore,
        maxScore: 100,
        correctCount: (c1Passed ? 1 : 0) + (c2Passed ? 1 : 0),
        wrongCount: c1Attempts + c2Attempts,
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
        <DialogueScene lines={TUTORIAL_DIALOGUE} onDone={() => setStage('challenge1')} buttonLabel="เริ่มเขียนโค้ด!" />
      )}

      {stage === 'challenge1' && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--color-mint)]">โจทย์ที่ 1 / 2 · {CODE_CHALLENGES[0].title}</p>
          <CodeBuilderActivity
            challenge={CODE_CHALLENGES[0]}
            onSolved={(passed, attempts) => {
              setC1Passed(passed)
              setC1Attempts(attempts)
              setStage('challenge2')
            }}
          />
        </div>
      )}

      {stage === 'challenge2' && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--color-mint)]">โจทย์ที่ 2 / 2 · {CODE_CHALLENGES[1].title}</p>
          <CodeBuilderActivity
            challenge={CODE_CHALLENGES[1]}
            onSolved={(passed, attempts) => {
              setC2Passed(passed)
              setC2Attempts(attempts)
              const score = Math.round(((c1Passed ? 50 : 20) + (passed ? 50 : 20)))
              setFinalScore(Math.min(100, score))
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
