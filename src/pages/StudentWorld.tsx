import { useNavigate } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'
import { Avatar } from '../components/Avatar'
import { StatBar } from '../components/StatBar'
import { MissionNode } from '../components/MissionNode'
import { GreenCityBanner } from '../components/GreenCityBanner'
import { AmbientBackground } from '../components/AmbientBackground'
import { AssessmentSummary } from '../components/AssessmentSummary'
import { MISSIONS, xpToNextLevel } from '../data/missions'

const ALIGN_PATTERN: Array<'left' | 'center' | 'right'> = ['left', 'right', 'center']

export default function StudentWorld() {
  const { profile, heroLevelName } = useStudent()
  const navigate = useNavigate()

  if (!profile) return null

  const nextLevel = xpToNextLevel(profile.xp)
  const completedCount = Object.values(profile.missions).filter((m) => m.status === 'completed').length

  return (
    <div className="min-h-screen eco-grid-bg pb-16 relative">
      <AmbientBackground />
      <header className="sticky top-0 z-10 backdrop-blur bg-[var(--color-bg)]/85 border-b border-[var(--color-surface-2)]">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
          <Avatar id={profile.avatar} size={52} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="font-display font-semibold truncate">{profile.name}</h1>
              <span className="text-xs text-[var(--color-ink-dim)] shrink-0">{profile.className}</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-gold)' }}>
              {heroLevelName}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display font-semibold" style={{ color: 'var(--color-mint)' }}>
              🌱 {profile.greenEnergy}
            </p>
            <p className="text-[10px] text-[var(--color-ink-dim)]">Green Energy</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-5 pb-4">
          <StatBar
            label={nextLevel.next ? `XP · ต่อไป ${nextLevel.next}` : 'XP · ระดับสูงสุดแล้ว'}
            value={profile.xp}
            max={profile.xp + (nextLevel.remaining || 1)}
            color="var(--color-gold)"
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 mt-8 relative z-10">
        <button
          onClick={() => navigate('/studio')}
          className="w-full flex items-center gap-4 rounded-xl p-4 border mb-3 text-left transition-transform hover:scale-[1.01]"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'rgba(244,185,66,0.12)', border: '2px solid var(--color-gold)' }}
          >
            🎨
          </div>
          <div className="flex-1">
            <p className="font-display font-medium">Creator Studio</p>
            <p className="text-xs text-[var(--color-ink-dim)]">สร้างผลงานอิสระของตัวเอง แล้วให้เพื่อนดู/ให้ Feedback ได้</p>
          </div>
          <span className="text-[var(--color-ink-dim)] shrink-0">→</span>
        </button>

        <button
          onClick={() => navigate('/portfolio')}
          className="w-full flex items-center gap-4 rounded-xl p-4 border mb-3 text-left transition-transform hover:scale-[1.01]"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'rgba(94,234,212,0.12)', border: '2px solid var(--color-mint)' }}
          >
            📁
          </div>
          <div className="flex-1">
            <p className="font-display font-medium">Green Portfolio</p>
            <p className="text-xs text-[var(--color-ink-dim)]">รวมทุกผลงาน คะแนน และเหรียญตราของเธอไว้ในหน้าเดียว</p>
          </div>
          <span className="text-[var(--color-ink-dim)] shrink-0">→</span>
        </button>

        <button
          onClick={() => navigate('/lab')}
          className="w-full flex items-center gap-4 rounded-xl p-4 border mb-3 text-left transition-transform hover:scale-[1.01]"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'rgba(94,234,212,0.12)', border: '2px solid var(--color-mint)' }}
          >
            🧪
          </div>
          <div className="flex-1">
            <p className="font-display font-medium">Coding Lab</p>
            <p className="text-xs text-[var(--color-ink-dim)]">พื้นที่ฝึกฝนอิสระ 7 เลเวล — เล่นซ้ำได้ไม่จำกัด ไม่ผูกกับภารกิจหลัก</p>
          </div>
          <span className="text-[var(--color-ink-dim)] shrink-0">→</span>
        </button>

        <button
          onClick={() => navigate('/progress')}
          className="w-full flex items-center gap-4 rounded-xl p-4 border mb-8 text-left transition-transform hover:scale-[1.01]"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'rgba(168,181,174,0.12)', border: '2px solid var(--color-ink-dim)' }}
          >
            👥
          </div>
          <div className="flex-1">
            <p className="font-display font-medium">เพื่อนๆ ไปถึงไหนแล้ว</p>
            <p className="text-xs text-[var(--color-ink-dim)]">ดูความคืบหน้าของเพื่อนร่วมชั้น — เรียงตามชื่อ ไม่ใช่อันดับคะแนน</p>
          </div>
          <span className="text-[var(--color-ink-dim)] shrink-0">→</span>
        </button>

        {profile.preTest && profile.postTest ? (
          <AssessmentSummary pre={profile.preTest} post={profile.postTest} />
        ) : (
          <button
            onClick={() => navigate(profile.preTest ? '/assessment/post' : '/assessment/pre')}
            className="w-full flex items-center gap-4 rounded-xl p-4 border mb-8 text-left transition-transform hover:scale-[1.01]"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
              style={{ background: 'rgba(244,185,66,0.12)', border: '2px solid var(--color-gold)' }}
            >
              📝
            </div>
            <div className="flex-1">
              <p className="font-display font-medium">{profile.preTest ? 'แบบประเมินหลังเรียน (Post-test)' : 'แบบประเมินก่อนเรียน (Pre-test)'}</p>
              <p className="text-xs text-[var(--color-ink-dim)]">
                {profile.preTest
                  ? 'ทำเมื่อพร้อม เพื่อดูว่าทักษะของเธอพัฒนาไปแค่ไหนหลังผจญภัย'
                  : 'ทำก่อนเริ่มผจญภัย เพื่อวัดพื้นฐานทักษะตั้งต้นของเธอ'}
              </p>
            </div>
            <span className="text-[var(--color-ink-dim)] shrink-0">→</span>
          </button>
        )}

        <GreenCityBanner />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-semibold sr-only">GREEN CITY</h2>
            <p className="text-sm text-[var(--color-ink-dim)]">
              ผ่านแล้ว {completedCount} / {MISSIONS.length} ภารกิจ
            </p>
          </div>
          {profile.badges.length > 0 && (
            <div className="flex -space-x-2">
              {profile.badges.slice(-4).map((b) => (
                <div
                  key={b.id}
                  title={b.name}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--color-surface-2)] border-2 border-[var(--color-bg)]"
                >
                  {b.icon}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex flex-col gap-10 py-4">
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden sm:block"
            style={{ background: 'var(--color-surface-3)' }}
            aria-hidden
          />
          {MISSIONS.map((mission, i) => {
            const state = profile.missions[mission.id]
            return (
              <MissionNode
                key={mission.id}
                mission={mission}
                state={state}
                align={ALIGN_PATTERN[i % ALIGN_PATTERN.length]}
                onClick={() => {
                  if (state.status === 'locked') return
                  if (['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'].includes(mission.id)) {
                    navigate(`/mission/${mission.id}`)
                  }
                }}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}
