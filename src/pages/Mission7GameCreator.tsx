import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MissionShell } from '../components/MissionShell'
import { Mascot } from '../components/Mascot'
import { MISSIONS } from '../data/missions'
import { BLOCK_CHIP_OPTIONS, CREATOR_STEPS, EMPTY_ANSWERS, FIELD_EXAMPLES, type CreatorAnswers } from '../data/mission7Content'
import { useStudent } from '../context/StudentContext'

const mission = MISSIONS.find((m) => m.id === 'm7')!

export default function Mission7GameCreator() {
  const navigate = useNavigate()
  const { recordMissionResult } = useStudent()
  const [started, setStarted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<CreatorAnswers>(EMPTY_ANSWERS)
  const [startedAt] = useState(() => Date.now())
  const [done, setDone] = useState(false)

  const step = CREATOR_STEPS[stepIndex]
  const isLastStep = stepIndex === CREATOR_STEPS.length - 1

  const set = <K extends keyof CreatorAnswers>(key: K, value: CreatorAnswers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }))

  const toggleBlock = (field: 'algorithmBlocks' | 'codeBlocks', block: string) => {
    setAnswers((prev) => {
      const list = prev[field]
      const next = list.includes(block) ? list.filter((b) => b !== block) : [...list, block]
      return { ...prev, [field]: next }
    })
  }

  const canProceed = (): boolean => {
    switch (step.id) {
      case 'problem':
        return answers.problem.trim().length > 3
      case 'data':
        return answers.data.trim().length > 3
      case 'goal':
        return answers.goal.trim().length > 3
      case 'decompose':
        return answers.decompose.trim().length > 3
      case 'algorithm':
        return answers.algorithmBlocks.length > 0 && answers.algorithmDesc.trim().length > 3
      case 'flowchart':
        return answers.flowchart.trim().length > 3
      case 'gamedesign':
        return answers.gameName.trim().length > 0 && answers.gameRules.trim().length > 3 && answers.gamePlayerGoal.trim().length > 3
      case 'code':
        return answers.codeBlocks.length > 0 && answers.codeDesc.trim().length > 3
      case 'test':
        return answers.test.trim().length > 3
      case 'debug':
        return answers.debug.trim().length > 3
      case 'improve':
        return answers.improve.trim().length > 3
      default:
        return true
    }
  }

  const handleNext = () => {
    if (isLastStep) {
      const timeSeconds = Math.round((Date.now() - startedAt) / 1000)
      recordMissionResult(
        'm7',
        {
          score: 100,
          maxScore: 100,
          correctCount: CREATOR_STEPS.length,
          wrongCount: 0,
          errorTypes: [],
          timeSeconds,
        },
        {
          learned: `ออกแบบอัลกอริทึมเกม: ${answers.algorithmDesc}`,
          problem: answers.problem,
          solution: `${answers.gameName} — ${answers.gameRules}`,
          mistake: answers.test,
          improve: answers.improve,
          realLifeUse: answers.goal,
        }
      )
      setDone(true)
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  const [ideaCycle, setIdeaCycle] = useState<Record<string, number>>({})
  const [copied, setCopied] = useState(false)

  const aiPrompt = `ช่วยเขียนเว็บเกมง่ายๆ ด้วย HTML, CSS และ JavaScript ในไฟล์เดียว ให้รันได้จริงในเบราว์เซอร์ทันทีที่เปิดไฟล์

ชื่อเกม: ${answers.gameName || '-'}
ปัญหาที่อยากแก้: ${answers.problem || '-'}
เป้าหมายของเกม: ${answers.goal || '-'}
กติกาการเล่น: ${answers.gameRules || '-'}
เป้าหมายของผู้เล่น: ${answers.gamePlayerGoal || '-'}
ตรรกะการทำงาน (Algorithm): ${answers.algorithmDesc || '-'}
ลำดับขั้นตอน (Flowchart): ${answers.flowchart || '-'}
คำสั่งโปรแกรมมิ่งที่อยากให้ใช้: ${[...new Set([...answers.algorithmBlocks, ...answers.codeBlocks])].join(', ') || 'ตามความเหมาะสม'}

กรุณาเขียนโค้ดที่ใช้งานได้จริง และช่วยเขียนคอมเมนต์กำกับสั้นๆ ในโค้ดว่าแต่ละส่วนตรงกับหลักการคอมพิวเตอร์อะไรบ้าง (เช่น ตรงไหนคือ FOR EACH ตรงไหนคือ IF-ELSE) เพื่อให้นักเรียนชั้นมัธยมต้นเข้าใจง่าย`

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(aiPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable; the textarea above still lets the student select-and-copy manually
    }
  }

  const applyRandomIdea = (field: keyof CreatorAnswers) => {
    const examples = FIELD_EXAMPLES[field as string]
    if (!examples || examples.length === 0) return
    const cur = ideaCycle[field as string] ?? -1
    const next = (cur + 1) % examples.length
    setIdeaCycle((prev) => ({ ...prev, [field as string]: next }))
    set(field, examples[next] as CreatorAnswers[typeof field])
  }

  const ExampleChips = ({ field }: { field: keyof CreatorAnswers }) => {
    const examples = FIELD_EXAMPLES[field as string]
    if (!examples || examples.length === 0) return null
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--color-ink-dim)]">💡 คิดไม่ออก? แตะตัวอย่างเพื่อเริ่มต้น แล้วค่อยแก้ไขได้</p>
          <button
            type="button"
            onClick={() => applyRandomIdea(field)}
            className="text-xs shrink-0 rounded-full px-2.5 py-1 border"
            style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}
          >
            🎲 สุ่มตัวอย่าง
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => set(field, ex as CreatorAnswers[typeof field])}
              className="text-xs rounded-full px-3 py-1.5 border text-left"
              style={{ borderColor: 'var(--color-surface-3)', background: 'var(--color-surface-2)', color: 'var(--color-ink-dim)' }}
            >
              {ex.length > 36 ? ex.slice(0, 36) + '…' : ex}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const textarea = (field: keyof CreatorAnswers, placeholder: string, rows = 3) => (
    <div className="space-y-2">
      <ExampleChips field={field} />
      <textarea
        value={answers[field] as string}
        onChange={(e) => set(field, e.target.value as CreatorAnswers[typeof field])}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-sm resize-none"
      />
    </div>
  )

  const renderStepBody = () => {
    switch (step.id) {
      case 'problem':
        return textarea('problem', 'เช่น นักเรียนทิ้งขยะไม่ถูกถังในโรงอาหาร...')
      case 'data':
        return textarea('data', 'เช่น สังเกตว่าถังขยะรีไซเคิลมีขยะทั่วไปปนอยู่เกือบทุกวัน...')
      case 'goal':
        return textarea('goal', 'เช่น ลดขยะปนเปื้อนผิดถังให้เหลือต่ำกว่า 10%...')
      case 'decompose':
        return textarea('decompose', '1. สำรวจปัญหา 2. ออกแบบเกม 3. ทดสอบกับเพื่อน ...', 4)
      case 'algorithm':
        return (
          <div className="space-y-3">
            <p className="text-xs text-[var(--color-ink-dim)]">
              1) แตะเลือกบล็อกคำสั่งที่คิดว่าจะใช้ในเกมนี้ (เลือกได้หลายอัน) 2) อธิบายเป็นคำพูดในช่องด้านล่างว่าเกมจะตัดสินถูก-ผิดอย่างไร
            </p>
            <div className="flex flex-wrap gap-2">
              {BLOCK_CHIP_OPTIONS.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBlock('algorithmBlocks', b)}
                  className="font-mono text-xs rounded-full px-3 py-1.5 border"
                  style={{
                    borderColor: answers.algorithmBlocks.includes(b) ? 'var(--color-mint)' : 'var(--color-surface-3)',
                    background: answers.algorithmBlocks.includes(b) ? 'rgba(94,234,212,0.15)' : 'var(--color-surface-2)',
                    color: answers.algorithmBlocks.includes(b) ? 'var(--color-mint)' : 'var(--color-ink-dim)',
                  }}
                >
                  {answers.algorithmBlocks.includes(b) ? '✓ ' : ''}
                  {b}
                </button>
              ))}
            </div>
            {textarea('algorithmDesc', 'อธิบายว่าตรรกะการตัดสินถูก-ผิดของเกมทำงานอย่างไร...')}
          </div>
        )
      case 'flowchart':
        return textarea('flowchart', 'START → ผู้เล่นเห็นขยะ → เลือกถัง → ตรวจถูกผิด → ให้คะแนน → END', 4)
      case 'gamedesign':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[var(--color-ink-dim)] mb-1.5">ชื่อเกม</label>
              <ExampleChips field="gameName" />
              <input
                value={answers.gameName}
                onChange={(e) => set('gameName', e.target.value)}
                placeholder="เช่น Eco Rush"
                className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-sm mt-2"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--color-ink-dim)] mb-1.5">กติกาเกม</label>
              {textarea('gameRules', 'อธิบายวิธีเล่นสั้นๆ...')}
            </div>
            <div>
              <label className="block text-xs text-[var(--color-ink-dim)] mb-1.5">เป้าหมายของผู้เล่น</label>
              {textarea('gamePlayerGoal', 'ผู้เล่นต้องทำอะไรให้สำเร็จ...')}
            </div>
          </div>
        )
      case 'code':
        return (
          <div className="space-y-3">
            <p className="text-xs text-[var(--color-ink-dim)]">
              1) แตะเลือกบล็อกคำสั่งที่จะใช้เขียนโปรแกรมนี้จริง (เลือกได้หลายอัน) 2) อธิบายว่าจะใช้บล็อกเหล่านี้ทำส่วนไหนของเกม
            </p>
            <div className="flex flex-wrap gap-2">
              {BLOCK_CHIP_OPTIONS.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBlock('codeBlocks', b)}
                  className="font-mono text-xs rounded-full px-3 py-1.5 border"
                  style={{
                    borderColor: answers.codeBlocks.includes(b) ? 'var(--color-gold)' : 'var(--color-surface-3)',
                    background: answers.codeBlocks.includes(b) ? 'rgba(244,185,66,0.15)' : 'var(--color-surface-2)',
                    color: answers.codeBlocks.includes(b) ? 'var(--color-gold)' : 'var(--color-ink-dim)',
                  }}
                >
                  {answers.codeBlocks.includes(b) ? '✓ ' : ''}
                  {b}
                </button>
              ))}
            </div>
            {textarea('codeDesc', 'อธิบายว่าจะใช้บล็อกเหล่านี้เขียนโปรแกรมส่วนไหนของเกม...')}
          </div>
        )
      case 'test':
        return textarea('test', 'เช่น เพื่อนอาจกดเร็วเกินจนดูขยะไม่ทัน...')
      case 'debug':
        return textarea('debug', 'เช่น ปรับเวลาให้ดูขยะนานขึ้นในด่านแรกๆ...')
      case 'improve':
        return textarea('improve', 'เช่น เพิ่มเสียงเอฟเฟกต์ หรือระบบคะแนนคอมโบ...')
      case 'present': {
        const usedBlocks = [...new Set([...answers.algorithmBlocks, ...answers.codeBlocks])]
        return (
          <div className="space-y-4 text-sm">
            {/* Game box mockup — a taste of what the finished game could look like */}
            <div
              className="rounded-2xl p-6 text-center space-y-3 border-2"
              style={{
                background: 'linear-gradient(160deg, rgba(94,234,212,0.15), rgba(244,185,66,0.12))',
                borderColor: 'var(--color-mint)',
              }}
            >
              <div className="text-5xl">🎮</div>
              <p className="font-display text-2xl font-bold">{answers.gameName || '(ยังไม่ตั้งชื่อเกม)'}</p>
              <p className="text-xs text-[var(--color-ink-dim)]">สร้างสรรค์โดย GREEN CREATOR</p>
              <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                {usedBlocks.map((b) => (
                  <span
                    key={b}
                    className="font-mono text-[10px] rounded-full px-2 py-1"
                    style={{ background: 'rgba(0,0,0,0.25)', color: 'var(--color-mint)' }}
                  >
                    {b}
                  </span>
                ))}
              </div>
              <div className="rounded-lg p-3 text-xs text-left" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <p>🎯 {answers.gamePlayerGoal || '—'}</p>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)] space-y-2.5">
              <p><span className="text-[var(--color-mint)]">ปัญหา:</span> {answers.problem}</p>
              <p><span className="text-[var(--color-mint)]">เป้าหมาย:</span> {answers.goal}</p>
              <p><span className="text-[var(--color-mint)]">กติกา:</span> {answers.gameRules}</p>
              <p><span className="text-[var(--color-mint)]">อัลกอริทึม:</span> {answers.algorithmDesc}</p>
              <p><span className="text-[var(--color-mint)]">แผนปรับปรุง:</span> {answers.improve}</p>
            </div>

            <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)] space-y-3">
              <p className="font-display font-medium">🤖 อยากให้เกมนี้เล่นได้จริง? ลองให้ AI ช่วยเขียนโค้ด!</p>
              <p className="text-xs text-[var(--color-ink-dim)]">
                กดคัดลอกข้อความด้านล่าง แล้วนำไปวางถามผู้ช่วย AI (เช่น Claude หรือแอป AI ที่โรงเรียนใช้) เพื่อขอโค้ดเกมของเธอจริงๆ
              </p>
              <textarea
                readOnly
                value={aiPrompt}
                rows={6}
                className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3 py-2 text-xs font-mono resize-none"
              />
              <button
                onClick={handleCopyPrompt}
                className="w-full rounded-lg py-2.5 text-sm font-medium border"
                style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}
              >
                {copied ? '✅ คัดลอกแล้ว! นำไปวางถาม AI ได้เลย' : '📋 คัดลอกพรอมต์นี้'}
              </button>
            </div>

            <p className="text-xs text-[var(--color-ink-dim)]">พร้อมนำเสนอผลงานนี้ให้เพื่อนหรือครูดูได้เลย! กดปุ่มด้านล่างเพื่อส่งงาน</p>
          </div>
        )
      }
      default:
        return null
    }
  }

  if (!started) {
    return (
      <MissionShell mission={mission}>
        <div className="space-y-5">
          <Mascot mood="idle" message="ถึงเวลาสร้างเกมสิ่งแวดล้อมของตัวเองแล้ว! เราจะไปทีละขั้นด้วยกัน ครบ 12 ขั้นตอนเหมือนนักพัฒนาเกมมืออาชีพ" />
          <p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">{mission.storyIntro}</p>
          <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
            <p className="text-sm font-medium mb-1">เป้าหมายการเรียนรู้</p>
            <p className="text-sm text-[var(--color-ink-dim)]">{mission.learningGoal}</p>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
            style={{ background: 'var(--color-mint)' }}
          >
            เริ่มสร้างเกม!
          </button>
        </div>
      </MissionShell>
    )
  }

  if (done) {
    return (
      <MissionShell mission={mission}>
        <div className="text-center space-y-5 py-8">
          <div className="text-5xl">🏆</div>
          <p className="font-display text-2xl font-semibold">คะแนน 100 / 100</p>
          <p className="text-sm text-[var(--color-ink-dim)]">
            ยินดีด้วย! เธอสร้างสรรค์เกมสิ่งแวดล้อมของตัวเองครบทั้ง 12 ขั้นตอน — เธอคือ GREEN CREATOR แล้ว!
          </p>
          <button
            onClick={() => navigate('/world')}
            className="rounded-lg px-6 py-3 font-display font-medium text-[var(--color-bg-deep)]"
            style={{ background: 'var(--color-mint)' }}
          >
            กลับสู่ Green City
          </button>
        </div>
      </MissionShell>
    )
  }

  return (
    <MissionShell mission={mission}>
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between text-xs text-[var(--color-ink-dim)] mb-1.5">
            <span>ขั้นที่ {step.order} / {CREATOR_STEPS.length}</span>
            <span>{Math.round((stepIndex / (CREATOR_STEPS.length - 1)) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${(stepIndex / (CREATOR_STEPS.length - 1)) * 100}%`, background: 'var(--color-mint)' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl">{step.icon}</span>
          <h2 className="font-display text-lg font-semibold">{step.title}</h2>
        </div>
        <p className="text-sm text-[var(--color-ink-dim)]">{step.prompt}</p>

        {renderStepBody()}

        <div className="flex gap-3">
          {stepIndex > 0 && (
            <button
              onClick={() => setStepIndex((i) => i - 1)}
              className="rounded-lg py-3 px-4 text-sm border border-[var(--color-surface-3)] text-[var(--color-ink-dim)]"
            >
              ← ย้อนกลับ
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
            style={{ background: 'var(--color-mint)' }}
          >
            {isLastStep ? 'ส่งผลงาน 🏆' : 'ถัดไป →'}
          </button>
        </div>
      </div>
    </MissionShell>
  )
}
