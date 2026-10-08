import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'
import { Avatar, AVATARS } from '../components/Avatar'
import { AmbientBackground } from '../components/AmbientBackground'
import type { AvatarId } from '../types'

export default function Onboarding() {
  const { createProfile, loginWithCode } = useStudent()
  const navigate = useNavigate()
  
  const [mode, setMode] = useState<'name' | 'code'>('name')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)

  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [avatar, setAvatar] = useState<AvatarId>('fern')

  const canStartName = name.trim().length >= 2 && className.trim().length >= 1
  const canStartCode = code.trim().length >= 6

  const [isStarting, setIsStarting] = useState(false);
  
  const handleStart = async () => {
    if (isStarting) return
    setIsStarting(true);
    setCodeError(false);
    
    if (mode === 'code') {
      if (!canStartCode) { setIsStarting(false); return; }
      const success = await loginWithCode(code);
      if (success) {
        navigate('/world')
      } else {
        setCodeError(true)
        setIsStarting(false)
      }
    } else {
      if (!canStartName) { setIsStarting(false); return; }
      await createProfile(name, className, avatar)
      navigate('/world')
    }
  }

  return (
    <div className="min-h-screen eco-grid-bg flex items-center justify-center px-6 py-12 relative">
      <AmbientBackground />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <p className="font-display text-[var(--color-mint)] tracking-wide text-sm mb-2">GREEN CITY HEROES</p>
          <h1 className="font-display text-3xl font-semibold leading-tight text-white">
            Coding <span className="text-[var(--color-mint)]">for</span> Green Life
          </h1>
          <p className="text-[var(--color-ink-dim)] text-sm mt-3">
            พร้อมที่จะเป็นฮีโร่กอบกู้โลกหรือยัง?
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl p-6 space-y-5 border border-[var(--color-surface-3)]">
          
          <div className="flex gap-2 mb-2 p-1 bg-[var(--color-surface-2)] rounded-xl">
            <button
              onClick={() => setMode('name')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'name' ? 'bg-[var(--color-mint)] text-[var(--color-bg-deep)] shadow-sm' : 'text-[var(--color-ink-dim)] hover:text-white'}`}
            >
              สร้างโปรไฟล์ / พิมพ์ชื่อ
            </button>
            <button
              onClick={() => { setMode('code'); setCodeError(false); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'code' ? 'bg-[var(--color-mint)] text-[var(--color-bg-deep)] shadow-sm' : 'text-[var(--color-ink-dim)] hover:text-white'}`}
            >
              เข้าสู่ระบบด้วยรหัส
            </button>
          </div>

          {mode === 'code' ? (
            <div>
              <label className="block text-sm text-[var(--color-ink-dim)] mb-1.5">รหัสผู้เล่น (6 หลัก)</label>
              <input
                value={code}
                onChange={(e) => { setCode(e.target.value); setCodeError(false); }}
                placeholder="เช่น เด4860 หรือ กั2848"
                className={`w-full rounded-lg bg-[var(--color-surface-2)] border px-3.5 py-2.5 outline-none text-[var(--color-ink)] transition-colors ${codeError ? 'border-red-500 focus:border-red-400' : 'border-[var(--color-surface-3)] focus:border-[var(--color-mint)]'}`}
                maxLength={6}
              />
              {codeError && (
                <p className="mt-2 text-sm text-red-400">ไม่พบรหัสผู้เล่นนี้ กรุณาตรวจสอบอีกครั้ง</p>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm text-[var(--color-ink-dim)] mb-1.5">ชื่อ-นามสกุล หรือ ชื่อเล่น</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น ด.ช.รักษ์โลก รักษาดี"
                  className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-[var(--color-ink)]"
                  maxLength={30}
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-ink-dim)] mb-1.5">ชั้นเรียน</label>
                <input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="เช่น ม.1/1"
                  className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-[var(--color-ink)]"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-ink-dim)] mb-2">เลือกอวาตาร์</label>
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
            </>
          )}

          <button
            onClick={handleStart}
            disabled={(mode === 'name' ? !canStartName : !canStartCode) || isStarting}
            className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ background: 'var(--color-mint)' }}
          >
            {isStarting ? 'กำลังค้นหาข้อมูล...' : (mode === 'code' ? 'เข้าสู่ระบบ' : 'เริ่มภารกิจ')}
          </button>

          <button
            onClick={() => navigate('/teacher')}
            className="w-full text-center mt-4 text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink-dim)] block"
          >
            สำหรับผู้สอน
          </button>
        </div>
      </div>
    </div>
  )
}