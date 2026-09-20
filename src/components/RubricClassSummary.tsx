import { RUBRIC_CRITERIA, RUBRIC_LEVELS } from '../data/rubricContent'

interface RubricRow {
  student_id: string
  criterion: string
  level: number
}

const LEVEL_COLORS: Record<number, string> = {
  4: 'var(--color-mint)',
  3: '#8FD694',
  2: 'var(--color-gold)',
  1: 'var(--color-coral)',
}

export function RubricClassSummary({ rows }: { rows: RubricRow[] }) {
  if (rows.length === 0) return null

  const scoredStudentIds = new Set(rows.map((r) => r.student_id))

  return (
    <div className="rounded-xl p-5 border border-[var(--color-surface-3)] space-y-4" style={{ background: 'var(--color-surface)' }}>
      <div className="flex items-center justify-between">
        <p className="font-display font-medium text-[var(--color-ink)]">📋 Rubric รวมห้อง — จำนวนนักเรียนแต่ละระดับ</p>
        <span className="text-xs text-[var(--color-ink-dim)]">ให้คะแนนแล้ว {scoredStudentIds.size} คน</span>
      </div>

      <div className="space-y-4">
        {RUBRIC_CRITERIA.map((c) => {
          const criterionRows = rows.filter((r) => r.criterion === c.id)
          const total = criterionRows.length
          if (total === 0) return null
          return (
            <div key={c.id}>
              <p className="text-xs text-[var(--color-mint)] mb-1.5">
                {c.icon} {c.label} <span className="text-[var(--color-ink-faint)]">({total} คน)</span>
              </p>
              <div className="flex rounded-lg overflow-hidden h-6" style={{ background: 'var(--color-surface-2)' }}>
                {RUBRIC_LEVELS.map(({ level }) => {
                  const count = criterionRows.filter((r) => r.level === level).length
                  const pct = total ? (count / total) * 100 : 0
                  if (pct === 0) return null
                  return (
                    <div
                      key={level}
                      className="flex items-center justify-center text-[10px] font-medium"
                      style={{ width: `${pct}%`, background: LEVEL_COLORS[level], color: '#0D1F1C' }}
                      title={`ระดับ ${level}: ${count} คน (${pct.toFixed(0)}%)`}
                    >
                      {pct >= 10 ? count : ''}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between text-[10px] text-[var(--color-ink-faint)] mt-1">
                {RUBRIC_LEVELS.map(({ level, label }) => {
                  const count = criterionRows.filter((r) => r.level === level).length
                  return (
                    <span key={level}>
                      {level} {label}: {count}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
