export interface RubricCriterionDef {
  id: string
  label: string
  icon: string
}

export const RUBRIC_CRITERIA: RubricCriterionDef[] = [
  { id: 'computational_thinking', label: 'Computational Thinking', icon: '🧩' },
  { id: 'algorithm', label: 'Algorithm', icon: '🧠' },
  { id: 'coding', label: 'Coding', icon: '💻' },
  { id: 'debugging', label: 'Debugging', icon: '🐞' },
  { id: 'creativity', label: 'Creativity', icon: '🌟' },
  { id: 'problem_solving', label: 'Problem Solving', icon: '🔧' },
  { id: 'responsibility', label: 'Responsibility', icon: '🤝' },
  { id: 'environmental_awareness', label: 'Environmental Awareness', icon: '🌱' },
]

export const RUBRIC_LEVELS = [
  { level: 4, label: 'ดีเยี่ยม' },
  { level: 3, label: 'ดี' },
  { level: 2, label: 'กำลังพัฒนา' },
  { level: 1, label: 'ต้องพัฒนา' },
]

export function rubricLevelDescription(criterionLabel: string, level: number): string {
  switch (level) {
    case 4:
      return `แสดงออกถึง ${criterionLabel} ในระดับดีเยี่ยม อย่างสม่ำเสมอ และเป็นแบบอย่างให้เพื่อนได้`
    case 3:
      return `แสดงออกถึง ${criterionLabel} ในระดับดี มีความเข้าใจชัดเจน ทำได้ถูกต้องเป็นส่วนใหญ่`
    case 2:
      return `เริ่มแสดงออกถึง ${criterionLabel} แต่ยังไม่สม่ำเสมอ ต้องการคำแนะนำเพิ่มเติม`
    default:
      return `ยังไม่แสดงออกถึง ${criterionLabel} ชัดเจน ต้องการการฝึกฝนเพิ่มเติมมาก`
  }
}
