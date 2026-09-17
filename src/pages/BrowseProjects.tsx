import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { PROJECT_TYPES } from '../data/creatorStudioContent'
import { fetchAllProjects, fetchStudents } from '../lib/supabase'
import { useStudent } from '../context/StudentContext'

interface ProjectRow {
  id: string
  student_id: string
  project_type: string
  title: string
}

interface StudentRow {
  id: string
  name: string
}

export default function BrowseProjects() {
  const { profile } = useStudent()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchAllProjects(), fetchStudents()])
      .then(([p, s]) => {
        setProjects(p as ProjectRow[])
        setStudents(s as StudentRow[])
      })
      .finally(() => setLoading(false))
  }, [])

  if (!profile) return null

  const others = projects.filter((p) => p.student_id !== profile.id)
  const nameFor = (id: string) => students.find((s) => s.id === id)?.name ?? 'เพื่อน'
  const typeInfo = (t: string) => PROJECT_TYPES.find((pt) => pt.id === t)

  return (
    <div className="min-h-screen eco-grid-bg pb-16 relative">
      <AmbientBackground />
      <header className="border-b border-[var(--color-surface-2)] relative z-10">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <button onClick={() => navigate('/studio')} className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] text-sm">
            ← Creator Studio
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-5">
          <h1 className="font-display text-2xl font-semibold">ผลงานของเพื่อนๆ</h1>
          <p className="text-sm text-[var(--color-ink-dim)] mt-1">เลือกดูแล้วให้ Feedback กันได้เลย</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 space-y-2.5 relative z-10">
        {loading && <p className="text-xs text-[var(--color-ink-dim)]">กำลังโหลด...</p>}
        {!loading && others.length === 0 && <p className="text-sm text-[var(--color-ink-dim)]">ยังไม่มีผลงานจากเพื่อนเลย</p>}
        {others.map((p) => {
          const t = typeInfo(p.project_type)
          return (
            <button
              key={p.id}
              onClick={() => navigate(`/studio/project/${p.id}`)}
              className="w-full flex items-center gap-3 rounded-xl p-3.5 border text-left"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
            >
              <span className="text-xl">{t?.icon ?? '🎨'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-xs text-[var(--color-ink-dim)]">
                  โดย {nameFor(p.student_id)} · {t?.label}
                </p>
              </div>
              <span className="text-[var(--color-ink-dim)]">→</span>
            </button>
          )
        })}
      </main>
    </div>
  )
}
