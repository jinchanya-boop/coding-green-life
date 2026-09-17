import { MISSIONS } from '../data/missions'

interface StudentRow {
  id: string
  name: string
  class_name: string
  missions: Record<string, { status: string; bestScore: number; attempts: number }>
}

const SUPPORT_SUGGESTIONS = ['ให้ Hint เพิ่มเติม', 'สอนเสริมแบบ Mini Lesson', 'ลองกิจกรรม Unplugged Coding ก่อน', 'เพิ่ม Extra Challenge ที่ง่ายกว่า', 'จับคู่กับเพื่อน (Peer Support)']

interface Alert {
  studentId: string
  studentName: string
  className: string
  missionTitle: string
  attempts: number
  bestScore: number
  suggestion: string
}

export function InterventionAlerts({ students }: { students: StudentRow[] }) {
  const alerts: Alert[] = []

  students.forEach((s, studentIdx) => {
    MISSIONS.forEach((m, missionIdx) => {
      const state = s.missions?.[m.id]
      if (!state) return
      const stuck = state.attempts >= 3 && state.status !== 'completed'
      if (stuck) {
        alerts.push({
          studentId: s.id,
          studentName: s.name,
          className: s.class_name,
          missionTitle: `${m.code} · ${m.title}`,
          attempts: state.attempts,
          bestScore: state.bestScore,
          suggestion: SUPPORT_SUGGESTIONS[(studentIdx + missionIdx) % SUPPORT_SUGGESTIONS.length],
        })
      }
    })
  })

  if (alerts.length === 0) return null

  return (
    <div className="rounded-xl p-5 border space-y-3" style={{ background: 'rgba(242,118,92,0.06)', borderColor: 'var(--color-coral)' }}>
      <p className="font-display font-medium" style={{ color: 'var(--color-coral)' }}>
        🔔 นักเรียนที่อาจต้องการความช่วยเหลือ ({alerts.length})
      </p>
      <div className="space-y-2">
        {alerts.map((a, i) => (
          <div key={i} className="rounded-lg p-3 text-sm" style={{ background: 'var(--color-surface)' }}>
            <p>
              <span className="font-medium">{a.studentName}</span>
              <span className="text-xs text-[var(--color-ink-dim)]"> ({a.className})</span> — ติดอยู่ที่ {a.missionTitle}
            </p>
            <p className="text-xs text-[var(--color-ink-dim)] mt-0.5">
              ลองแล้ว {a.attempts} ครั้ง คะแนนดีที่สุด {a.bestScore}/100 · แนะนำ: {a.suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
