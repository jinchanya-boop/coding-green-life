import { useNavigate } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'
import { LAB_LEVELS } from '../data/codingLab'
import { AmbientBackground } from '../components/AmbientBackground'

export default function CodingLabHub() {
  const { profile } = useStudent()
  const navigate = useNavigate()

  if (!profile) return null
  const lab = profile.codingLab ?? {}

  return (
    <div className="min-h-screen eco-grid-bg pb-16 relative">
      <AmbientBackground />
      <header className="border-b border-[var(--color-surface-2)] relative z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/world')}
            className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] text-sm"
          >
            ← Green City
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-5">
          <p className="text-xs tracking-wide text-[var(--color-mint)]">พื้นที่ฝึกฝนอิสระ</p>
          <h1 className="font-display text-2xl font-semibold mt-1">🧪 Coding Lab</h1>
          <p className="text-sm text-[var(--color-ink-dim)] mt-1">
            ฝึกทักษะพื้นฐานทีละระดับ ไม่ผูกกับภารกิจหลัก เล่นซ้ำได้ไม่จำกัด
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 space-y-3 relative z-10">
        {LAB_LEVELS.map((lvl) => {
          const state = lab[lvl.id] ?? { status: 'locked', bestScore: 0, attempts: 0 }
          const locked = state.status === 'locked'
          return (
            <button
              key={lvl.id}
              onClick={() => !locked && navigate(`/lab/${lvl.id}`)}
              disabled={locked}
              className="w-full flex items-center gap-4 rounded-xl p-4 border text-left disabled:cursor-not-allowed"
              style={{
                background: 'var(--color-surface)',
                borderColor: state.status === 'completed' ? 'var(--color-gold)' : 'var(--color-surface-3)',
                opacity: locked ? 0.5 : 1,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--color-surface-2)', border: '2px solid var(--color-surface-3)' }}
              >
                {locked ? '🔒' : lvl.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-medium">
                  LEVEL {lvl.order} · {lvl.title}
                </p>
                <p className="text-xs text-[var(--color-ink-dim)]">{lvl.subtitle}</p>
              </div>
              <div className="text-right shrink-0">
                {state.status === 'completed' ? (
                  <span className="text-xs" style={{ color: 'var(--color-gold)' }}>
                    🏅 {state.bestScore}
                  </span>
                ) : locked ? (
                  <span className="text-xs text-[var(--color-ink-faint)]">ล็อกอยู่</span>
                ) : (
                  <span className="text-xs text-[var(--color-mint)]">พร้อมเล่น</span>
                )}
              </div>
            </button>
          )
        })}
      </main>
    </div>
  )
}
