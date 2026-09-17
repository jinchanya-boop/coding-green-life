import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { PROJECT_TYPES, FEEDBACK_CRITERIA } from '../data/creatorStudioContent'
import { fetchAllProjects, fetchFeedbackForProject, submitPeerFeedback } from '../lib/supabase'
import { useStudent } from '../context/StudentContext'

interface ProjectRow {
  id: string
  student_id: string
  project_type: string
  title: string
  problem: string
  goal: string
  algorithm: string
  flowchart: string
  code_notes: string
  test_notes: string
  debug_notes: string
  improve_notes: string
  reflection: string
}

interface FeedbackRow {
  id: number
  clarity_score: number
  fun_score: number
  correctness_score: number
  creativity_score: number
  problem_solving_score: number
  env_benefit_score: number
  comment: string
}

const FIELD_LABELS: { key: keyof ProjectRow; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'goal', label: 'Goal' },
  { key: 'algorithm', label: 'Algorithm' },
  { key: 'flowchart', label: 'Flowchart' },
  { key: 'code_notes', label: 'Code' },
  { key: 'test_notes', label: 'Test' },
  { key: 'debug_notes', label: 'Debug' },
  { key: 'improve_notes', label: 'Improvement' },
  { key: 'reflection', label: 'Reflection' },
]

export default function ProjectDetail() {
  const { profile } = useStudent()
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectRow | null>(null)
  const [feedback, setFeedback] = useState<FeedbackRow[]>([])
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!projectId) return
    Promise.all([fetchAllProjects(), fetchFeedbackForProject(projectId)])
      .then(([all, fb]) => {
        const found = (all as ProjectRow[]).find((p) => p.id === projectId) ?? null
        setProject(found)
        setFeedback(fb as FeedbackRow[])
      })
      .finally(() => setLoading(false))
  }, [projectId])

  if (!profile) return null
  if (loading) return <p className="p-6 text-[var(--color-ink-dim)]">กำลังโหลด...</p>
  if (!project) return <p className="p-6 text-[var(--color-ink-dim)]">ไม่พบผลงานนี้</p>

  const isOwner = project.student_id === profile.id
  const typeInfo = PROJECT_TYPES.find((t) => t.id === project.project_type)

  const allScored = FEEDBACK_CRITERIA.every((c) => scores[c.id] >= 1)

  const handleSubmitFeedback = async () => {
    if (!allScored || !projectId) return
    await submitPeerFeedback({
      project_id: projectId,
      reviewer_student_id: profile.id,
      clarity_score: scores.clarityScore,
      fun_score: scores.funScore,
      correctness_score: scores.correctnessScore,
      creativity_score: scores.creativityScore,
      problem_solving_score: scores.problemSolvingScore,
      env_benefit_score: scores.envBenefitScore,
      comment,
    })
    setSubmitted(true)
  }

  const avg = (key: keyof FeedbackRow) =>
    feedback.length ? (feedback.reduce((s, f) => s + (f[key] as number), 0) / feedback.length).toFixed(1) : '—'

  return (
    <div className="min-h-screen eco-grid-bg pb-16 relative">
      <AmbientBackground />
      <header className="border-b border-[var(--color-surface-2)] relative z-10">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <button onClick={() => navigate(-1)} className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] text-sm">
            ← กลับ
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-5">
          <p className="text-xs text-[var(--color-mint)]">
            {typeInfo?.icon} {typeInfo?.label}
          </p>
          <h1 className="font-display text-2xl font-semibold mt-1">{project.title}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 space-y-4 relative z-10">
        <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)] space-y-3 text-sm">
          {FIELD_LABELS.map((f) =>
            project[f.key] ? (
              <p key={f.key}>
                <span className="text-[var(--color-mint)]">{f.label}:</span> {project[f.key]}
              </p>
            ) : null
          )}
        </div>

        {isOwner ? (
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="font-display font-medium mb-3">💬 Feedback จากเพื่อน ({feedback.length} คน)</p>
            {feedback.length === 0 ? (
              <p className="text-xs text-[var(--color-ink-dim)]">ยังไม่มีเพื่อนให้ feedback</p>
            ) : (
              <div className="space-y-2 text-xs text-[var(--color-ink-dim)]">
                <p>ความเข้าใจง่าย: {avg('clarity_score')}/5</p>
                <p>ความสนุก: {avg('fun_score')}/5</p>
                <p>ความถูกต้อง: {avg('correctness_score')}/5</p>
                <p>ความคิดสร้างสรรค์: {avg('creativity_score')}/5</p>
                <p>การแก้ปัญหา: {avg('problem_solving_score')}/5</p>
                <p>ประโยชน์ต่อสิ่งแวดล้อม: {avg('env_benefit_score')}/5</p>
                <div className="pt-2 space-y-1.5">
                  {feedback.filter((f) => f.comment).map((f) => (
                    <p key={f.id} className="text-[var(--color-ink)] italic">
                      "{f.comment}"
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : submitted ? (
          <div className="rounded-xl p-4 text-center text-sm" style={{ background: 'rgba(94,234,212,0.12)', color: 'var(--color-mint)' }}>
            ส่ง Feedback แล้ว ขอบคุณที่ช่วยเพื่อนนะ! 🌱
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)] space-y-3">
            <p className="font-display font-medium">ให้ Feedback ผลงานนี้</p>
            {FEEDBACK_CRITERIA.map((c) => (
              <div key={c.id}>
                <p className="text-xs text-[var(--color-ink-dim)] mb-1">{c.label}</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setScores((s) => ({ ...s, [c.id]: n }))}
                      className="w-8 h-8 rounded-full text-sm border"
                      style={{
                        borderColor: (scores[c.id] ?? 0) >= n ? 'var(--color-gold)' : 'var(--color-surface-3)',
                        background: (scores[c.id] ?? 0) >= n ? 'rgba(244,185,66,0.2)' : 'var(--color-surface-2)',
                        color: (scores[c.id] ?? 0) >= n ? 'var(--color-gold)' : 'var(--color-ink-dim)',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="ความเห็นเพิ่มเติม (ไม่บังคับ)"
              rows={2}
              className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-sm resize-none"
            />
            <button
              onClick={handleSubmitFeedback}
              disabled={!allScored}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
              style={{ background: 'var(--color-mint)' }}
            >
              ส่ง Feedback
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
