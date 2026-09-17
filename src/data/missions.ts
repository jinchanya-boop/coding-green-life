import type { GreenHeroLevel, MissionDef } from '../types'

export const MISSIONS: MissionDef[] = [
  {
    id: 'm1',
    order: 1,
    code: 'M01',
    title: 'Green Detective',
    role: 'นักสืบสิ่งแวดล้อม',
    gpas: 'Gathering',
    threeR: 'Re-think',
    learningGoal: 'สำรวจและวิเคราะห์ปัญหาขยะในโรงเรียนด้วยข้อมูลจริง',
    storyIntro:
      'ที่โรงเรียนมีขยะล้นถังทุกวัน แต่ไม่มีใครรู้ว่าขยะแบบไหนเยอะที่สุด และทำไม ภารกิจของเธอคือสวมบทบาทนักสืบสิ่งแวดล้อม เก็บหลักฐาน วิเคราะห์ข้อมูล แล้วสรุปสาเหตุที่แท้จริง',
    maxScore: 100,
  },
  {
    id: 'm2',
    order: 2,
    code: 'M02',
    title: 'Think Before Code',
    role: 'นักวางแผนเชิงระบบ',
    gpas: 'Processing',
    threeR: 'Re-form',
    learningGoal: 'ฝึก Decomposition, Pattern Recognition และ Algorithmic Thinking ก่อนลงมือเขียนโค้ด',
    storyIntro:
      'ก่อนจะแก้ปัญหาขยะด้วยโปรแกรม เธอต้องคิดเป็นขั้นตอนก่อน ห้ามรีบเขียนโค้ดทันที ลองจัดลำดับความคิดของเธอให้เป็นระบบก่อนว่าไปถึงคำตอบได้อย่างไร',
    maxScore: 100,
    unlockRequires: 'm1',
  },
  {
    id: 'm3',
    order: 3,
    code: 'M03',
    title: 'Algorithm Builder',
    role: 'นักออกแบบอัลกอริทึม',
    gpas: 'Processing',
    threeR: 'Re-form',
    learningGoal: 'สร้าง Flowchart และ Algorithm ด้วยบล็อกคำสั่ง',
    storyIntro:
      'ทีมงานเมืองต้องการโปรแกรมช่วยตัดสินใจในสถานการณ์จริง เธอต้องประกอบบล็อกคำสั่ง START, INPUT, PROCESS, IF, ELSE, OUTPUT, END ให้เป็น Algorithm ที่ทำงานได้ถูกต้อง',
    maxScore: 100,
    unlockRequires: 'm2',
  },
  {
    id: 'm4',
    order: 4,
    code: 'M04',
    title: 'Debug Detective',
    role: 'นักสืบบั๊ก',
    gpas: 'Applying 1',
    threeR: 'Re-form',
    learningGoal: 'วิเคราะห์และแก้ไขข้อผิดพลาดในโปรแกรมอย่างเป็นระบบ',
    storyIntro:
      'โปรแกรมของทีมงานเมืองเริ่มมีปัญหา ผลลัพธ์ไม่ตรงกับที่ควรจะเป็น เธอต้อง READ → ANALYZE → FIND BUG → FIX → RUN → REFLECT เพื่อกู้ระบบให้กลับมาทำงานถูกต้อง',
    maxScore: 100,
    unlockRequires: 'm3',
  },
  {
    id: 'm5',
    order: 5,
    code: 'M05',
    title: 'Green Sorter',
    role: 'นักออกแบบเกม',
    gpas: 'Applying 1',
    threeR: 'Responsibility',
    learningGoal: 'เชื่อมโยงเกมแยกขยะเข้ากับตรรกะเงื่อนไข',
    storyIntro:
      'เมืองต้องการระบบคัดแยกขยะที่ทำงานเร็วและแม่นยำ ทดสอบฝีมือคัดแยกขยะให้ทันเวลา แล้วย้อนวิเคราะห์ว่าเกมนี้ใช้หลัก Algorithm อะไรบ้าง',
    maxScore: 100,
    unlockRequires: 'm4',
  },
  {
    id: 'm6',
    order: 6,
    code: 'M06',
    title: 'Code Builder',
    role: 'นักพัฒนา',
    gpas: 'Applying 1',
    threeR: 'Responsibility',
    learningGoal: 'เขียนโปรแกรมจริงด้วย IF, Loop, Variable ใน Sandbox',
    storyIntro:
      'ถึงเวลาลงมือเขียนโปรแกรมจริงแล้ว! ประกอบบล็อกโค้ด SET, FOR EACH, IF-ELSE, และ OUTPUT ให้เป็นโปรแกรมที่ทำงานถูกต้อง แล้วกด RUN เพื่อดูผลลัพธ์จริงจากข้อมูลขยะของเมือง',
    maxScore: 100,
    unlockRequires: 'm5',
  },
  {
    id: 'm7',
    order: 7,
    code: 'M07',
    title: 'Green Game Creator',
    role: 'นักสร้างสรรค์นวัตกรรม',
    gpas: 'Applying 2 / Self-Regulating',
    threeR: 'Responsibility',
    learningGoal: 'สร้างเกมสิ่งแวดล้อมของตนเองตั้งแต่นิยามปัญหาจนถึงนำเสนอผลงาน',
    storyIntro:
      'ภารกิจสุดท้าย! นำทุกทักษะที่เรียนมารวมกัน ตั้งแต่สำรวจปัญหาจนถึงนำเสนอผลงาน สร้างสรรค์เกมสิ่งแวดล้อมของตัวเองครบ 12 ขั้นตอนแบบนักพัฒนาเกมมืออาชีพ',
    maxScore: 100,
    unlockRequires: 'm6',
  },
]

export const LEVEL_THRESHOLDS: { level: GreenHeroLevel; minXp: number }[] = [
  { level: 'GREEN ROOKIE', minXp: 0 },
  { level: 'GREEN EXPLORER', minXp: 100 },
  { level: 'GREEN CODER', minXp: 250 },
  { level: 'GREEN DEBUGGER', minXp: 450 },
  { level: 'GREEN CREATOR', minXp: 700 },
  { level: 'GREEN HERO', minXp: 1000 },
]

export function getHeroLevel(xp: number): GreenHeroLevel {
  let current: GreenHeroLevel = 'GREEN ROOKIE'
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.minXp) current = t.level
  }
  return current
}

export function xpToNextLevel(xp: number): { next: GreenHeroLevel | null; remaining: number; pct: number } {
  const idx = LEVEL_THRESHOLDS.findIndex((t) => xp < t.minXp)
  if (idx === -1) return { next: null, remaining: 0, pct: 100 }
  const prev = LEVEL_THRESHOLDS[idx - 1] ?? LEVEL_THRESHOLDS[0]
  const next = LEVEL_THRESHOLDS[idx]
  const span = next.minXp - prev.minXp
  const progressed = xp - prev.minXp
  return { next: next.level, remaining: next.minXp - xp, pct: Math.round((progressed / span) * 100) }
}
