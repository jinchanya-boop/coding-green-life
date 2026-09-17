export type WasteCategory = 'organic' | 'recycle' | 'general' | 'hazardous'

export const CATEGORY_LABEL: Record<WasteCategory, string> = {
  organic: 'ขยะอินทรีย์',
  recycle: 'ขยะรีไซเคิล',
  general: 'ขยะทั่วไป',
  hazardous: 'ขยะอันตราย',
}

export interface WasteItem {
  id: string
  name: string
  emoji: string
  correct: WasteCategory
  hint: string
}

export const WASTE_ITEMS: WasteItem[] = [
  { id: 'w1', name: 'เปลือกส้ม', emoji: '🍊', correct: 'organic', hint: 'ย่อยสลายได้ตามธรรมชาติ' },
  { id: 'w2', name: 'ขวดพลาสติก PET', emoji: '🧴', correct: 'recycle', hint: 'นำไปแปรรูปใหม่ได้' },
  { id: 'w3', name: 'ถ่านไฟฉาย', emoji: '🔋', correct: 'hazardous', hint: 'มีสารเคมีอันตรายปนเปื้อน' },
  { id: 'w4', name: 'ถุงขนมพลาสติกเคลือบฟอยล์', emoji: '🍬', correct: 'general', hint: 'รีไซเคิลยากเพราะเป็นวัสดุผสม' },
  { id: 'w5', name: 'กระดาษ A4 ใช้แล้ว', emoji: '📄', correct: 'recycle', hint: 'เยื่อกระดาษนำกลับมาผลิตใหม่ได้' },
  { id: 'w6', name: 'เศษข้าวและอาหาร', emoji: '🍚', correct: 'organic', hint: 'ทำปุ๋ยหมักได้' },
  { id: 'w7', name: 'หลอดไฟเก่า', emoji: '💡', correct: 'hazardous', hint: 'มีสารปรอทหรือแก้วที่ต้องแยกทิ้งเฉพาะ' },
  { id: 'w8', name: 'กระป๋องอลูมิเนียม', emoji: '🥫', correct: 'recycle', hint: 'โลหะหลอมและนำกลับมาใช้ใหม่ได้ดี' },
]

export interface AnalysisQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
}

// Based on a simulated week of classroom waste-log data the student "collected" during the mission.
export const WEEKLY_DATA = [
  { category: 'ขยะอินทรีย์' as const, count: 42 },
  { category: 'ขยะรีไซเคิล' as const, count: 27 },
  { category: 'ขยะทั่วไป' as const, count: 19 },
  { category: 'ขยะอันตราย' as const, count: 4 },
]

export const ANALYSIS_QUESTIONS: AnalysisQuestion[] = [
  {
    id: 'a1',
    prompt: 'จากข้อมูลขยะที่เก็บได้ 1 สัปดาห์ ขยะประเภทใดมีปริมาณมากที่สุด?',
    options: ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย'],
    correctIndex: 0,
  },
  {
    id: 'a2',
    prompt: 'ถ้าโรงเรียนต้องการลดปริมาณขยะให้ได้ผลมากที่สุด ควรเริ่มแก้ปัญหาจากจุดใดตามข้อมูล?',
    options: [
      'รณรงค์ลดขยะอินทรีย์จากเศษอาหาร เช่น ทำปุ๋ยหมัก',
      'ห้ามนำถ่านไฟฉายเข้าโรงเรียน',
      'เพิ่มถังขยะอันตรายให้มากขึ้น',
      'ไม่ต้องทำอะไร เพราะขยะอันตรายน้อยอยู่แล้ว',
    ],
    correctIndex: 0,
  },
  {
    id: 'a3',
    prompt: 'ขยะอันตรายมีปริมาณน้อยที่สุด แต่ทำไมยังต้องให้ความสำคัญเป็นพิเศษ?',
    options: [
      'เพราะมีผลกระทบต่อสิ่งแวดล้อมและสุขภาพสูง แม้ปริมาณจะน้อย',
      'เพราะกฎหมายบังคับให้นับแยก',
      'เพราะขายได้ราคาแพงที่สุด',
      'เพราะไม่มีเหตุผลพิเศษ',
    ],
    correctIndex: 0,
  },
]
