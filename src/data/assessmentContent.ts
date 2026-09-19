import type { AssessmentSkill } from '../types'

export interface AssessmentQuestion {
  id: string
  skill: AssessmentSkill
  prompt: string
  options: string[]
  correctIndex: number
}

export const SKILL_LABEL: Record<AssessmentSkill, string> = {
  computationalThinking: 'Computational Thinking',
  algorithm: 'Algorithm',
  coding: 'Coding',
  problemSolving: 'Problem Solving',
}

// Same question set is used for both pre-test and post-test, per the spec
// ("แบบประเมินหลังเรียนที่วัดทักษะชุดเดียวกับ Pre-test") so the two scores
// are directly comparable.
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'ct1',
    skill: 'computationalThinking',
    prompt: 'การแตกปัญหาใหญ่ให้เป็นปัญหาย่อยๆ ที่จัดการได้ง่ายขึ้น เรียกว่าอะไร?',
    options: ['Decomposition', 'Abstraction', 'Pattern Recognition', 'Debugging'],
    correctIndex: 0,
  },
  {
    id: 'ct2',
    skill: 'computationalThinking',
    prompt: 'การเลือกเก็บเฉพาะข้อมูลที่จำเป็น ตัดรายละเอียดที่ไม่เกี่ยวข้องออก เรียกว่าอะไร?',
    options: ['Abstraction', 'Iteration', 'Sequence', 'Variable'],
    correctIndex: 0,
  },
  {
    id: 'algo1',
    skill: 'algorithm',
    prompt: 'อัลกอริทึมที่ดีควรมีลักษณะอย่างไร?',
    options: ['ขั้นตอนชัดเจน ทำตามได้ และมีจุดจบ', 'ยาวและซับซ้อนที่สุด', 'ไม่ต้องมีลำดับขั้นตอน', 'เขียนเป็นภาษาอังกฤษเท่านั้น'],
    correctIndex: 0,
  },
  {
    id: 'algo2',
    skill: 'algorithm',
    prompt: 'สัญลักษณ์รูปข้าวหลามตัดในผังงาน (Flowchart) หมายถึงอะไร?',
    options: ['การตัดสินใจ/เงื่อนไข (Decision)', 'จุดเริ่มต้น-จุดจบ', 'การประมวลผล', 'การรับ-แสดงผลข้อมูล'],
    correctIndex: 0,
  },
  {
    id: 'code1',
    skill: 'coding',
    prompt: 'x = 5; x = x + 2; ค่า x ตอนนี้คือเท่าไร?',
    options: ['7', '5', '2', '52'],
    correctIndex: 0,
  },
  {
    id: 'code2',
    skill: 'coding',
    prompt: 'คำสั่งใดใช้สำหรับวนซ้ำการทำงานหลายรอบ?',
    options: ['FOR / LOOP', 'IF', 'OUTPUT', 'SET'],
    correctIndex: 0,
  },
  {
    id: 'ps1',
    skill: 'problemSolving',
    prompt: 'เมื่อโปรแกรมให้ผลลัพธ์ผิด ขั้นตอนแรกที่ควรทำคืออะไร?',
    options: [
      'อ่านโค้ดและตรวจสอบทีละขั้นตอนว่าตรงกับที่ตั้งใจไว้หรือไม่',
      'ลบโค้ดทั้งหมดแล้วเริ่มใหม่ทันที',
      'เพิกเฉยแล้วส่งงานไปเลย',
      'เปลี่ยนชื่อตัวแปรทั้งหมด',
    ],
    correctIndex: 0,
  },
  {
    id: 'ps2',
    skill: 'problemSolving',
    prompt: 'ก่อนเริ่มเขียนโค้ดแก้ปัญหาหนึ่ง ควรทำอะไรก่อน?',
    options: [
      'ทำความเข้าใจปัญหาและวางแผนขั้นตอนการแก้ปัญหาก่อน',
      'เขียนโค้ดไปเรื่อยๆ โดยไม่ต้องวางแผน',
      'ถามคำตอบจากเพื่อนแล้วคัดลอกมา',
      'ข้ามไปทดสอบโปรแกรมเลย',
    ],
    correctIndex: 0,
  },
  {
    id: 'ct3',
    skill: 'computationalThinking',
    prompt: 'การสังเกตรูปแบบที่คล้ายกันหรือซ้ำๆ กันในปัญหา เพื่อนำมาใช้แก้ปัญหาที่คล้ายกันได้ เรียกว่าอะไร?',
    options: ['Sequence', 'Pattern Recognition', 'Syntax', 'Loop'],
    correctIndex: 1,
  },
  {
    id: 'ct4',
    skill: 'computationalThinking',
    prompt: 'ข้อใดคือตัวอย่างของการคิดเชิงคำนวณ (Computational Thinking) ในชีวิตประจำวัน?',
    options: [
      'ท่องจำสูตรคูณให้ได้ทุกแม่',
      'ร้องเพลงตามจังหวะดนตรี',
      'วางแผนเส้นทางไปโรงเรียนให้เร็วที่สุดโดยแบ่งเป็นขั้นตอนย่อย',
      'วาดภาพระบายสีตามใจชอบ',
    ],
    correctIndex: 2,
  },
  {
    id: 'algo3',
    skill: 'algorithm',
    prompt: 'การเขียนอธิบายขั้นตอนการทำงานด้วยภาษาคนธรรมดา (ไม่ใช่ภาษาโปรแกรมมิ่งจริง) เพื่อวางแผนก่อนเขียนโค้ด เรียกว่าอะไร?',
    options: ['Pseudocode', 'Syntax Error', 'Compile', 'Debug'],
    correctIndex: 0,
  },
  {
    id: 'algo4',
    skill: 'algorithm',
    prompt: 'ข้อใดเรียงลำดับขั้นตอนการต้มไข่ได้ถูกต้อง?',
    options: [
      'ใส่ไข่ → ตักขึ้น → จับเวลา → ต้มน้ำ',
      'จับเวลา → ตักขึ้น → ต้มน้ำ → ใส่ไข่',
      'ต้มน้ำ → ใส่ไข่ → จับเวลา → ตักขึ้น',
      'ตักขึ้น → ต้มน้ำ → ใส่ไข่ → จับเวลา',
    ],
    correctIndex: 2,
  },
  {
    id: 'code3',
    skill: 'coding',
    prompt: 'IF x > 10 THEN พิมพ์ "ใหญ่" ELSE พิมพ์ "เล็ก" — ถ้า x มีค่าเท่ากับ 10 จะพิมพ์ผลลัพธ์อะไร?',
    options: ['ใหญ่', 'เล็ก', 'ใหญ่และเล็ก', 'ไม่พิมพ์อะไรเลย'],
    correctIndex: 1,
  },
  {
    id: 'code4',
    skill: 'coding',
    prompt: 'ตัวแปร (Variable) ในโปรแกรมมีหน้าที่หลักคืออะไร?',
    options: [
      'ตรวจสอบเงื่อนไขว่าจริงหรือเท็จ',
      'แสดงผลลัพธ์ทางหน้าจอเท่านั้น',
      'วนซ้ำคำสั่งตามจำนวนที่กำหนด',
      'เก็บค่าที่สามารถเปลี่ยนแปลงได้ระหว่างโปรแกรมทำงาน',
    ],
    correctIndex: 3,
  },
  {
    id: 'ps3',
    skill: 'problemSolving',
    prompt: 'เมื่อทำงานกลุ่มแล้วเพื่อนเสนอวิธีแก้ปัญหาที่ต่างจากความคิดของเรา ควรทำอย่างไร?',
    options: [
      'ยืนยันว่าวิธีของตัวเองถูกต้องที่สุดเสมอ',
      'รับฟังเหตุผลและเปรียบเทียบข้อดีข้อเสียก่อนตัดสินใจร่วมกัน',
      'ทำตามเพื่อนทันทีโดยไม่ต้องถามอะไร',
      'แยกกันทำคนละวิธีโดยไม่ปรึกษากัน',
    ],
    correctIndex: 1,
  },
  {
    id: 'ps4',
    skill: 'problemSolving',
    prompt: 'การทดสอบโปรแกรมด้วยข้อมูลหลายๆ แบบก่อนนำไปใช้จริง มีประโยชน์อย่างไร?',
    options: [
      'ทำให้โค้ดสั้นลงกว่าเดิม',
      'ทำให้โปรแกรมทำงานเร็วขึ้น',
      'ไม่มีประโยชน์ เสียเวลาเปล่า',
      'ช่วยให้พบข้อผิดพลาดที่อาจไม่เจอตอนทดสอบแค่กรณีเดียว',
    ],
    correctIndex: 3,
  },
]
