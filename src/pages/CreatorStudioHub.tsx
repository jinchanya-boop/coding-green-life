import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { Mascot } from '../components/Mascot'
import { PROJECT_TYPES } from '../data/creatorStudioContent'
import { fetchMyProjects, fetchAllProjects, supabaseEnabled } from '../lib/supabase'
import { useStudent } from '../context/StudentContext'

interface ProjectRow {
  id: string
  student_id: string
  project_type: string
  title: string
  updated_at: string
}

export default function CreatorStudioHub() {
  const { profile } = useStudent()
  const navigate = useNavigate()
  const [myProjects, setMyProjects] = useState<ProjectRow[]>([])
  const [peerCount, setPeerCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile || !supabaseEnabled) {
      setLoading(false)
      return
    }
    Promise.all([fetchMyProjects(profile.id), fetchAllProjects()])
      .then(([mine, all]) => {
        setMyProjects(mine as ProjectRow[])
        setPeerCount((all as ProjectRow[]).filter((p) => p.student_id !== profile.id).length)
      })
      .finally(() => setLoading(false))
  }, [profile])

  if (!profile) return null

  const typeIcon = (t: string) => PROJECT_TYPES.find((pt) => pt.id === t)?.icon ?? '🎨'
  const typeLabel = (t: string) => PROJECT_TYPES.find((pt) => pt.id === t)?.label ?? t

  return (
    <div className="min-h-screen eco-grid-bg pb-16 relative">
      <AmbientBackground />
      <header className="border-b border-[var(--color-surface-2)] relative z-10">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <button onClick={() => navigate('/world')} className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] text-sm">
            ← Green City
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-5">
          <p className="text-xs tracking-wide text-[var(--color-mint)]">CREATOR STUDIO</p>
          <h1 className="font-display text-2xl font-semibold mt-1">🎨 พื้นที่สร้างสรรค์ผลงาน</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 space-y-4 relative z-10">
        {!supabaseEnabled && (
          <div className="rounded-xl p-4 border border-[var(--color-coral)] text-sm text-[var(--color-coral)]">
            ต้องเชื่อมต่อ Supabase ก่อนถึงจะสร้างและแชร์ผลงานได้ (ผลงานต้องให้เพื่อนคนอื่นเห็นได้ด้วย)
          </div>
        )}

        <Mascot mood="idle" message="สร้างผลงานอิสระของตัวเองได้เลย! เกม, Animation, นิทานโต้ตอบ, แคมเปญรักษ์โลก หรือไอเดียแก้ปัญหาแบบดิจิทัล" />

        <button
          onClick={() => navigate('/studio/new')}
          disabled={!supabaseEnabled}
          className="w-full rounded-xl py-4 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
          style={{ background: 'var(--color-mint)' }}
        >
          + สร้างผลงานใหม่
        </button>

        <button
          onClick={() => navigate('/studio/browse')}
          disabled={!supabaseEnabled}
          className="w-full flex items-center gap-3 rounded-xl p-4 border disabled:opacity-40"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
        >
          <span className="text-2xl">👀</span>
          <div className="flex-1 text-left">
            <p className="font-display font-medium">ดูผลงานเพื่อนแล้วให้ Feedback</p>
            <p className="text-xs text-[var(--color-ink-dim)]">{peerCount} ผลงานจากเพื่อนร่วมชั้น</p>
          </div>
          <span className="text-[var(--color-ink-dim)]">→</span>
        </button>

        <div>
          <p className="text-sm font-medium mb-2">ผลงานของฉัน</p>
          {loading && <p className="text-xs text-[var(--color-ink-dim)]">กำลังโหลด...</p>}
          {!loading && myProjects.length === 0 && (
            <p className="text-xs text-[var(--color-ink-dim)]">ยังไม่มีผลงาน ลองสร้างชิ้นแรกดูสิ!</p>
          )}
          <div className="space-y-2">
            {myProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/studio/project/${p.id}`)}
                className="w-full flex items-center gap-3 rounded-xl p-3.5 border text-left"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
              >
                <span className="text-xl">{typeIcon(p.project_type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-xs text-[var(--color-ink-dim)]">{typeLabel(p.project_type)}</p>
                </div>
                <span className="text-[var(--color-ink-dim)]">→</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
