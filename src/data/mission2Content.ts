// Mission 2 activities are built around Computational Thinking's four pillars.
// Each activity forces the student to think in steps BEFORE any coding mission appears.

export interface DecompositionStep {
  id: string
  text: string
  correctOrder: number
}

// Scenario: reduce plastic waste in the school canteen — decompose the big goal into ordered sub-steps.
export const DECOMPOSITION_SCENARIO = {
  goal: 'ลดปริมาณขยะพลาสติกในโรงอาหาร',
  steps: [
    { id: 'd1', text: 'สำรวจและนับจำนวนขยะพลาสติกที่เกิดขึ้นต่อวัน', correctOrder: 1 },
    { id: 'd2', text: 'วิเคราะห์ว่าพลาสติกส่วนใหญ่มาจากอะไร (แก้ว หลอด ถุง กล่อง)', correctOrder: 2 },
    { id: 'd3', text: 'ตั้งเป้าหมายที่วัดผลได้ เช่น ลดขยะพลาสติกลง 30% ภายใน 1 เดือน', correctOrder: 3 },
    { id: 'd4', text: 'ออกแบบวิธีแก้ เช่น รณรงค์ใช้แก้วส่วนตัว', correctOrder: 4 },
    { id: 'd5', text: 'ทดลองใช้วิธีแก้ในโรงอาหารจริงและเก็บข้อมูลผล', correctOrder: 5 },
    { id: 'd6', text: 'ประเมินผลเทียบกับเป้าหมาย และปรับปรุงวิธีการ', correctOrder: 6 },
  ],
}

export interface PatternQuestion {
  id: string
  prompt: string
  sequence: string[]
  options: string[]
  correctIndex: number
  explain: string
}

export const PATTERN_QUESTIONS: PatternQuestion[] = [
  {
    id: 'p1',
    prompt: 'สังเกตรูปแบบของถังขยะที่ต้องเทประจำสัปดาห์ ช่องว่างถัดไปควรเป็นถังใด?',
    sequence: ['อินทรีย์', 'รีไซเคิล', 'อินทรีย์', 'รีไซเคิล', 'อินทรีย์', '?'],
    options: ['อินทรีย์', 'รีไซเคิล', 'ทั่วไป', 'อันตราย'],
    correctIndex: 1,
    explain: 'รูปแบบสลับกัน 2 ประเภทซ้ำเป็นคู่ ช่องถัดไปจึงเป็นรีไซเคิล',
  },
  {
    id: 'p2',
    prompt: 'ทุกครั้งที่ปริมาณขยะอินทรีย์เพิ่มขึ้น 10 กก. จะผลิตปุ๋ยหมักได้ 2 กก. ถ้าเก็บขยะอินทรีย์ได้ 50 กก. จะได้ปุ๋ยกี่ กก. ตามรูปแบบเดิม?',
    sequence: ['10kg → 2kg', '20kg → 4kg', '30kg → 6kg', '50kg → ?'],
    options: ['8 กก.', '10 กก.', '12 กก.', '5 กก.'],
    correctIndex: 1,
    explain: 'อัตราส่วนคือ 5:1 ดังนั้น 50 หาร 5 เท่ากับ 10 กก.',
  },
]

export interface AbstractionQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explain: string
}

export const ABSTRACTION_QUESTIONS: AbstractionQuestion[] = [
  {
    id: 'ab1',
    prompt:
      'เมื่อออกแบบระบบ "แยกขยะอัตโนมัติ" ข้อมูลใดสำคัญที่สุดที่ต้องเก็บไว้ในระบบ (ตัดรายละเอียดที่ไม่จำเป็นออก)',
    options: [
      'ประเภทขยะ และน้ำหนัก/จำนวนของแต่ละประเภท',
      'สีของถุงพลาสติกที่ใส่ขยะมา',
      'ชื่อเล่นของคนที่ทิ้งขยะ',
      'อุณหภูมิของอากาศในวันนั้น',
    ],
    correctIndex: 0,
    explain: 'Abstraction คือการเลือกเก็บเฉพาะข้อมูลที่จำเป็นต่อการแก้ปัญหา ตัดรายละเอียดที่ไม่เกี่ยวข้องออก',
  },
]

export interface AlgorithmOrderStep {
  id: string
  text: string
  correctOrder: number
}

// A simple "if-else" style decision the student must sequence correctly before Mission 3 introduces real flowcharts.
export const ALGORITHM_ORDER_SCENARIO = {
  goal: 'ขั้นตอนตัดสินใจ: ขยะชิ้นนี้ควรทิ้งถังไหน?',
  steps: [
    { id: 'al1', text: 'START: รับขยะ 1 ชิ้นมาตรวจสอบ', correctOrder: 1 },
    { id: 'al2', text: 'ตรวจสอบว่าขยะย่อยสลายได้ตามธรรมชาติหรือไม่', correctOrder: 2 },
    { id: 'al3', text: 'ถ้าใช่ → ทิ้งถังอินทรีย์', correctOrder: 3 },
    { id: 'al4', text: 'ถ้าไม่ใช่ → ตรวจสอบว่ารีไซเคิลได้หรือไม่', correctOrder: 4 },
    { id: 'al5', text: 'ถ้ารีไซเคิลได้ → ทิ้งถังรีไซเคิล ถ้าไม่ได้ → ทิ้งถังทั่วไป', correctOrder: 5 },
    { id: 'al6', text: 'END: บันทึกผลการแยกขยะ', correctOrder: 6 },
  ],
}
