import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { Avatar } from '../components/Avatar'
import { supabaseEnabled, fetchStudents } from '../lib/supabase'
import { MISSIONS, getHeroLevel } from '../data/missions'
import type { AvatarId } from '../types'

interface StudentRow {
  id: string
  name: string
  class_name: string
  avatar: string
  xp: number
  missions: Record<string, { status: string }>
  badges: unknown[]
  updated_at: string
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'ตอนนี้'
  if (mins < 60) return `${mins} นาทีที่แล้ว`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ชม.ที่แล้ว`
  const days = Math.floor(hours / 24)
  return `${days} วันที่แล้ว`
}

export default function ClassProgress() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabaseEnabled) {
      setLoading(false)
      return
    }
    fetchStudents()
      .then((s) => setStudents(s as StudentRow[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'โหลดข้อมูลไม่สำเร็จ'))
      .finally(() => setLoading(false))
  }, [])

  if (!supabaseEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-md text-center space-y-3">
          <p className="text-4xl">🔌</p>
          <h1 className="font-display text-xl font-semibold text-[var(--color-ink)]">ยังไม่ได้เชื่อมต่อ Supabase</h1>
          <p className="text-sm text-[var(--color-ink-dim)]">บอร์ดนี้ต้องดึงข้อมูลเพื่อนร่วมชั้นจากฐานข้อมูลกลาง กรุณาตั้งค่า .env ก่อน</p>
        </div>
      </div>
    )
  }

  // Sorted by name — deliberately NOT ranked by score/XP, so this stays a
  // progress board rather than a competitive leaderboard.
  const sorted = [...students].sort((a, b) => a.name.localeCompare(b.name, 'th'))

  return (
    <div className="min-h-screen pb-16 relative" style={{ background: 'var(--color-bg)' }}>
      <AmbientBackground />
      <header className="border-b border-[var(--color-surface-2)] relative z-10 px-6 py-5">
        <button onClick={() => navigate('/world')} className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] text-sm">
          ← Green City
        </button>
        <p className="text-xs tracking-wide text-[var(--color-mint)] mt-3">CLASS PROGRESS</p>
        <h1 className="font-display text-2xl font-semibold mt-1 text-[var(--color-ink)]">เพื่อนๆ ไปถึงไหนกันแล้ว</h1>
        <p className="text-sm text-[var(--color-ink-dim)] mt-1">เรียงตามชื่อ ไม่ใช่อันดับคะแนน — มาให้กำลังใจกันเถอะ!</p>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 space-y-3 relative z-10">
        {loading && <p className="text-[var(--color-ink-dim)] text-sm">กำลังโหลด...</p>}
        {error && <p className="text-[var(--color-coral)] text-sm">เกิดข้อผิดพลาด: {error}</p>}

        {!loading &&
          !error &&
          sorted.map((s) => {
            const completed = Object.values(s.missions ?? {}).filter((m) => m.status === 'completed').length
            const pct = Math.round((completed / MISSIONS.length) * 100)
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-xl p-3.5 border"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
              >
                <Avatar id={s.avatar as AvatarId} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="font-display font-medium truncate text-[var(--color-ink)]">{s.name}</p>
                    <span className="text-xs text-[var(--color-ink-faint)] shrink-0">{s.class_name}</span>
                  </div>
                  <p className="text-xs mb-1.5" style={{ color: 'var(--color-gold)' }}>
                    {getHeroLevel(s.xp)}
                  </p>
                  <div className="h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--color-mint)' }} />
                  </div>
                </div>
                <div className="text-right shrink-0 text-xs text-[var(--color-ink-dim)]">
                  <p>
                    {completed}/{MISSIONS.length} ด่าน
                  </p>
                  <p className="text-[var(--color-ink-faint)] mt-0.5">{timeAgo(s.updated_at)}</p>
                </div>
              </div>
            )
          })}

        {!loading && !error && sorted.length === 0 && (
          <p className="text-center text-[var(--color-ink-dim)] py-8">ยังไม่มีใครเข้ามาเล่นเลย เป็นคนแรกกันเถอะ!</p>
        )}
      </main>
    </div>
  )
}
