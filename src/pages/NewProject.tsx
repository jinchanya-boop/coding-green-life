import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { PROJECT_TYPES, EMPTY_PROJECT_FORM, type ProjectFormFields } from '../data/creatorStudioContent'
import { saveProject } from '../lib/supabase'
import { useStudent } from '../context/StudentContext'

const FIELDS: { key: keyof ProjectFormFields; label: string; placeholder: string }[] = [
  { key: 'problem', label: 'Problem — ปัญหาที่ผลงานนี้อยากแก้', placeholder: 'อธิบายปัญหาที่พบ...' },
  { key: 'goal', label: 'Goal — เป้าหมายของผลงาน', placeholder: 'เป้าหมายที่วัดผลได้...' },
  { key: 'algorithm', label: 'Algorithm — ตรรกะการทำงาน', placeholder: 'อธิบายว่าตัดสินใจอย่างไร...' },
  { key: 'flowchart', label: 'Flowchart — ลำดับขั้นตอน', placeholder: 'START → ... → END' },
  { key: 'codeNotes', label: 'Code — โค้ด/บล็อกที่ใช้', placeholder: 'ใช้คำสั่งอะไรบ้าง เขียนโค้ดคร่าวๆ...' },
  { key: 'testNotes', label: 'Test — ผลการทดสอบ', placeholder: 'ทดสอบแล้วเจอปัญหาอะไร...' },
  { key: 'debugNotes', label: 'Debug — การแก้ไข', placeholder: 'แก้ปัญหาที่เจออย่างไร...' },
  { key: 'improveNotes', label: 'Improvement — การปรับปรุง', placeholder: 'จะปรับปรุงอะไรต่อ...' },
  { key: 'reflection', label: 'Reflection — สะท้อนคิด', placeholder: 'ได้เรียนรู้อะไรจากการทำผลงานนี้...' },
]

export default function NewProject() {
  const { profile } = useStudent()
  const navigate = useNavigate()
  const [form, setForm] = useState<ProjectFormFields>(EMPTY_PROJECT_FORM)
  const [saving, setSaving] = useState(false)

  if (!profile) return null

  const set = <K extends keyof ProjectFormFields>(key: K, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const canSave = form.title.trim().length > 0 && form.problem.trim().length > 3 && form.goal.trim().length > 3

  const handleSave = async () => {
    if (!canSave || saving) return
    setSaving(true)
    const id = crypto.randomUUID()
    try {
      await saveProject({
        id,
        student_id: profile.id,
        project_type: form.projectType,
        title: form.title,
        problem: form.problem,
        goal: form.goal,
        algorithm: form.algorithm,
        flowchart: form.flowchart,
        code_notes: form.codeNotes,
        test_notes: form.testNotes,
        debug_notes: form.debugNotes,
        improve_notes: form.improveNotes,
        reflection: form.reflection,
        updated_at: new Date().toISOString(),
      })
      navigate(`/studio/project/${id}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen eco-grid-bg pb-16 relative">
      <AmbientBackground />
      <header className="border-b border-[var(--color-surface-2)] relative z-10">
        <div className="max-w-2xl mx-auto px-5 py-4">
          <button onClick={() => navigate('/studio')} className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] text-sm">
            ← Creator Studio
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-5">
          <h1 className="font-display text-2xl font-semibold">สร้างผลงานใหม่</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-6 space-y-4 relative z-10">
        <div>
          <label className="block text-xs text-[var(--color-ink-dim)] mb-1.5">ประเภทผลงาน</label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => set('projectType', t.id)}
                className="rounded-full px-3 py-1.5 text-sm border"
                style={{
                  borderColor: form.projectType === t.id ? 'var(--color-mint)' : 'var(--color-surface-3)',
                  background: form.projectType === t.id ? 'rgba(94,234,212,0.15)' : 'var(--color-surface-2)',
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-[var(--color-ink-dim)] mb-1.5">ชื่อผลงาน</label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="เช่น Eco Rush"
            className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-sm"
          />
        </div>

        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs text-[var(--color-ink-dim)] mb-1.5">{f.label}</label>
            <textarea
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              rows={3}
              className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-sm resize-none"
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
          style={{ background: 'var(--color-mint)' }}
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึกผลงาน'}
        </button>
      </main>
    </div>
  )
}
