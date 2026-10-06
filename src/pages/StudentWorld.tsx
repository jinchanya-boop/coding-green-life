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
  const { profile, heroLevelName, resetProfile } = useStudent()
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
              ðŸŒ± {profile.greenEnergy}
            </p>
            <p className="text-[10px] text-[var(--color-ink-dim)]">Green Energy</p>
          </div>
          <button
            title="เปลี่ยนผู้เล่น / ออกจากระบบ"
            onClick={() => { if (window.confirm("เปลี่ยนผู้เล่น? ข้อมูลในเครื่องนี้จะถูกล้าง")) { resetProfile(); navigate("/") } }}
            className="ml-2 w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 hover:opacity-80 transition-opacity"
            style={{ background: "rgba(255,100,100,0.12)", border: "1px solid var(--color-coral)" }}
          >
            🚪
          </button>
        </div>
        <div className="max-w-3xl mx-auto px-5 pb-4">
          <StatBar
            label={nextLevel.next ? `XP Â· à¸•à¹ˆà¸­à¹„à¸› ${nextLevel.next}` : 'XP Â· à¸£à¸°à¸”à¸±à¸šà¸ªà¸¹à¸‡à¸ªà¸¸à¸”à¹à¸¥à¹‰à¸§'}
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
            ðŸŽ¨
          </div>
          <div className="flex-1">
            <p className="font-display font-medium">Creator Studio</p>
            <p className="text-xs text-[var(--color-ink-dim)]">à¸ªà¸£à¹‰à¸²à¸‡à¸œà¸¥à¸‡à¸²à¸™à¸­à¸´à¸ªà¸£à¸°à¸‚à¸­à¸‡à¸•à¸±à¸§à¹€à¸­à¸‡ à¹à¸¥à¹‰à¸§à¹ƒà¸«à¹‰à¹€à¸žà¸·à¹ˆà¸­à¸™à¸”à¸¹/à¹ƒà¸«à¹‰ Feedback à¹„à¸”à¹‰</p>
          </div>
          <span className="text-[var(--color-ink-dim)] shrink-0">â†’</span>
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
            ðŸ“
          </div>
          <div className="flex-1">
            <p className="font-display font-medium">Green Portfolio</p>
            <p className="text-xs text-[var(--color-ink-dim)]">à¸£à¸§à¸¡à¸—à¸¸à¸à¸œà¸¥à¸‡à¸²à¸™ à¸„à¸°à¹à¸™à¸™ à¹à¸¥à¸°à¹€à¸«à¸£à¸µà¸¢à¸à¸•à¸£à¸²à¸‚à¸­à¸‡à¹€à¸˜à¸­à¹„à¸§à¹‰à¹ƒà¸™à¸«à¸™à¹‰à¸²à¹€à¸”à¸µà¸¢à¸§</p>
          </div>
          <span className="text-[var(--color-ink-dim)] shrink-0">â†’</span>
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
            ðŸ§ª
          </div>
          <div className="flex-1">
            <p className="font-display font-medium">Coding Lab</p>
            <p className="text-xs text-[var(--color-ink-dim)]">à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¸à¸¶à¸à¸à¸™à¸­à¸´à¸ªà¸£à¸° 7 à¹€à¸¥à¹€à¸§à¸¥ â€” à¹€à¸¥à¹ˆà¸™à¸‹à¹‰à¸³à¹„à¸”à¹‰à¹„à¸¡à¹ˆà¸ˆà¸³à¸à¸±à¸” à¹„à¸¡à¹ˆà¸œà¸¹à¸à¸à¸±à¸šà¸ à¸²à¸£à¸à¸´à¸ˆà¸«à¸¥à¸±à¸</p>
          </div>
          <span className="text-[var(--color-ink-dim)] shrink-0">â†’</span>
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
            ðŸ‘¥
          </div>
          <div className="flex-1">
            <p className="font-display font-medium">à¹€à¸žà¸·à¹ˆà¸­à¸™à¹† à¹„à¸›à¸–à¸¶à¸‡à¹„à¸«à¸™à¹à¸¥à¹‰à¸§</p>
            <p className="text-xs text-[var(--color-ink-dim)]">à¸”à¸¹à¸„à¸§à¸²à¸¡à¸„à¸·à¸šà¸«à¸™à¹‰à¸²à¸‚à¸­à¸‡à¹€à¸žà¸·à¹ˆà¸­à¸™à¸£à¹ˆà¸§à¸¡à¸Šà¸±à¹‰à¸™ â€” à¹€à¸£à¸µà¸¢à¸‡à¸•à¸²à¸¡à¸Šà¸·à¹ˆà¸­ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸­à¸±à¸™à¸”à¸±à¸šà¸„à¸°à¹à¸™à¸™</p>
          </div>
          <span className="text-[var(--color-ink-dim)] shrink-0">â†’</span>
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
              ðŸ“
            </div>
            <div className="flex-1">
              <p className="font-display font-medium">{profile.preTest ? 'à¹à¸šà¸šà¸›à¸£à¸°à¹€à¸¡à¸´à¸™à¸«à¸¥à¸±à¸‡à¹€à¸£à¸µà¸¢à¸™ (Post-test)' : 'à¹à¸šà¸šà¸›à¸£à¸°à¹€à¸¡à¸´à¸™à¸à¹ˆà¸­à¸™à¹€à¸£à¸µà¸¢à¸™ (Pre-test)'}</p>
              <p className="text-xs text-[var(--color-ink-dim)]">
                {profile.preTest
                  ? 'à¸—à¸³à¹€à¸¡à¸·à¹ˆà¸­à¸žà¸£à¹‰à¸­à¸¡ à¹€à¸žà¸·à¹ˆà¸­à¸”à¸¹à¸§à¹ˆà¸²à¸—à¸±à¸à¸©à¸°à¸‚à¸­à¸‡à¹€à¸˜à¸­à¸žà¸±à¸’à¸™à¸²à¹„à¸›à¹à¸„à¹ˆà¹„à¸«à¸™à¸«à¸¥à¸±à¸‡à¸œà¸ˆà¸à¸ à¸±à¸¢'
                  : 'à¸—à¸³à¸à¹ˆà¸­à¸™à¹€à¸£à¸´à¹ˆà¸¡à¸œà¸ˆà¸à¸ à¸±à¸¢ à¹€à¸žà¸·à¹ˆà¸­à¸§à¸±à¸”à¸žà¸·à¹‰à¸™à¸à¸²à¸™à¸—à¸±à¸à¸©à¸°à¸•à¸±à¹‰à¸‡à¸•à¹‰à¸™à¸‚à¸­à¸‡à¹€à¸˜à¸­'}
              </p>
            </div>
            <span className="text-[var(--color-ink-dim)] shrink-0">â†’</span>
          </button>
        )}

        {profile.postTest && (
          <button
            onClick={() => navigate('/survey')}
            className="w-full flex items-center gap-4 rounded-xl p-4 border mb-8 text-left transition-transform hover:scale-[1.01]"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
              style={{ background: 'rgba(94,234,212,0.12)', border: '2px solid var(--color-mint)' }}
            >
              ðŸŒŸ
            </div>
            <div className="flex-1">
              <p className="font-display font-medium">à¹à¸šà¸šà¸ªà¸³à¸£à¸§à¸ˆà¸„à¸§à¸²à¸¡à¸žà¸¶à¸‡à¸žà¸­à¹ƒà¸ˆ</p>
              <p className="text-xs text-[var(--color-ink-dim)]">à¸šà¸­à¸à¸„à¸§à¸²à¸¡à¸£à¸¹à¹‰à¸ªà¸¶à¸à¸‚à¸­à¸‡à¹€à¸˜à¸­à¸—à¸µà¹ˆà¸¡à¸µà¸•à¹ˆà¸­ Coding for Green Life à¹ƒà¸«à¹‰à¸„à¸£à¸¹à¸Ÿà¸±à¸‡à¸«à¸™à¹ˆà¸­à¸¢</p>
            </div>
            <span className="text-[var(--color-ink-dim)] shrink-0">â†’</span>
          </button>
        )}

        <GreenCityBanner />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-semibold sr-only">GREEN CITY</h2>
            <p className="text-sm text-[var(--color-ink-dim)]">
              à¸œà¹ˆà¸²à¸™à¹à¸¥à¹‰à¸§ {completedCount} / {MISSIONS.length} à¸ à¸²à¸£à¸à¸´à¸ˆ
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

