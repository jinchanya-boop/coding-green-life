import { SATISFACTION_ITEMS } from '../data/satisfactionContent'

interface SurveyRow {
  student_id: string
  fun_score: number
  understanding_score: number
  self_motivation_score: number
  real_life_score: number
  overall_score: number
  comment: string | null
}

interface StudentRow {
  id: string
  name: string
  class_name: string
}

type ScoreKey = 'fun_score' | 'understanding_score' | 'self_motivation_score' | 'real_life_score' | 'overall_score'

const FIELD_MAP: Record<string, ScoreKey> = {
  funScore: 'fun_score',
  understandingScore: 'understanding_score',
  selfMotivationScore: 'self_motivation_score',
  realLifeScore: 'real_life_score',
  overallScore: 'overall_score',
}

export function SatisfactionSummary({ surveys, students }: { surveys: SurveyRow[]; students: StudentRow[] }) {
  if (surveys.length === 0) return null

  const avg = (key: ScoreKey) => surveys.reduce((sum, s) => sum + s[key], 0) / surveys.length
  const pctSatisfied = (key: ScoreKey) => Math.round((surveys.filter((s) => s[key] >= 4).length / surveys.length) * 100)

  const overallPct = pctSatisfied('overall_score')
  const doneIds = new Set(surveys.map((s) => s.student_id))
  const notDone = students.filter((s) => !doneIds.has(s.id))

  return (
    <div className="rounded-xl p-5 border border-[var(--color-surface-3)] space-y-4" style={{ background: 'var(--color-surface)' }}>
      <div className="flex items-center justify-between">
        <p className="font-display font-medium text-[var(--color-ink)]">🌟 ผลสำรวจความพึงพอใจ</p>
        <span className="text-xs text-[var(--color-ink-dim)]">ทำแบบสำรวจแล้ว {surveys.length} คน</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ background: 'var(--color-surface-2)' }}>
          <p className="text-2xl font-display font-semibold" style={{ color: 'var(--color-gold)' }}>
            {overallPct}%
          </p>
          <p className="text-xs text-[var(--color-ink-dim)] mt-1">พึงพอใจโดยรวมระดับ "มาก" ขึ้นไป</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'var(--color-surface-2)' }}>
          <p className="text-2xl font-display font-semibold text-[var(--color-mint)]">{avg('overall_score').toFixed(1)}/5</p>
          <p className="text-xs text-[var(--color-ink-dim)] mt-1">คะแนนเฉลี่ยความพึงพอใจโดยรวม</p>
        </div>
      </div>

      <div className="space-y-2">
        {SATISFACTION_ITEMS.map((item) => {
          const key = FIELD_MAP[item.id]
          return (
            <div key={item.id} className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-ink-dim)]">{item.label}</span>
              <span className="text-[var(--color-ink)] shrink-0 ml-2">
                {avg(key).toFixed(1)}/5 · {pctSatisfied(key)}% ระดับมากขึ้นไป
              </span>
            </div>
          )
        })}
      </div>

      {surveys.some((s) => s.comment) && (
        <div className="pt-2 border-t border-[var(--color-surface-2)] space-y-1.5">
          <p className="text-xs text-[var(--color-mint)]">ความคิดเห็นจากนักเรียน</p>
          {surveys
            .filter((s) => s.comment)
            .slice(0, 5)
            .map((s, i) => (
              <p key={i} className="text-xs text-[var(--color-ink-dim)] italic">
                "{s.comment}"
              </p>
            ))}
        </div>
      )}

      {notDone.length > 0 && (
        <div className="pt-2 border-t border-[var(--color-surface-2)] space-y-1.5">
          <p className="text-xs" style={{ color: 'var(--color-coral)' }}>
            ⏳ ยังไม่ได้ทำแบบสำรวจ ({notDone.length} คน)
          </p>
          <p className="text-xs text-[var(--color-ink-dim)]">
            {notDone.map((s) => `${s.name} (${s.class_name})`).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
