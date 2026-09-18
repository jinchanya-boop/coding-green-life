export interface SatisfactionItem {
  id: 'funScore' | 'understandingScore' | 'selfMotivationScore' | 'realLifeScore' | 'overallScore'
  label: string
}

export const SATISFACTION_ITEMS: SatisfactionItem[] = [
  { id: 'funScore', label: 'ความสนุกในการเรียนรู้ผ่านเกม Coding for Green Life' },
  { id: 'understandingScore', label: 'ความเข้าใจเนื้อหาที่ง่ายขึ้นเมื่อเรียนด้วยรูปแบบนี้' },
  { id: 'selfMotivationScore', label: 'ความอยากเรียนรู้และฝึกฝนเพิ่มเติมด้วยตนเอง' },
  { id: 'realLifeScore', label: 'สามารถนำความรู้ที่ได้ไปใช้ในชีวิตจริงได้' },
  { id: 'overallScore', label: 'ความพึงพอใจโดยรวมต่อแพลตฟอร์ม Coding for Green Life' },
]

export const SATISFACTION_LEVELS = [
  { value: 1, label: 'น้อยที่สุด' },
  { value: 2, label: 'น้อย' },
  { value: 3, label: 'ปานกลาง' },
  { value: 4, label: 'มาก' },
  { value: 5, label: 'มากที่สุด' },
]
