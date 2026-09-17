export interface CreatorStepDef {
  id: string
  order: number
  title: string
  icon: string
  prompt: string
}

export const CREATOR_STEPS: CreatorStepDef[] = [
  { id: 'problem', order: 1, title: 'Identify Problem', icon: '🔍', prompt: 'ปัญหาสิ่งแวดล้อมอะไรในโรงเรียนหรือชุมชนที่เธออยากแก้ไขด้วยเกม?' },
  { id: 'data', order: 2, title: 'Gather Data', icon: '📊', prompt: 'มีข้อมูลหรือหลักฐานอะไรที่ยืนยันว่านี่เป็นปัญหาจริง? (เช่น สังเกตเห็นอะไร มีตัวเลขอะไรบ้าง)' },
  { id: 'goal', order: 3, title: 'Define Goal', icon: '🎯', prompt: 'ตั้งเป้าหมายที่วัดผลได้ของเกมนี้ เช่น "ทำให้ผู้เล่นแยกขยะถูกต้องได้อย่างน้อย 80%"' },
  { id: 'decompose', order: 4, title: 'Decompose Problem', icon: '🧩', prompt: 'แตกปัญหาใหญ่เป็นขั้นตอนย่อย 3-5 ข้อ ที่ต้องทำเพื่อสร้างเกมนี้ให้สำเร็จ' },
  { id: 'algorithm', order: 5, title: 'Design Algorithm', icon: '🧠', prompt: 'เกมของเธอจะตัดสินใจแพ้-ชนะหรือถูก-ผิดอย่างไร? อธิบายตรรกะหลัก' },
  { id: 'flowchart', order: 6, title: 'Create Flowchart', icon: '🔗', prompt: 'อธิบายลำดับขั้นตอนของเกมตั้งแต่เริ่มจนจบ เหมือนเล่าเป็น Flowchart ด้วยคำพูด' },
  { id: 'gamedesign', order: 7, title: 'Design Game', icon: '🎮', prompt: 'ออกแบบรายละเอียดเกมของเธอ' },
  { id: 'code', order: 8, title: 'Write Code', icon: '💻', prompt: 'ถ้าจะเขียนโปรแกรมเกมนี้จริง ต้องใช้บล็อกคำสั่งอะไรบ้าง? เลือกแล้วอธิบายว่าใช้ทำอะไร' },
  { id: 'test', order: 9, title: 'Test', icon: '🧪', prompt: 'สมมติว่าให้เพื่อนทดลองเล่นเกมนี้ คิดว่าจะเจอปัญหาอะไรบ้าง?' },
  { id: 'debug', order: 10, title: 'Debug', icon: '🐞', prompt: 'ถ้าเจอปัญหานั้น จะแก้ไขอย่างไร?' },
  { id: 'improve', order: 11, title: 'Improve', icon: '✨', prompt: 'หลังจากแก้บั๊กแล้ว จะปรับปรุงเกมให้ดีขึ้นไปอีกอย่างไร?' },
  { id: 'present', order: 12, title: 'Present', icon: '🏆', prompt: 'สรุปผลงานของเธอ พร้อมนำเสนอ!' },
]

export const BLOCK_CHIP_OPTIONS = ['SET', 'IF...THEN', 'ELSE', 'FOR EACH', 'LOOP', 'VARIABLE', 'EVENT', 'INPUT', 'OUTPUT']

// Example answers shown as tappable starter chips for each open-text field, so
// a student who is stuck ("คิดหัวข้อไม่ถูก") has something concrete to tap in
// and then edit, instead of facing a blank textarea.
export const FIELD_EXAMPLES: Record<string, string[]> = {
  problem: [
    'นักเรียนทิ้งขวดน้ำพลาสติกลงถังขยะทั่วไปแทนที่จะรีไซเคิล',
    'หลอดไฟในห้องเรียนเปิดทิ้งไว้ทั้งที่ไม่มีคนอยู่',
    'ก๊อกน้ำในห้องน้ำโรงเรียนรั่วไหลตลอดเวลา',
  ],
  data: [
    'สังเกตถังขยะรีไซเคิลพบขยะทั่วไปปนอยู่เกือบทุกวัน',
    'จดบันทึกพบว่าไฟห้องเรียนเปิดทิ้งไว้ช่วงพักเที่ยงทุกวัน',
    'สอบถามเพื่อน 20 คน พบว่า 15 คนไม่รู้วิธีแยกขยะที่ถูกต้อง',
  ],
  goal: [
    'ลดขยะที่ทิ้งผิดถังให้เหลือต่ำกว่า 10% ภายใน 1 เดือน',
    'ให้ผู้เล่น 80% แยกขยะถูกต้องหลังเล่นเกมนี้',
    'ลดพลังงานไฟฟ้าที่สูญเปล่าในห้องเรียนลง 20%',
  ],
  decompose: [
    '1. สำรวจปัญหา 2. ออกแบบกติกาเกม 3. สร้างตัวละคร/ด่าน 4. ทดสอบกับเพื่อน 5. ปรับปรุงแก้ไข',
    '1. เก็บข้อมูลขยะ 7 วัน 2. ตั้งเป้าหมายตัวเลข 3. ออกแบบเกม 4. เขียนโค้ด 5. ทดลองใช้จริง',
  ],
  algorithmDesc: [
    'ถ้าผู้เล่นเลือกถังตรงกับประเภทขยะ ให้บวกคะแนน ถ้าไม่ตรงให้ลดคะแนนและแจ้งเฉลยที่ถูกต้อง',
    'นับเวลาถอยหลัง ถ้าตอบถูกก่อนหมดเวลาได้คะแนนโบนัส ถ้าหมดเวลาก่อนถือว่าตอบผิด',
  ],
  flowchart: [
    'START → สุ่มขยะ 1 ชิ้น → ผู้เล่นเลือกถัง → ตรวจสอบถูก/ผิด → อัปเดตคะแนน → เช็คว่าหมดเวลาหรือยัง → END',
  ],
  gameName: ['Eco Rush', 'ล่าขยะพิชิตเมือง', 'Green Guardian'],
  gameRules: [
    'ผู้เล่นมีเวลา 60 วินาที ต้องลากขยะที่ตกลงมาไปทิ้งถังให้ถูกประเภทให้ได้มากที่สุด',
    'ตอบคำถามแยกขยะให้ถูกติดต่อกันเพื่อสะสมคอมโบและปลดล็อกด่านถัดไป',
  ],
  gamePlayerGoal: ['ทำคะแนนให้ถึงเป้าที่ตั้งไว้ก่อนหมดเวลา', 'แยกขยะให้ถูกต้องครบทุกชิ้นโดยไม่พลาดเกิน 2 ครั้ง'],
  codeDesc: [
    'ใช้ FOR EACH วนดูขยะทีละชิ้น ใช้ IF ตรวจว่าประเภทตรงกับถังไหม ใช้ VARIABLE เก็บคะแนนสะสม',
    'ใช้ LOOP นับเวลาถอยหลัง ใช้ EVENT ตรวจจับการลากวาง ใช้ OUTPUT แสดงคะแนนบนหน้าจอ',
  ],
  test: [
    'เพื่อนอาจกดเร็วเกินจนไม่ทันดูว่าขยะคืออะไร',
    'เพื่อนบางคนไม่เข้าใจกติกาตั้งแต่แรกเพราะไม่มีคำอธิบาย',
  ],
  debug: [
    'เพิ่มเวลาการแสดงขยะในด่านแรกๆ ให้มากขึ้น',
    'เพิ่มหน้าอธิบายกติกาสั้นๆ ก่อนเริ่มเล่นจริง',
  ],
  improve: [
    'เพิ่มระดับความยากที่ปรับตามคะแนนผู้เล่น',
    'เพิ่มเสียงเอฟเฟกต์ตอนตอบถูก/ผิด',
    'เพิ่มระบบคอมโบให้ยิ่งตอบถูกต่อกันยิ่งได้คะแนนโบนัส',
  ],
}

export interface CreatorAnswers {
  problem: string
  data: string
  goal: string
  decompose: string
  algorithmBlocks: string[]
  algorithmDesc: string
  flowchart: string
  gameName: string
  gameRules: string
  gamePlayerGoal: string
  codeBlocks: string[]
  codeDesc: string
  test: string
  debug: string
  improve: string
}

export const EMPTY_ANSWERS: CreatorAnswers = {
  problem: '',
  data: '',
  goal: '',
  decompose: '',
  algorithmBlocks: [],
  algorithmDesc: '',
  flowchart: '',
  gameName: '',
  gameRules: '',
  gamePlayerGoal: '',
  codeBlocks: [],
  codeDesc: '',
  test: '',
  debug: '',
  improve: '',
}
