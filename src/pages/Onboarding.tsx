import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'
import { Avatar, AVATARS } from '../components/Avatar'
import { AmbientBackground } from '../components/AmbientBackground'
import type { AvatarId } from '../types'

export default function Onboarding() {
  const { createProfile } = useStudent()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [avatar, setAvatar] = useState<AvatarId>('fern')

  const canStart = name.trim().length >= 2 && className.trim().length >= 1

  const handleStart = () => {
    if (!canStart) return
    createProfile(name, className, avatar)
    navigate('/world')
  }

  return (
    <div className="min-h-screen eco-grid-bg flex items-center justify-center px-6 py-12 relative">
      <AmbientBackground />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <p className="font-display text-[var(--color-mint)] tracking-wide text-sm mb-2">GREEN CITY ต้อนรับเธอ</p>
          <h1 className="font-display text-3xl font-semibold leading-tight">
            Coding <span className="text-[var(--color-mint)]">for</span> Green Life
          </h1>
          <p className="text-[var(--color-ink-dim)] text-sm mt-3">
            สร้างตัวละครของเธอ แล้วเริ่มภารกิจกู้เมืองด้วยพลังของการคิดเชิงคำนวณ
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl p-6 space-y-5 border border-[var(--color-surface-3)]">
          <div>
            <label className="block text-sm text-[var(--color-ink-dim)] mb-1.5">ชื่อเล่นของเธอ</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ปันปัน"
              className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-[var(--color-ink)]"
              maxLength={30}
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--color-ink-dim)] mb-1.5">ชั้นเรียน</label>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="เช่น ม.2/3"
              className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-[var(--color-ink)]"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--color-ink-dim)] mb-2">เลือกตัวละคร</label>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAvatar(a.id)}
                  className="flex flex-col items-center gap-1.5 rounded-xl py-3 transition-colors"
                  style={{
                    background: avatar === a.id ? `${a.color}1A` : 'transparent',
                    border: `1.5px solid ${avatar === a.id ? a.color : 'var(--color-surface-3)'}`,
                  }}
                >
                  <Avatar id={a.id} size={40} />
                  <span className="text-xs text-[var(--color-ink-dim)]">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ background: 'var(--color-mint)' }}
          >
            เริ่มภารกิจ
          </button>

          <button
            onClick={() => navigate('/teacher')}
            className="w-full text-center mt-4 text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink-dim)]"
          >
            สำหรับครู
          </button>
        </div>
      </div>
    </div>
  )
}
