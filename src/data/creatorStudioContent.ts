export interface ProjectTypeDef {
  id: string
  label: string
  icon: string
}

export const PROJECT_TYPES: ProjectTypeDef[] = [
  { id: 'game', label: 'เกม', icon: '🎮' },
  { id: 'animation', label: 'Animation', icon: '🎬' },
  { id: 'interactive_story', label: 'Interactive Story', icon: '📖' },
  { id: 'green_campaign', label: 'Green Campaign', icon: '📣' },
  { id: 'digital_solution', label: 'Digital Solution', icon: '💡' },
]

export interface ProjectFormFields {
  title: string
  projectType: string
  problem: string
  goal: string
  algorithm: string
  flowchart: string
  codeNotes: string
  testNotes: string
  debugNotes: string
  improveNotes: string
  reflection: string
}

export const EMPTY_PROJECT_FORM: ProjectFormFields = {
  title: '',
  projectType: 'game',
  problem: '',
  goal: '',
  algorithm: '',
  flowchart: '',
  codeNotes: '',
  testNotes: '',
  debugNotes: '',
  improveNotes: '',
  reflection: '',
}

export const FEEDBACK_CRITERIA = [
  { id: 'clarityScore', label: 'ความเข้าใจง่าย' },
  { id: 'funScore', label: 'ความสนุก' },
  { id: 'correctnessScore', label: 'ความถูกต้อง' },
  { id: 'creativityScore', label: 'ความคิดสร้างสรรค์' },
  { id: 'problemSolvingScore', label: 'การแก้ปัญหา' },
  { id: 'envBenefitScore', label: 'ประโยชน์ต่อสิ่งแวดล้อม' },
] as const
