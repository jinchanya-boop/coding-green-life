import { useEffect, useState } from 'react'
import { supabaseEnabled, fetchStudents, fetchAttempts, fetchReflections, fetchAllSatisfactionSurveys } from '../lib/supabase'
import { MISSIONS } from '../data/missions'
import { RubricEditor } from '../components/RubricEditor'
import { ClassAnalytics } from '../components/ClassAnalytics'
import { InterventionAlerts } from '../components/InterventionAlerts'
import { SatisfactionSummary } from '../components/SatisfactionSummary'
import { SKILL_LABEL } from '../data/assessmentContent'
import type { AssessmentSkill } from '../types'
import { useNavigate } from 'react-router-dom'

interface StudentRow {
  id: string
  student_code: string
  name: string
  class_name: string
  avatar: string
  xp: number
  level: number
  green_energy: number
  badges: { id: string; name: string; icon: string }[]
  missions: Record<string, { status: string; bestScore: number; attempts: number }>
  pre_test?: { scoreBySkill: Record<string, { correct: number; total: number }>; totalScore: number; maxScore: number } | null
  post_test?: { scoreBySkill: Record<string, { correct: number; total: number }>; totalScore: number; maxScore: number } | null
  updated_at: string
}

interface AttemptRow {
  student_id: string
  mission_id: string
  attempt_number: number
  score: number
  max_score: number
  correct_count: number
  wrong_count: number
  error_types: string[]
  time_seconds: number
  completed_at: string
}

interface ReflectionRow {
  student_id: string
  mission_id: string
  learned: string
  problem: string
  solution: string
  mistake: string
  improve: string
  real_life_use: string
  created_at: string
}

function toCsvValue(v: unknown): string {
  const s = typeof v === 'string' ? v : JSON.stringify(v)
  return `"${s.replace(/"/g, '""')}"`
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map(toCsvValue).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [attempts, setAttempts] = useState<AttemptRow[]>([])
  const [reflections, setReflections] = useState<ReflectionRow[]>([])
  const [surveys, setSurveys] = useState<
    { fun_score: number; understanding_score: number; self_motivation_score: number; real_life_score: number; overall_score: number; comment: string | null }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!supabaseEnabled) {
      setLoading(false)
      return
    }
    Promise.all([fetchStudents(), fetchAttempts(), fetchReflections(), fetchAllSatisfactionSurveys()])
      .then(([s, a, r, sv]) => {
        setStudents(s as StudentRow[])
        setAttempts(a as AttemptRow[])
        setReflections(r as ReflectionRow[])
        setSurveys(sv as typeof surveys)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'โหลดข้อมูลไม่สำเร็จ'))
      .finally(() => setLoading(false))
  }, [])

  if (!supabaseEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-md text-center space-y-3">
          <p className="text-4xl">🔌</p>
          <h1 className="font-display text-xl font-semibold text-[var(--color-ink)]">ยังไม่ได้เชื่อมต่อ Supabase</h1>
          <p className="text-sm text-[var(--color-ink-dim)]">
            หน้านี้ต้องดึงข้อมูลนักเรียนหลายคนจากฐานข้อมูลกลาง กรุณาตั้งค่า{' '}
            <code className="text-[var(--color-mint)]">VITE_SUPABASE_URL</code> และ{' '}
            <code className="text-[var(--color-mint)]">VITE_SUPABASE_ANON_KEY</code> ในไฟล์ .env ก่อน (ดูวิธีใน README.md)
          </p>
        </div>
      </div>
    )
  }

  const completedMissionsCount = (s: StudentRow) => Object.values(s.missions ?? {}).filter((m) => m.status === 'completed').length
  const avgXp = students.length ? Math.round(students.reduce((sum, s) => sum + s.xp, 0) / students.length) : 0
  const totalBadges = students.reduce((sum, s) => sum + (s.badges?.length ?? 0), 0)

  const selected = students.find((s) => s.id === selectedId) ?? null
  const selectedAttempts = attempts.filter((a) => a.student_id === selectedId)
  const selectedReflections = reflections.filter((r) => r.student_id === selectedId)

  const exportRosterCsv = () => {
    const rows: string[][] = [
      ['student_code', 'name', 'class_name', 'level', 'xp', 'green_energy', 'missions_completed', 'badges_earned'],
      ...students.map((s) => [
        s.student_code,
        s.name,
        s.class_name,
        String(s.level),
        String(s.xp),
        String(s.green_energy),
        String(completedMissionsCount(s)),
        String(s.badges?.length ?? 0),
      ]),
    ]
    downloadCsv('coding-green-life-roster.csv', rows)
  }

  const exportAttemptsCsv = () => {
    const rows: string[][] = [
      ['student_code', 'mission_id', 'attempt_number', 'score', 'max_score', 'correct_count', 'wrong_count', 'time_seconds', 'completed_at'],
      ...attempts.map((a) => {
        const student = students.find((s) => s.id === a.student_id)
        return [
          student?.student_code ?? a.student_id,
          a.mission_id,
          String(a.attempt_number),
          String(a.score),
          String(a.max_score),
          String(a.correct_count),
          String(a.wrong_count),
          String(a.time_seconds),
          a.completed_at,
        ]
      }),
    ]
    downloadCsv('coding-green-life-attempts.csv', rows)
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <header className="border-b border-[var(--color-surface-2)] px-6 py-5">
        <p className="text-xs tracking-wide text-[var(--color-mint)]">EVIDENCE & TEACHER DASHBOARD</p>
        <h1 className="font-display text-2xl font-semibold mt-1 text-[var(--color-ink)]">ภาพรวมชั้นเรียน</h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-6 space-y-6">
        {loading && <p className="text-[var(--color-ink-dim)] text-sm">กำลังโหลดข้อมูล...</p>}
        {error && <p className="text-[var(--color-coral)] text-sm">เกิดข้อผิดพลาด: {error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'นักเรียนทั้งหมด', value: students.length },
                { label: 'XP เฉลี่ย', value: avgXp },
                { label: 'เหรียญตราที่ได้รวม', value: totalBadges },
                { label: 'ครั้งที่ทำภารกิจรวม', value: attempts.length },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl p-4 border border-[var(--color-surface-3)]" style={{ background: 'var(--color-surface)' }}>
                  <p className="text-2xl font-display font-semibold text-[var(--color-mint)]">{stat.value}</p>
                  <p className="text-xs text-[var(--color-ink-dim)] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={exportRosterCsv}
                className="rounded-lg px-4 py-2.5 text-sm font-medium border border-[var(--color-surface-3)] text-[var(--color-ink)]"
                style={{ background: 'var(--color-surface)' }}
              >
                ⬇ Export รายชื่อนักเรียน (CSV)
              </button>
              <button
                onClick={exportAttemptsCsv}
                className="rounded-lg px-4 py-2.5 text-sm font-medium border border-[var(--color-surface-3)] text-[var(--color-ink)]"
                style={{ background: 'var(--color-surface)' }}
              >
                ⬇ Export คะแนนรายภารกิจ (CSV)
              </button>
              <button
                onClick={() => navigate('/teacher/evidence')}
                className="rounded-lg px-4 py-2.5 text-sm font-medium border ml-auto"
                style={{ background: 'rgba(94,234,212,0.1)', borderColor: 'var(--color-mint)', color: 'var(--color-mint)' }}
              >
                📄 ดูรายงาน Evidence (พิมพ์เป็น PDF ได้)
              </button>
            </div>

            <ClassAnalytics students={students} />
            <InterventionAlerts students={students} />
            <SatisfactionSummary surveys={surveys} />

            <div className="rounded-xl border border-[var(--color-surface-3)] overflow-hidden" style={{ background: 'var(--color-surface)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[var(--color-ink-dim)] border-b border-[var(--color-surface-3)]">
                    <th className="px-4 py-3">รหัส</th>
                    <th className="px-4 py-3">ชื่อ</th>
                    <th className="px-4 py-3">ห้อง</th>
                    <th className="px-4 py-3">Level</th>
                    <th className="px-4 py-3">XP</th>
                    <th className="px-4 py-3">ภารกิจสำเร็จ</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedId(s.id === selectedId ? null : s.id)}
                      className="border-b border-[var(--color-surface-2)] cursor-pointer hover:bg-[var(--color-surface-2)] text-[var(--color-ink)]"
                    >
                      <td className="px-4 py-3">{s.student_code}</td>
                      <td className="px-4 py-3">{s.name}</td>
                      <td className="px-4 py-3">{s.class_name}</td>
                      <td className="px-4 py-3">{s.level}</td>
                      <td className="px-4 py-3">{s.xp}</td>
                      <td className="px-4 py-3">
                        {completedMissionsCount(s)} / {MISSIONS.length}
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-ink-dim)]">
                        ยังไม่มีนักเรียนเล่นระบบนี้
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {selected && (
              <div className="rounded-xl p-5 border border-[var(--color-surface-3)] space-y-4" style={{ background: 'var(--color-surface)' }}>
                <div className="flex items-center justify-between">
                  <p className="font-display font-medium text-[var(--color-ink)]">
                    {selected.name} · {selected.class_name}
                  </p>
                  <button onClick={() => setSelectedId(null)} className="text-xs text-[var(--color-ink-dim)]">
                    ปิด ✕
                  </button>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-mint)] mb-2">คะแนนรายภารกิจ</p>
                  <div className="space-y-2">
                    {MISSIONS.map((m) => {
                      const state = selected.missions?.[m.id]
                      if (!state || state.attempts === 0) return null
                      return (
                        <div key={m.id} className="flex items-center justify-between text-sm">
                          <span className="text-[var(--color-ink-dim)]">
                            {m.code} · {m.title}
                          </span>
                          <span className="text-[var(--color-ink)]">
                            {state.bestScore}/100 ({state.attempts} ครั้ง) — {state.status === 'completed' ? '✅' : '⏳'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {selectedAttempts.some((a) => a.error_types.length > 0) && (
                  <div>
                    <p className="text-xs text-[var(--color-coral)] mb-2">ข้อผิดพลาดที่พบบ่อย</p>
                    <div className="space-y-1 text-xs text-[var(--color-ink-dim)]">
                      {selectedAttempts
                        .flatMap((a) => a.error_types)
                        .slice(0, 8)
                        .map((e, i) => (
                          <p key={i}>• {e}</p>
                        ))}
                    </div>
                  </div>
                )}

                {selectedReflections.length > 0 && (
                  <div>
                    <p className="text-xs text-[var(--color-mint)] mb-2">Reflection ล่าสุด</p>
                    <div className="text-xs text-[var(--color-ink-dim)] space-y-1">
                      <p>
                        <span className="text-[var(--color-ink)]">เรียนรู้อะไร:</span> {selectedReflections[0].learned}
                      </p>
                      <p>
                        <span className="text-[var(--color-ink)]">นำไปใช้จริง:</span> {selectedReflections[0].real_life_use}
                      </p>
                    </div>
                  </div>
                )}

                {(selected.pre_test || selected.post_test) && (
                  <div>
                    <p className="text-xs text-[var(--color-mint)] mb-2">ผล Pre/Post-test</p>
                    <div className="text-xs text-[var(--color-ink-dim)] space-y-2">
                      <p>
                        {selected.pre_test ? (
                          <>
                            ก่อนเรียน: <span className="text-[var(--color-ink)]">{selected.pre_test.totalScore}/{selected.pre_test.maxScore}</span>
                          </>
                        ) : (
                          'ยังไม่ได้ทำ Pre-test'
                        )}
                        {'   '}
                        {selected.post_test ? (
                          <>
                            · หลังเรียน: <span className="text-[var(--color-ink)]">{selected.post_test.totalScore}/{selected.post_test.maxScore}</span>
                          </>
                        ) : (
                          '· ยังไม่ได้ทำ Post-test'
                        )}
                      </p>
                      {selected.pre_test && selected.post_test && (
                        <div className="space-y-1.5">
                          {(Object.keys(SKILL_LABEL) as AssessmentSkill[]).map((skill) => {
                            const pre = selected.pre_test!.scoreBySkill[skill]
                            const post = selected.post_test!.scoreBySkill[skill]
                            if (!pre || !post) return null
                            const prePct = Math.round((pre.correct / pre.total) * 100)
                            const postPct = Math.round((post.correct / post.total) * 100)
                            return (
                              <p key={skill}>
                                {SKILL_LABEL[skill]}: {prePct}% → <span style={{ color: postPct >= prePct ? 'var(--color-mint)' : 'var(--color-coral)' }}>{postPct}%</span>
                              </p>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-[var(--color-surface-2)]">
                  <RubricEditor studentId={selected.id} />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
