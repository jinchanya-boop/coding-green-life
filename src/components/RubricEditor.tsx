import { useEffect, useState } from 'react'
import { RUBRIC_CRITERIA, RUBRIC_LEVELS, rubricLevelDescription } from '../data/rubricContent'
import { fetchRubricForStudent, saveRubricScore } from '../lib/supabase'

interface RubricRow {
  criterion: string
  level: number
}

export function RubricEditor({ studentId }: { studentId: string }) {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [savingCriterion, setSavingCriterion] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchRubricForStudent(studentId)
      .then((rows) => {
        const map: Record<string, number> = {}
        ;(rows as RubricRow[]).forEach((r) => {
          map[r.criterion] = r.level
        })
        setScores(map)
      })
      .finally(() => setLoading(false))
  }, [studentId])

  const handleSetLevel = async (criterion: string, level: number) => {
    setScores((prev) => ({ ...prev, [criterion]: level }))
    setSavingCriterion(criterion)
    try {
      await saveRubricScore({
        student_id: studentId,
        criterion,
        level,
        scored_by: 'teacher',
        updated_at: new Date().toISOString(),
      })
    } finally {
      setSavingCriterion(null)
    }
  }

  const scoredCount = Object.keys(scores).length
  const total = scoredCount ? (Object.values(scores).reduce((a, b) => a + b, 0) / scoredCount).toFixed(1) : '—'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-display font-medium">📋 Rubric การประเมินเชิงคุณภาพ</p>
        <span className="text-xs text-[var(--color-ink-dim)]">
          เฉลี่ย {total}/4 · ให้คะแนนแล้ว {scoredCount}/{RUBRIC_CRITERIA.length}
        </span>
      </div>
      {loading ? (
        <p className="text-xs text-[var(--color-ink-dim)]">กำลังโหลด...</p>
      ) : (
        <div className="space-y-3">
          {RUBRIC_CRITERIA.map((c) => (
            <div key={c.id}>
              <p className="text-xs text-[var(--color-ink-dim)] mb-1.5">
                {c.icon} {c.label}
              </p>
              <div className="flex gap-1.5">
                {RUBRIC_LEVELS.map(({ level, label }) => {
                  const active = scores[c.id] === level
                  return (
                    <button
                      key={level}
                      onClick={() => handleSetLevel(c.id, level)}
                      title={rubricLevelDescription(c.label, level)}
                      disabled={savingCriterion === c.id}
                      className="flex-1 rounded-lg py-2 text-xs border disabled:opacity-60"
                      style={{
                        borderColor: active ? 'var(--color-gold)' : 'var(--color-surface-3)',
                        background: active ? 'rgba(244,185,66,0.15)' : 'var(--color-surface-2)',
                        color: active ? 'var(--color-gold)' : 'var(--color-ink-dim)',
                      }}
                    >
                      {level} · {label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
