import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { Mascot } from '../components/Mascot'
import { SATISFACTION_ITEMS, SATISFACTION_LEVELS } from '../data/satisfactionContent'
import { submitSatisfactionSurvey, fetchMySatisfactionSurvey, supabaseEnabled } from '../lib/supabase'
import { useStudent } from '../context/StudentContext'

export default function SatisfactionSurvey() {
  const { profile } = useStudent()
  const navigate = useNavigate()
  const [scores, setScores] = useState<Record<string, number>>({})
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [alreadyDone, setAlreadyDone] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!profile || !supabaseEnabled) {
      setLoading(false)
      return
    }
    fetchMySatisfactionSurvey(profile.id)
      .then((row) => {
        if (row) setAlreadyDone(true)
      })
      .finally(() => setLoading(false))
  }, [profile])

  if (!profile) return null

  const allAnswered = SATISFACTION_ITEMS.every((it) => scores[it.id] >= 1)

  const handleSubmit = async () => {
    if (!allAnswered) return
    await submitSatisfactionSurvey({
      student_id: profile.id,
      fun_score: scores.funScore,
      understanding_score: scores.understandingScore,
      self_motivation_score: scores.selfMotivationScore,
      real_life_score: scores.realLifeScore,
      overall_score: scores.overallScore,
      comment,
    })
    setSubmitted(true)
  }

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
          <p className="text-xs tracking-wide text-[var(--color-mint)]">SATISFACTION SURVEY</p>
          <h1 className="font-display text-2xl font-semibold mt-1">แบบสำรวจความพึงพอใจ</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 space-y-5 relative z-10">
        {!supabaseEnabled && (
          <p className="text-sm text-[var(--color-coral)]">ต้องเชื่อมต่อ Supabase ก่อนถึงจะบันทึกผลได้</p>
        )}
        {loading && <p className="text-sm text-[var(--color-ink-dim)]">กำลังโหลด...</p>}

        {!loading && (alreadyDone || submitted) && (
          <div className="text-center space-y-4 py-8">
            <div className="text-5xl">🌟</div>
            <Mascot mood="great" message="ขอบคุณที่สละเวลาตอบแบบสำรวจนะ! ความเห็นของเธอช่วยให้ครูปรับปรุงแพลตฟอร์มนี้ให้ดีขึ้นได้" />
            <button
              onClick={() => navigate('/world')}
              className="rounded-lg px-6 py-3 font-display font-medium text-[var(--color-bg-deep)]"
              style={{ background: 'var(--color-mint)' }}
            >
              กลับสู่ Green City
            </button>
          </div>
        )}

        {!loading && !alreadyDone && !submitted && (
          <>
            <Mascot mood="idle" message="บอกความรู้สึกของเธอที่มีต่อ Coding for Green Life หน่อยนะ ไม่มีคำตอบผิด ตอบตามความรู้สึกจริงได้เลย!" />
            {SATISFACTION_ITEMS.map((item) => (
              <div key={item.id} className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
                <p className="text-sm font-medium mb-3">{item.label}</p>
                <div className="flex justify-between gap-1.5">
                  {SATISFACTION_LEVELS.map((lvl) => {
                    const active = scores[item.id] === lvl.value
                    return (
                      <button
                        key={lvl.value}
                        onClick={() => setScores((s) => ({ ...s, [item.id]: lvl.value }))}
                        className="flex-1 flex flex-col items-center gap-1 rounded-lg py-2.5 border text-[10px]"
                        style={{
                          borderColor: active ? 'var(--color-gold)' : 'var(--color-surface-3)',
                          background: active ? 'rgba(244,185,66,0.15)' : 'var(--color-surface-2)',
                          color: active ? 'var(--color-gold)' : 'var(--color-ink-dim)',
                        }}
                      >
                        <span className="text-base font-display font-semibold">{lvl.value}</span>
                        {lvl.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            <div>
              <label className="block text-xs text-[var(--color-ink-dim)] mb-1.5">ความคิดเห็นเพิ่มเติม (ไม่บังคับ)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="อยากให้ปรับปรุงอะไรเพิ่มเติมไหม..."
                className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-sm resize-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
              style={{ background: 'var(--color-mint)' }}
            >
              ส่งแบบสำรวจ
            </button>
          </>
        )}
      </main>
    </div>
  )
}
