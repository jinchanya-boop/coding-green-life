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
]
