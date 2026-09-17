export interface McChallenge {
  type: 'mc'
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explain: string
}

export interface OrderChallenge {
  type: 'order'
  id: string
  goal: string
  steps: { id: string; text: string; correctOrder: number }[]
}

export interface OpenChallenge {
  type: 'open'
  id: string
  prompt: string
  placeholder: string
}

export type LabChallenge = McChallenge | OrderChallenge | OpenChallenge

export interface LabLevelDef {
  id: string
  order: number
  title: string
  subtitle: string
  icon: string
  challenges: LabChallenge[]
}

export const LAB_LEVELS: LabLevelDef[] = [
  {
    id: 'lab1',
    order: 1,
    title: 'Sequence',
    subtitle: 'ลำดับขั้นตอน',
    icon: '🔢',
    challenges: [
      {
        type: 'order',
        id: 'lab1-order',
        goal: 'จัดลำดับขั้นตอนการชงชาเขียวให้ถูกต้อง',
        steps: [
          { id: 's1', text: 'ต้มน้ำให้เดือด', correctOrder: 1 },
          { id: 's2', text: 'ใส่ผงชาเขียวลงในแก้ว', correctOrder: 2 },
          { id: 's3', text: 'เทน้ำร้อนลงไปคนให้เข้ากัน', correctOrder: 3 },
          { id: 's4', text: 'รอให้อุ่นแล้วดื่ม', correctOrder: 4 },
        ],
      },
    ],
  },
  {
    id: 'lab2',
    order: 2,
    title: 'Condition',
    subtitle: 'เงื่อนไข',
    icon: '🔀',
    challenges: [
      {
        type: 'mc',
        id: 'lab2-1',
        prompt: 'x = 10 ถ้าเงื่อนไข IF x > 5 THEN พิมพ์ "มาก" ELSE พิมพ์ "น้อย" ผลลัพธ์คืออะไร?',
        options: ['มาก', 'น้อย', 'ไม่พิมพ์อะไรเลย', 'error'],
        correctIndex: 0,
        explain: 'เพราะ 10 มากกว่า 5 เงื่อนไขจึงเป็นจริง เข้าฝั่ง THEN',
      },
      {
        type: 'mc',
        id: 'lab2-2',
        prompt: 'ELSE จะทำงานเมื่อใด?',
        options: ['เมื่อเงื่อนไขใน IF เป็นเท็จ', 'เมื่อเงื่อนไขใน IF เป็นจริง', 'ทำงานตลอดเวลา', 'ไม่เคยทำงาน'],
        correctIndex: 0,
        explain: 'ELSE คือทางเลือกสำรองที่ทำงานเฉพาะตอนเงื่อนไขหลักเป็นเท็จเท่านั้น',
      },
      {
        type: 'mc',
        id: 'lab2-3',
        prompt: 'ข้อใดคือการตรวจสอบว่า "อายุมากกว่าหรือเท่ากับ 18 ปี" ถูกต้อง?',
        options: ['IF age >= 18 THEN', 'IF age > 18 THEN', 'IF age = 18 THEN', 'IF age < 18 THEN'],
        correctIndex: 0,
        explain: '">=" หมายถึงมากกว่าหรือเท่ากับ ซึ่งครอบคลุมอายุ 18 พอดีด้วย',
      },
    ],
  },
  {
    id: 'lab3',
    order: 3,
    title: 'Variable',
    subtitle: 'ตัวแปร',
    icon: '📦',
    challenges: [
      {
        type: 'mc',
        id: 'lab3-1',
        prompt: 'x = 5 จากนั้น x = x + 3 ค่า x ตอนนี้คือเท่าไร?',
        options: ['8', '5', '3', '53'],
        correctIndex: 0,
        explain: 'x เริ่มที่ 5 แล้วบวกเพิ่ม 3 กลายเป็น 8',
      },
      {
        type: 'mc',
        id: 'lab3-2',
        prompt: 'ตัวแปร (Variable) คืออะไร?',
        options: [
          'ที่เก็บค่าที่สามารถเปลี่ยนแปลงได้ระหว่างโปรแกรมทำงาน',
          'ค่าคงที่ที่เปลี่ยนไม่ได้',
          'ชื่อของโปรแกรม',
          'คำสั่งแสดงผลลัพธ์',
        ],
        correctIndex: 0,
        explain: 'ตัวแปรเป็นเหมือนกล่องเก็บค่า ที่สามารถเปลี่ยนค่าข้างในได้เรื่อยๆ',
      },
      {
        type: 'mc',
        id: 'lab3-3',
        prompt: 'y = 2 จากนั้น y = y * 4 ค่า y ตอนนี้คือเท่าไร?',
        options: ['8', '2', '4', '24'],
        correctIndex: 0,
        explain: 'y เริ่มที่ 2 คูณด้วย 4 กลายเป็น 8',
      },
    ],
  },
  {
    id: 'lab4',
    order: 4,
    title: 'Loop',
    subtitle: 'การวนซ้ำ',
    icon: '🔁',
    challenges: [
      {
        type: 'mc',
        id: 'lab4-1',
        prompt: 'FOR i = 1 to 3: OUTPUT i จะพิมพ์ผลลัพธ์อะไรบ้าง?',
        options: ['1 2 3', '1 2', '3 2 1', '0 1 2'],
        correctIndex: 0,
        explain: 'ลูปวิ่งจาก 1 ถึง 3 พิมพ์ค่า i ทุกรอบ จึงได้ 1 2 3',
      },
      {
        type: 'mc',
        id: 'lab4-2',
        prompt: 'ถ้าลืมเพิ่มค่าตัวแปรควบคุมในลูป WHILE จะเกิดอะไรขึ้น?',
        options: ['ลูปไม่มีวันจบ (Infinite Loop)', 'โปรแกรมจะปิดทันที', 'ลูปจะทำงานแค่ครั้งเดียว', 'ไม่มีผลอะไรเลย'],
        correctIndex: 0,
        explain: 'ถ้าเงื่อนไขไม่เคยเปลี่ยนเป็นเท็จ ลูปจะวนซ้ำไม่รู้จบ',
      },
      {
        type: 'mc',
        id: 'lab4-3',
        prompt: 'WHILE ต่างจาก FOR อย่างไร?',
        options: [
          'WHILE ทำซ้ำจนกว่าเงื่อนไขเท็จ ไม่กำหนดจำนวนรอบตายตัว ส่วน FOR กำหนดจำนวนรอบไว้ล่วงหน้า',
          'WHILE กับ FOR ทำงานเหมือนกันทุกอย่าง',
          'FOR ใช้ได้แค่ครั้งเดียว',
          'WHILE ใช้กับตัวเลขเท่านั้น',
        ],
        correctIndex: 0,
        explain: 'FOR เหมาะกับงานที่รู้จำนวนรอบแน่นอน ส่วน WHILE เหมาะกับงานที่ขึ้นกับเงื่อนไข',
      },
    ],
  },
  {
    id: 'lab5',
    order: 5,
    title: 'Algorithm',
    subtitle: 'อัลกอริทึม',
    icon: '🧠',
    challenges: [
      {
        type: 'mc',
        id: 'lab5-1',
        prompt: 'อัลกอริทึม (Algorithm) คืออะไร?',
        options: [
          'ลำดับขั้นตอนการแก้ปัญหาที่ชัดเจนและทำตามได้',
          'ภาษาโปรแกรมมิ่งชนิดหนึ่ง',
          'ชื่อของคอมพิวเตอร์',
          'อุปกรณ์อิเล็กทรอนิกส์',
        ],
        correctIndex: 0,
        explain: 'อัลกอริทึมคือแผนขั้นตอนที่ชัดเจนสำหรับแก้ปัญหา ก่อนจะนำไปเขียนเป็นโค้ดจริง',
      },
      {
        type: 'mc',
        id: 'lab5-2',
        prompt: 'ข้อใดคือลำดับอัลกอริทึมที่ถูกต้องสำหรับ "ชงบะหมี่กึ่งสำเร็จรูป"?',
        options: [
          'ต้มน้ำ → ฉีกซอง → ใส่เครื่องปรุง → เทน้ำร้อนลงไป → รอ 3 นาที',
          'เทน้ำร้อน → ต้มน้ำ → รอ 3 นาที → ฉีกซอง',
          'รอ 3 นาที → ต้มน้ำ → ฉีกซอง → เทน้ำร้อน',
          'ฉีกซอง → รอ 3 นาที → ต้มน้ำ → เทน้ำร้อน',
        ],
        correctIndex: 0,
        explain: 'ต้องต้มน้ำก่อน แล้วเตรียมเครื่องปรุง จากนั้นเทน้ำร้อนแล้วค่อยรอ ลำดับผิดจะทำให้บะหมี่ไม่สุก',
      },
      {
        type: 'mc',
        id: 'lab5-3',
        prompt: 'ทำไมต้องออกแบบอัลกอริทึมก่อนลงมือเขียนโค้ด?',
        options: [
          'ช่วยให้คิดเป็นระบบ ลดข้อผิดพลาด และเห็นภาพรวมก่อนลงมือจริง',
          'เพราะกฎหมายบังคับ',
          'เพื่อให้โค้ดยาวขึ้น',
          'ไม่มีความจำเป็นต้องทำ',
        ],
        correctIndex: 0,
        explain: 'การวางแผนก่อนช่วยประหยัดเวลาแก้บั๊กในภายหลัง และทำให้ทำงานเป็นทีมง่ายขึ้น',
      },
    ],
  },
  {
    id: 'lab6',
    order: 6,
    title: 'Debugging',
    subtitle: 'การแก้จุดบกพร่อง',
    icon: '🐞',
    challenges: [
      {
        type: 'mc',
        id: 'lab6-1',
        prompt: 'โค้ดนี้ควรนับเลข 1-5 แต่พิมพ์ได้แค่ 1-4: FOR i = 1 to 4: OUTPUT i ปัญหาคืออะไร?',
        options: ['ควรเป็น FOR i = 1 to 5 แต่เขียนผิดเป็น 4', 'ตัวแปร i ตั้งชื่อผิด', 'OUTPUT เขียนผิด', 'ไม่มีปัญหาอะไร'],
        correctIndex: 0,
        explain: 'ขอบเขตของลูปกำหนดไว้แค่ 4 ทำให้พิมพ์ไม่ครบ 5 ตามที่ต้องการ',
      },
      {
        type: 'mc',
        id: 'lab6-2',
        prompt: 'การ Debug คืออะไร?',
        options: [
          'กระบวนการหาสาเหตุและแก้ไขข้อผิดพลาดของโปรแกรม',
          'การลบโปรแกรมทิ้งทั้งหมด',
          'การเขียนโปรแกรมใหม่ตั้งแต่ต้น',
          'การตั้งชื่อตัวแปร',
        ],
        correctIndex: 0,
        explain: 'Debug มาจาก "bug" (แมลง/ข้อบกพร่อง) หมายถึงการค้นหาและกำจัดข้อผิดพลาดในโค้ด',
      },
      {
        type: 'mc',
        id: 'lab6-3',
        prompt: 'total = 0; total = total + 0 (ต้องการนับจำนวนที่ถูกต้อง) ปัญหาของบรรทัดนี้คืออะไร?',
        options: ['บวกด้วย 0 ไม่ทำให้ค่าเปลี่ยนเลย ควรบวกด้วย 1', 'ตัวแปร total ตั้งชื่อผิด', 'ต้องใช้ IF ก่อน', 'ไม่มีปัญหา'],
        correctIndex: 0,
        explain: 'การบวกด้วย 0 ทำให้ค่าตัวแปรไม่เปลี่ยนแปลงเลย ทำให้นับไม่ได้ผลจริง',
      },
    ],
  },
  {
    id: 'lab7',
    order: 7,
    title: 'Creative Coding',
    subtitle: 'สร้างสรรค์ด้วยโค้ด',
    icon: '🌟',
    challenges: [
      {
        type: 'open',
        id: 'lab7-open',
        prompt:
          'ถ้าให้ออกแบบโปรแกรมช่วยแก้ปัญหาในชีวิตประจำวันของเธอเองสักอย่าง จะเขียนโปรแกรมอะไร? อธิบายไอเดียคร่าวๆ ว่าโปรแกรมนั้นทำงานอย่างไร (ใช้ SET, IF, FOR EACH, LOOP ที่เรียนมาได้เลย)',
        placeholder: 'เช่น โปรแกรมเตือนรดน้ำต้นไม้ ถ้าไม่ได้รดน้ำเกิน 3 วันจะแจ้งเตือน...',
      },
    ],
  },
]
