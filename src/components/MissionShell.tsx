import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { MissionDef } from '../types'
import { AmbientBackground } from './AmbientBackground'

export function MissionShell({ mission, children }: { mission: MissionDef; children: ReactNode }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen eco-grid-bg pb-16 relative">
      <AmbientBackground />
      <header className="border-b border-[var(--color-surface-2)] relative z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/world')}
            className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] text-sm"
            aria-label="กลับไป Green City"
          >
            ← Green City
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-5">
          <p className="text-xs tracking-wide text-[var(--color-mint)]">
            {mission.code} · {mission.gpas} · 3R: {mission.threeR}
          </p>
          <h1 className="font-display text-2xl font-semibold mt-1">{mission.title}</h1>
          <p className="text-sm text-[var(--color-ink-dim)] mt-1">บทบาท: {mission.role}</p>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-5 mt-6 relative z-10">{children}</main>
    </div>
  )
}
