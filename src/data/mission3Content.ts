export type BlockType = 'START' | 'INPUT' | 'PROCESS' | 'IF' | 'ELSE' | 'OUTPUT' | 'END'

export interface AlgoBlock {
  id: string
  type: BlockType
  label: string
}

export interface AlgorithmScenario {
  id: string
  title: string
  storySetup: string
  // The pool the student picks from, in a scrambled offer order (includes 1-2 distractors).
  pool: AlgoBlock[]
  // The one fully-correct solution (order matters). Used only for validation, not shown to the student.
  solution: BlockType[]
}

export const ALGORITHM_SCENARIOS: AlgorithmScenario[] = [
  {
    id: 'algo1',
    title: 'ตรวจสอบเวลาเข้าเรียน',
    storySetup:
      'ระบบต้องรับเวลาที่นักเรียนมาถึงโรงเรียน แล้วตัดสินใจว่ามาตรงเวลาหรือมาสาย (ตรงเวลา = มาถึงก่อนหรือเท่ากับ 08:00 น.)',
    pool: [
      { id: 'b1', type: 'START', label: 'START' },
      { id: 'b2', type: 'INPUT', label: 'INPUT: เวลาที่มาถึง' },
      { id: 'b3', type: 'IF', label: 'IF: เวลา ≤ 08:00 น.?' },
      { id: 'b4', type: 'OUTPUT', label: 'OUTPUT: "มาตรงเวลา"' },
      { id: 'b5', type: 'ELSE', label: 'ELSE' },
      { id: 'b6', type: 'OUTPUT', label: 'OUTPUT: "มาสาย"' },
      { id: 'b7', type: 'END', label: 'END' },
      { id: 'b8', type: 'PROCESS', label: 'PROCESS: คำนวณค่าเฉลี่ยรายเดือน' },
    ],
    solution: ['START', 'INPUT', 'IF', 'OUTPUT', 'ELSE', 'OUTPUT', 'END'],
  },
  {
    id: 'algo2',
    title: 'คัดแยกขยะรีไซเคิลได้หรือไม่',
    storySetup:
      'รับชื่อวัสดุของขยะ 1 ชิ้น ประมวลผลเพื่อเทียบกับรายการวัสดุรีไซเคิลได้ แล้วแจ้งผลว่ารีไซเคิลได้หรือไม่',
    pool: [
      { id: 'c1', type: 'START', label: 'START' },
      { id: 'c2', type: 'INPUT', label: 'INPUT: ชื่อวัสดุ' },
      { id: 'c3', type: 'PROCESS', label: 'PROCESS: เทียบกับรายการวัสดุรีไซเคิลได้' },
      { id: 'c4', type: 'IF', label: 'IF: อยู่ในรายการหรือไม่?' },
      { id: 'c5', type: 'OUTPUT', label: 'OUTPUT: "รีไซเคิลได้"' },
      { id: 'c6', type: 'ELSE', label: 'ELSE' },
      { id: 'c7', type: 'OUTPUT', label: 'OUTPUT: "รีไซเคิลไม่ได้"' },
      { id: 'c8', type: 'END', label: 'END' },
      { id: 'c9', type: 'INPUT', label: 'INPUT: น้ำหนักขยะ' },
    ],
    solution: ['START', 'INPUT', 'PROCESS', 'IF', 'OUTPUT', 'ELSE', 'OUTPUT', 'END'],
  },
]
