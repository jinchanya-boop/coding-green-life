import type { AssessmentResult } from '../types'
import { SKILL_LABEL } from '../data/assessmentContent'

export function AssessmentSummary({ pre, post }: { pre: AssessmentResult; post: AssessmentResult }) {
  const skills = Object.keys(SKILL_LABEL) as (keyof typeof SKILL_LABEL)[]
  const overallPrePct = Math.round((pre.totalScore / pre.maxScore) * 100)
  const overallPostPct = Math.round((post.totalScore / post.maxScore) * 100)
  const overallDiff = overallPostPct - overallPrePct

  return (
    <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)] space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <p className="font-display font-medium">📊 พัฒนาการของเธอ</p>
        <span
          className="text-sm font-display font-semibold"
          style={{ color: overallDiff >= 0 ? 'var(--color-mint)' : 'var(--color-coral)' }}
        >
          {overallDiff >= 0 ? '+' : ''}
          {overallDiff}%
        </span>
      </div>
      <div className="space-y-3">
        {skills.map((skill) => {
          const preSkill = pre.scoreBySkill[skill]
          const postSkill = post.scoreBySkill[skill]
          if (!preSkill || !postSkill) return null
          const prePct = Math.round((preSkill.correct / preSkill.total) * 100)
          const postPct = Math.round((postSkill.correct / postSkill.total) * 100)
          return (
            <div key={skill}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--color-ink-dim)]">{SKILL_LABEL[skill]}</span>
                <span>
                  <span className="text-[var(--color-ink-faint)]">{prePct}%</span>
                  {' → '}
                  <span style={{ color: postPct >= prePct ? 'var(--color-mint)' : 'var(--color-coral)' }}>{postPct}%</span>
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
                <div className="absolute h-full rounded-full bg-[var(--color-ink-faint)] opacity-40" style={{ width: `${prePct}%` }} />
                <div className="absolute h-full rounded-full" style={{ width: `${postPct}%`, background: 'var(--color-mint)', opacity: 0.85 }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
