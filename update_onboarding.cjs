const fs = require('fs');
let file = 'D:/jinchanya/coding-green-life-phase2/src/pages/Onboarding.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `export default function Onboarding() {
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
  }`;

content = content.replace(/export default function Onboarding\(\) \{[\s\S]*?navigate\('\/world'\)\n  \}/, replacement);

const returnReplacement = `return (
    <div className="min-h-screen eco-grid-bg flex items-center justify-center px-6 py-12 relative">
      <AmbientBackground />
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-[var(--color-bg-deep)] mb-2">Coding Green Life</h1>
            <p className="text-[var(--color-ink-dim)]">พร้อมที่จะเป็นฮีโร่กอบกู้โลกหรือยัง?</p>
          </div>

          <div className="flex gap-2 mb-6 p-1 bg-[var(--color-surface-2)] rounded-xl">
            <button
              onClick={() => setMode('name')}
              className={\`flex-1 py-2 text-sm font-medium rounded-lg transition-colors \${mode === 'name' ? 'bg-white shadow-sm text-[var(--color-bg-deep)]' : 'text-[var(--color-ink-dim)] hover:text-[var(--color-bg-deep)]'}\`}
            >
              สร้างโปรไฟล์ / พิมพ์ชื่อ
            </button>
            <button
              onClick={() => { setMode('code'); setCodeError(false); }}
              className={\`flex-1 py-2 text-sm font-medium rounded-lg transition-colors \${mode === 'code' ? 'bg-white shadow-sm text-[var(--color-bg-deep)]' : 'text-[var(--color-ink-dim)] hover:text-[var(--color-bg-deep)]'}\`}
            >
              เข้าสู่ระบบด้วยรหัส
            </button>
          </div>

          {mode === 'code' ? (
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-[var(--color-ink-dim)] mb-2">
                  รหัสผู้เล่น (6 หลัก)
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setCodeError(false); }}
                  placeholder="เช่น เด4860 หรือ กั2848"
                  className={\`w-full px-4 py-3 rounded-xl bg-[var(--color-surface-1)] border focus:outline-none transition-colors \${codeError ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-[var(--color-mint)]'}\`}
                />
                {codeError && (
                  <p className="mt-2 text-sm text-red-500 font-medium">ไม่พบรหัสผู้เล่นนี้ กรุณาตรวจสอบอีกครั้ง</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-[var(--color-ink-dim)] mb-2">
                  ชื่อ-นามสกุล หรือ ชื่อเล่น
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น ด.ช.รักษ์โลก รักษาดี"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-1)] border border-transparent focus:border-[var(--color-mint)] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-ink-dim)] mb-2">
                  ชั้นเรียน
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="เช่น ม.1/1"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-1)] border border-transparent focus:border-[var(--color-mint)] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-ink-dim)] mb-3">
                  เลือกอวาตาร์
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {AVATARS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAvatar(a.id)}
                      className="flex flex-col items-center gap-1.5 rounded-xl py-3 transition-colors"
                      style={{
                        background: avatar === a.id ? \`\${a.color}1A\` : 'transparent',
                        border: \`1.5px solid \${avatar === a.id ? a.color : 'var(--color-surface-3)'}\`,
                      }}
                    >
                      <Avatar id={a.id} size={40} />
                      <span className="text-xs text-[var(--color-ink-dim)]">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={(mode === 'name' ? !canStartName : !canStartCode) || isStarting}
            className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ background: 'var(--color-mint)' }}
          >
            {isStarting ? 'กำลังค้นหาข้อมูล...' : (mode === 'code' ? 'เข้าสู่ระบบ' : 'เริ่มภารกิจ')}
          </button>
        </div>
      </div>
    </div>
  )
}
`;

content = content.replace(/return \([\s\S]*\}\s*$/m, returnReplacement);

fs.writeFileSync(file, content, 'utf8');
console.log("Updated Onboarding UI with code login option");
