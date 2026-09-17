import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabaseEnabled, fetchStudents, fetchAttempts } from '../lib/supabase'
import { MISSIONS } from '../data/missions'
import { SKILL_LABEL } from '../data/assessmentContent'
import type { AssessmentSkill } from '../types'

interface StudentRow {
  id: string
  name: string
  class_name: string
  missions: Record<string, { status: string; bestScore: number }>
  pre_test?: { scoreBySkill: Record<AssessmentSkill, { correct: number; total: number }>; totalScore: number; maxScore: number } | null
  post_test?: { scoreBySkill: Record<AssessmentSkill, { correct: number; total: number }>; totalScore: number; maxScore: number } | null
}

interface AttemptRow {
  mission_id: string
  error_types: string[]
}

const PROBLEM_STATEMENTS = [
  'นักเรียนมีทักษะการใช้เทคโนโลยีระดับ User แต่ยังขาดทักษะระดับ Creator',
  'นักเรียนขาดแรงจูงใจในการเรียน Coding',
  'นักเรียนมีปัญหาในการคิดวิเคราะห์และคิดอย่างเป็นระบบ',
  'นักเรียนไม่สามารถเชื่อมโยงความรู้เรื่อง Coding กับปัญหาในชีวิตจริงได้',
  'นักเรียนมีปัญหาในการออกแบบ Algorithm และแก้บั๊กอย่างเป็นขั้นตอน',
]

export default function EvidenceReport() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [attempts, setAttempts] = useState<AttemptRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseEnabled) {
      setLoading(false)
      return
    }
    Promise.all([fetchStudents(), fetchAttempts()])
      .then(([s, a]) => {
        setStudents(s as StudentRow[])
        setAttempts(a as AttemptRow[])
      })
      .finally(() => setLoading(false))
  }, [])

  if (!supabaseEnabled) {
    return <p className="p-6 text-[var(--color-ink-dim)]">ต้องเชื่อมต่อ Supabase ก่อน</p>
  }
  if (loading) return <p className="p-6 text-[var(--color-ink-dim)]">กำลังโหลด...</p>

  const withBoth = students.filter((s) => s.pre_test && s.post_test)
  const skills = Object.keys(SKILL_LABEL) as AssessmentSkill[]
  const skillAvg = (skill: AssessmentSkill, key: 'pre_test' | 'post_test') => {
    if (withBoth.length === 0) return 0
    const total = withBoth.reduce((sum, s) => {
      const t = s[key]!
      const sk = t.scoreBySkill[skill]
      return sum + (sk ? (sk.correct / sk.total) * 100 : 0)
    }, 0)
    return Math.round(total / withBoth.length)
  }

  const completedCount = (s: StudentRow) => Object.values(s.missions ?? {}).filter((m) => m.status === 'completed').length
  const classCompletionRate = students.length
    ? Math.round((students.reduce((sum, s) => sum + completedCount(s), 0) / (students.length * MISSIONS.length)) * 100)
    : 0

  const topErrorTypes = attempts
    .flatMap((a) => a.error_types)
    .reduce<Record<string, number>>((acc, e) => {
      acc[e] = (acc[e] ?? 0) + 1
      return acc
    }, {})
  const commonMistakes = Object.entries(topErrorTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-white text-gray-900 print:p-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
      <div className="no-print border-b px-6 py-4 flex items-center justify-between bg-gray-50">
        <button onClick={() => navigate('/teacher')} className="text-sm text-gray-600">
          ← กลับ Teacher Dashboard
        </button>
        <button onClick={() => window.print()} className="rounded-lg px-4 py-2 text-sm font-medium bg-emerald-600 text-white">
          🖨️ พิมพ์ / บันทึกเป็น PDF
        </button>
      </div>

      <main className="max-w-3xl mx-auto px-8 py-10 space-y-8">
        <div className="text-center border-b pb-6">
          <p className="text-sm text-emerald-700 font-medium">EVIDENCE OF LEARNING</p>
          <h1 className="text-2xl font-bold mt-1">Coding for Green Life</h1>
          <p className="text-sm text-gray-500 mt-1">รายงานหลักฐานการเรียนรู้ — ระดับชั้นมัธยมศึกษาปีที่ 2</p>
          <p className="text-xs text-gray-400 mt-1">พิมพ์เมื่อ {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-emerald-700 mb-2">1. นวัตกรรมนี้แก้ปัญหาอะไร?</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            {PROBLEM_STATEMENTS.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-emerald-700 mb-2">2. แก้ปัญหาอย่างไร?</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            ออกแบบแพลตฟอร์มเกมการเรียนรู้ 7 ภารกิจ ครอบคลุม Computational Thinking, Algorithm, Coding, Debugging และ Creativity
            ผสาน Game-Based Learning กับ GPAS 5 Steps และหลัก 3R (Re-think, Re-form, Responsibility) พร้อมพื้นที่ฝึกฝนอิสระ
            (Coding Lab), พื้นที่สร้างสรรค์ผลงาน (Creator Studio), และระบบ Peer Feedback ให้ผู้เรียนแลกเปลี่ยนเรียนรู้กัน
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-emerald-700 mb-2">3. ผู้เรียนเปลี่ยนแปลงอย่างไร? (มีข้อมูลอะไรยืนยัน)</h2>
          <div className="grid grid-cols-3 gap-4 my-4">
            <div className="text-center p-3 rounded-lg bg-emerald-50">
              <p className="text-2xl font-bold text-emerald-700">{students.length}</p>
              <p className="text-xs text-gray-600">นักเรียนที่เข้าร่วม</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-emerald-50">
              <p className="text-2xl font-bold text-emerald-700">{classCompletionRate}%</p>
              <p className="text-xs text-gray-600">อัตราการทำภารกิจสำเร็จเฉลี่ย</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-emerald-50">
              <p className="text-2xl font-bold text-emerald-700">{withBoth.length}</p>
              <p className="text-xs text-gray-600">คนที่ทำ Pre+Post ครบ</p>
            </div>
          </div>

          {withBoth.length > 0 && (
            <table className="w-full text-sm border-collapse mt-3">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2">ทักษะ</th>
                  <th className="text-right py-2">ก่อนเรียน</th>
                  <th className="text-right py-2">หลังเรียน</th>
                  <th className="text-right py-2">เปลี่ยนแปลง</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((sk) => {
                  const pre = skillAvg(sk, 'pre_test')
                  const post = skillAvg(sk, 'post_test')
                  return (
                    <tr key={sk} className="border-b border-gray-200">
                      <td className="py-2">{SKILL_LABEL[sk]}</td>
                      <td className="text-right py-2">{pre}%</td>
                      <td className="text-right py-2 font-medium">{post}%</td>
                      <td className={`text-right py-2 font-medium ${post >= pre ? 'text-emerald-600' : 'text-red-500'}`}>
                        {post - pre >= 0 ? '+' : ''}
                        {post - pre}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </section>

        {commonMistakes.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-emerald-700 mb-2">ข้อผิดพลาดที่พบบ่อย (จากข้อมูลจริง)</h2>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              {commonMistakes.map(([err], i) => (
                <li key={i}>{err} ({topErrorTypes[err]} ครั้ง)</li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold text-emerald-700 mb-2">4. ผลงานของนักเรียนเปลี่ยนแปลงอย่างไร?</h2>
          <p className="text-sm text-gray-700">
            นักเรียนผ่านภารกิจเฉลี่ย {classCompletionRate}% ของทั้งหมด {MISSIONS.length} ภารกิจ ตั้งแต่การสำรวจปัญหาสิ่งแวดล้อม
            (Mission 1) ไปจนถึงการออกแบบและนำเสนอเกมสิ่งแวดล้อมของตนเอง (Mission 7) พร้อมผลงานสร้างสรรค์อิสระใน Creator
            Studio ที่ผ่านการรับ Peer Feedback จากเพื่อนร่วมชั้น
          </p>
        </section>

        <p className="text-xs text-gray-400 text-center pt-6 border-t">
          รายงานนี้สร้างจากข้อมูลจริงที่บันทึกในระบบ Coding for Green Life — โรงเรียนสา
        </p>
      </main>
    </div>
  )
}
