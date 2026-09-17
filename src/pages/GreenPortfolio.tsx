import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { Avatar } from '../components/Avatar'
import { MISSIONS } from '../data/missions'
import { LAB_LEVELS } from '../data/codingLab'
import { PROJECT_TYPES } from '../data/creatorStudioContent'
import { SKILL_LABEL } from '../data/assessmentContent'
import { fetchMyProjects, supabaseEnabled } from '../lib/supabase'
import { useStudent } from '../context/StudentContext'
import type { AssessmentSkill } from '../types'

interface ProjectRow {
  id: string
  project_type: string
  title: string
}

export default function GreenPortfolio() {
  const { profile, heroLevelName } = useStudent()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectRow[]>([])

  useEffect(() => {
    if (profile && supabaseEnabled) {
      fetchMyProjects(profile.id).then((p) => setProjects(p as ProjectRow[]))
    }
  }, [profile])

  if (!profile) return null

  const completedMissions = MISSIONS.filter((m) => profile.missions[m.id]?.status === 'completed')
  const completedLab = LAB_LEVELS.filter((l) => profile.codingLab?.[l.id]?.status === 'completed')

  return (
    <div className="min-h-screen eco-grid-bg pb-16 relative">
      <AmbientBackground />
      <header className="border-b border-[var(--color-surface-2)] relative z-10">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <button onClick={() => navigate('/world')} className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] text-sm">
            ← Green City
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 space-y-5 relative z-10">
        {/* Profile header */}
        <div className="rounded-2xl p-6 text-center border-2" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-gold)' }}>
          <div className="flex justify-center mb-3">
            <Avatar id={profile.avatar} size={72} />
          </div>
          <p className="font-display text-2xl font-bold">{profile.name}</p>
          <p className="text-sm text-[var(--color-ink-dim)]">{profile.className}</p>
          <p className="text-sm mt-1.5 font-display font-medium" style={{ color: 'var(--color-gold)' }}>
            {heroLevelName}
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div>
              <p className="font-display font-semibold text-[var(--color-mint)]">{profile.xp}</p>
              <p className="text-xs text-[var(--color-ink-dim)]">XP</p>
            </div>
            <div>
              <p className="font-display font-semibold" style={{ color: 'var(--color-gold)' }}>
                {profile.greenEnergy}
              </p>
              <p className="text-xs text-[var(--color-ink-dim)]">Green Energy</p>
            </div>
            <div>
              <p className="font-display font-semibold">{profile.badges.length}</p>
              <p className="text-xs text-[var(--color-ink-dim)]">Badges</p>
            </div>
          </div>
        </div>

        {/* Pre/Post assessment */}
        {(profile.preTest || profile.postTest) && (
          <div>
            <p className="text-sm font-medium mb-2">📝 แบบประเมินทักษะ</p>
            <div className="rounded-lg p-3.5 space-y-2.5" style={{ background: 'var(--color-surface)' }}>
              {!profile.postTest && profile.preTest && (
                <p className="text-sm">
                  <span className="text-[var(--color-ink-dim)]">ก่อนเรียน:</span>{' '}
                  <span style={{ color: 'var(--color-gold)' }}>
                    {profile.preTest.totalScore}/{profile.preTest.maxScore}
                  </span>
                  <span className="text-xs text-[var(--color-ink-faint)]"> — ยังไม่ได้ทำแบบประเมินหลังเรียน</span>
                </p>
              )}
              {profile.preTest && profile.postTest && (
                <>
                  <p className="text-sm">
                    <span className="text-[var(--color-ink-dim)]">ก่อนเรียน:</span> {profile.preTest.totalScore}/{profile.preTest.maxScore}
                    {'  →  '}
                    <span className="text-[var(--color-ink-dim)]">หลังเรียน:</span>{' '}
                    <span style={{ color: 'var(--color-mint)' }}>
                      {profile.postTest.totalScore}/{profile.postTest.maxScore}
                    </span>
                  </p>
                  <div className="space-y-2 pt-1">
                    {(Object.keys(SKILL_LABEL) as AssessmentSkill[]).map((skill) => {
                      const pre = profile.preTest!.scoreBySkill[skill]
                      const post = profile.postTest!.scoreBySkill[skill]
                      if (!pre || !post) return null
                      const prePct = Math.round((pre.correct / pre.total) * 100)
                      const postPct = Math.round((post.correct / post.total) * 100)
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
                          <div className="relative h-1.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
                            <div className="absolute h-full rounded-full bg-[var(--color-ink-faint)] opacity-40" style={{ width: `${prePct}%` }} />
                            <div className="absolute h-full rounded-full" style={{ width: `${postPct}%`, background: 'var(--color-mint)', opacity: 0.85 }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">🏅 เหรียญตรา</p>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((b) => (
                <div
                  key={b.id}
                  title={b.name}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-surface-3)' }}
                >
                  <span>{b.icon}</span>
                  <span>{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missions */}
        <div>
          <p className="text-sm font-medium mb-2">
            🗺️ ภารกิจที่สำเร็จแล้ว ({completedMissions.length}/{MISSIONS.length})
          </p>
          <div className="space-y-1.5">
            {completedMissions.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm rounded-lg p-2.5" style={{ background: 'var(--color-surface)' }}>
                <span className="text-[var(--color-ink-dim)]">
                  {m.code} · {m.title}
                </span>
                <span style={{ color: 'var(--color-mint)' }}>{profile.missions[m.id].bestScore}/100</span>
              </div>
            ))}
            {completedMissions.length === 0 && <p className="text-xs text-[var(--color-ink-faint)]">ยังไม่มีภารกิจที่สำเร็จ</p>}
          </div>
        </div>

        {/* Coding Lab */}
        {completedLab.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">
              🧪 Coding Lab ที่ผ่านแล้ว ({completedLab.length}/{LAB_LEVELS.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {completedLab.map((l) => (
                <span key={l.id} className="text-xs rounded-full px-3 py-1.5 border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-surface-3)' }}>
                  {l.icon} {l.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        <div>
          <p className="text-sm font-medium mb-2">🎨 ผลงานสร้างสรรค์ ({projects.length})</p>
          {projects.length === 0 ? (
            <p className="text-xs text-[var(--color-ink-faint)]">ยังไม่มีผลงาน ลองไปสร้างที่ Creator Studio ดูสิ!</p>
          ) : (
            <div className="space-y-1.5">
              {projects.map((p) => {
                const t = PROJECT_TYPES.find((pt) => pt.id === p.project_type)
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/studio/project/${p.id}`)}
                    className="w-full flex items-center gap-2.5 text-sm rounded-lg p-2.5 text-left"
                    style={{ background: 'var(--color-surface)' }}
                  >
                    <span>{t?.icon ?? '🎨'}</span>
                    <span>{p.title}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Reflections */}
        {profile.reflections.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">💭 สะท้อนคิดล่าสุด</p>
            <div className="rounded-lg p-3.5 text-sm space-y-1" style={{ background: 'var(--color-surface)' }}>
              <p className="text-[var(--color-ink-dim)]">{profile.reflections[profile.reflections.length - 1].learned}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
