export interface DebugScenario {
  id: string
  title: string
  code: string[]
  symptom: string
  bugOptions: string[]
  correctBugIndex: number
  fixOptions: string[]
  correctFixIndex: number
  explain: string
}

export const DEBUG_SCENARIOS: DebugScenario[] = [
  {
    id: 'bug1',
    title: 'ตัวนับขยะรีไซเคิลรวมค่าไม่ถูก',
    code: [
      'SET total = 0',
      'FOR each item IN wasteList',
      '  IF item.type == "recycle" THEN',
      '    total = total + 0',
      '  END IF',
      'END FOR',
      'OUTPUT total',
    ],
    symptom: 'เมื่อรันโปรแกรม ค่า total ออกมาเป็น 0 เสมอ ทั้งที่ในรายการมีขยะรีไซเคิลอยู่จริง',
    bugOptions: [
      'เงื่อนไข IF เขียนผิด ทำให้ไม่มีรายการใดเข้าเงื่อนไขเลย',
      'ลืมกำหนดค่าเริ่มต้นให้ total',
      'บวกค่าที่ไม่ถูกต้องเข้ากับ total ทำให้ค่าไม่เปลี่ยน',
      'ลูป FOR วนซ้ำผิดจำนวนรอบ',
    ],
    correctBugIndex: 2,
    fixOptions: [
      'เปลี่ยนเป็น total = total + 0.5',
      'เปลี่ยนเป็น total = total + 1',
      'เปลี่ยนเป็น total = item.count',
      'ลบบรรทัด total = total + 0 ทิ้งไปเลย',
    ],
    correctFixIndex: 1,
    explain: 'บรรทัด total = total + 0 ไม่เคยเพิ่มค่าเลย ต้องบวกเพิ่มทีละ 1 ทุกครั้งที่พบขยะรีไซเคิล',
  },
  {
    id: 'bug2',
    title: 'ระบบแจ้งเตือนอุณหภูมิเรือนกระจกไม่ทำงาน',
    code: [
      'INPUT temperature',
      'IF temperature > 35 THEN',
      '  OUTPUT "อุณหภูมิสูงเกินไป"',
      'END IF',
      'IF temperature > 35 THEN',
      '  OUTPUT "เปิดพัดลมระบายอากาศ"',
      'END IF',
    ],
    symptom: 'เมื่ออุณหภูมิเท่ากับ 35 พอดี ระบบไม่แจ้งเตือนเลยทั้งที่ควรจะเตือน',
    bugOptions: [
      'ใช้ตัวแปร temperature ผิดชื่อ',
      'เงื่อนไขใช้ > แทนที่จะเป็น >= จึงไม่รวมกรณีเท่ากับ 35 พอดี',
      'ไม่มีบรรทัด INPUT',
      'มี OUTPUT ซ้ำกันสองครั้งโดยไม่จำเป็น',
    ],
    correctBugIndex: 1,
    fixOptions: [
      'เปลี่ยน temperature > 35 เป็น temperature >= 35 ทั้งสองจุด',
      'เปลี่ยน 35 เป็น 34',
      'ลบเงื่อนไขที่สองทิ้ง',
      'เปลี่ยน INPUT เป็น OUTPUT',
    ],
    correctFixIndex: 0,
    explain: 'โจทย์ต้องการให้แจ้งเตือนตั้งแต่ 35 องศาขึ้นไป "รวมค่าเท่ากับ 35" ด้วย จึงต้องใช้ >= ไม่ใช่ >',
  },
  {
    id: 'bug3',
    title: 'ลูปตรวจนักเรียนที่ยังไม่คัดแยกขยะไม่หยุดทำงาน',
    code: [
      'SET i = 0',
      'WHILE i < studentCount',
      '  CHECK student[i]',
      'END WHILE',
      'OUTPUT "ตรวจครบทุกคนแล้ว"',
    ],
    symptom: 'โปรแกรมค้าง ไม่ยอมพิมพ์ข้อความ "ตรวจครบทุกคนแล้ว" เลยแม้รอนาน',
    bugOptions: [
      'เงื่อนไข WHILE ผิด ทำให้ไม่เคยเข้าลูป',
      'ลืมเพิ่มค่า i ในลูป ทำให้เงื่อนไขเป็นจริงตลอดไป (Infinite Loop)',
      'ฟังก์ชัน CHECK ไม่มีอยู่จริง',
      'ตัวแปร studentCount ไม่ได้กำหนดค่า',
    ],
    correctBugIndex: 1,
    fixOptions: [
      'เพิ่มบรรทัด i = i + 1 ไว้ในลูปก่อน END WHILE',
      'เปลี่ยน WHILE เป็น IF',
      'เปลี่ยน i < studentCount เป็น i > studentCount',
      'ลบ SET i = 0 ทิ้ง',
    ],
    correctFixIndex: 0,
    explain: 'ลูป WHILE ต้องมีตัวที่เปลี่ยนค่าเข้าใกล้เงื่อนไขหยุดเสมอ ที่นี่ลืมเพิ่มค่า i จึงวนไม่รู้จบ',
  },
]
