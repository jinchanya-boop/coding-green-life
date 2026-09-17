import { useState } from 'react'

export interface ReflectionAnswers {
  learned: string
  problem: string
  solution: string
  mistake: string
  improve: string
  realLifeUse: string
}

const QUESTIONS: { key: keyof ReflectionAnswers; label: string }[] = [
  { key: 'learned', label: 'วันนี้ฉันเรียนรู้อะไร?' },
  { key: 'problem', label: 'ฉันพบปัญหาอะไร?' },
  { key: 'solution', label: 'ฉันแก้ปัญหาอย่างไร?' },
  { key: 'mistake', label: 'ฉันผิดพลาดตรงไหน?' },
  { key: 'improve', label: 'ฉันจะปรับปรุงอะไร?' },
  { key: 'realLifeUse', label: 'ความรู้วันนี้นำไปใช้กับชีวิตจริงได้อย่างไร?' },
]

export function ReflectionForm({ onSubmit }: { onSubmit: (answers: ReflectionAnswers) => void }) {
  const [answers, setAnswers] = useState<ReflectionAnswers>({
    learned: '',
    problem: '',
    solution: '',
    mistake: '',
    improve: '',
    realLifeUse: '',
  })

  const filledCount = Object.values(answers).filter((v) => v.trim().length > 0).length
  const canSubmit = filledCount === QUESTIONS.length

  return (
    <div className="space-y-4">
      <p className="font-display text-lg font-semibold">สะท้อนคิด (Reflection)</p>
      {QUESTIONS.map((q) => (
        <div key={q.key}>
          <label className="block text-sm text-[var(--color-ink-dim)] mb-1.5">{q.label}</label>
          <textarea
            value={answers[q.key]}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))}
            rows={2}
            className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-sm resize-none"
          />
        </div>
      ))}
      <button
        onClick={() => onSubmit(answers)}
        disabled={!canSubmit}
        className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'var(--color-mint)' }}
      >
        ส่งคำตอบและบันทึกผล
      </button>
    </div>
  )
}
