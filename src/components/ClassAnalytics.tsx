import { SKILL_LABEL } from '../data/assessmentContent'
import type { AssessmentSkill } from '../types'

interface StudentWithTests {
  pre_test?: { scoreBySkill: Record<AssessmentSkill, { correct: number; total: number }>; totalScore: number; maxScore: number } | null
  post_test?: { scoreBySkill: Record<AssessmentSkill, { correct: number; total: number }>; totalScore: number; maxScore: number } | null
}

export function ClassAnalytics({ students }: { students: StudentWithTests[] }) {
  const withBoth = students.filter((s) => s.pre_test && s.post_test)
  const withPreOnly = students.filter((s) => s.pre_test && !s.post_test).length
  const noneYet = students.filter((s) => !s.pre_test).length

  if (students.length === 0) return null

  const skills = Object.keys(SKILL_LABEL) as AssessmentSkill[]

  const classAvgPct = (key: 'pre_test' | 'post_test') => {
    const withTest = students.filter((s) => s[key])
    if (withTest.length === 0) return null
    const totalPct = withTest.reduce((sum, s) => {
      const t = s[key]!
      return sum + (t.totalScore / t.maxScore) * 100
    }, 0)
    return Math.round(totalPct / withTest.length)
  }

  const skillAvgPct = (skill: AssessmentSkill, key: 'pre_test' | 'post_test') => {
    const withTest = withBoth
    if (withTest.length === 0) return 0
    const totalPct = withTest.reduce((sum, s) => {
      const t = s[key]!
      const sk = t.scoreBySkill[skill]
      return sum + (sk ? (sk.correct / sk.total) * 100 : 0)
    }, 0)
    return Math.round(totalPct / withTest.length)
  }

  const preAvg = classAvgPct('pre_test')
  const postAvg = classAvgPct('post_test')

  return (
    <div className="rounded-xl p-5 border border-[var(--color-surface-3)] space-y-4" style={{ background: 'var(--color-surface)' }}>
      <div className="flex items-center justify-between">
        <p className="font-display font-medium text-[var(--color-ink)]">📈 Learning Analytics รวมห้อง</p>
        <span className="text-xs text-[var(--color-ink-dim)]">
          ทำครบ Pre+Post {withBoth.length} คน · ทำแค่ Pre {withPreOnly} คน · ยังไม่ทำ {noneYet} คน
        </span>
      </div>

      {withBoth.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-dim)]">ยังไม่มีนักเรียนที่ทำครบทั้ง Pre-test และ Post-test — ต้องมีอย่างน้อย 1 คนถึงจะเห็นกราฟเปรียบเทียบ</p>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-display font-semibold text-[var(--color-ink-faint)]">{preAvg}%</p>
              <p className="text-xs text-[var(--color-ink-dim)]">เฉลี่ยก่อนเรียน</p>
            </div>
            <span className="text-[var(--color-ink-dim)]">→</span>
            <div>
              <p className="text-2xl font-display font-semibold text-[var(--color-mint)]">{postAvg}%</p>
              <p className="text-xs text-[var(--color-ink-dim)]">เฉลี่ยหลังเรียน</p>
            </div>
            {preAvg !== null && postAvg !== null && (
              <span
                className="ml-auto text-lg font-display font-semibold"
                style={{ color: postAvg >= preAvg ? 'var(--color-mint)' : 'var(--color-coral)' }}
              >
                {postAvg - preAvg >= 0 ? '+' : ''}
                {postAvg - preAvg}%
              </span>
            )}
          </div>

          <div className="space-y-3">
            {skills.map((skill) => {
              const pre = skillAvgPct(skill, 'pre_test')
              const post = skillAvgPct(skill, 'post_test')
              return (
                <div key={skill}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--color-ink-dim)]">{SKILL_LABEL[skill]}</span>
                    <span>
                      <span className="text-[var(--color-ink-faint)]">{pre}%</span>
                      {' → '}
                      <span style={{ color: post >= pre ? 'var(--color-mint)' : 'var(--color-coral)' }}>{post}%</span>
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
                    <div className="absolute h-full rounded-full bg-[var(--color-ink-faint)] opacity-40" style={{ width: `${pre}%` }} />
                    <div className="absolute h-full rounded-full" style={{ width: `${post}%`, background: 'var(--color-mint)', opacity: 0.85 }} />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-[var(--color-ink-faint)]">* คำนวณเฉพาะนักเรียนที่ทำครบทั้ง Pre-test และ Post-test แล้ว ({withBoth.length} คน)</p>
        </>
      )}
    </div>
  )
}
