# Coding for Green Life Learning Platform

แพลตฟอร์มเกมการเรียนรู้ Coding for Green Life สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 2
เฟส 1: Student World + Mission 01–02 | เฟส 2: Mission 03–04

## รันบนเครื่อง
```
npm install
npm run dev
```

## เกี่ยวข้องกับข้อมูล
ระบบเก็บข้อมูลการเล่นไว้ใน localStorage ของเบราว์เซอร์ทันที ใช้งานได้จริงโดยไม่ต้องตั้งค่าอะไรเพิ่ม
ถ้าต้องการให้ครูดู Dashboard รวมของทั้งห้อง หรือให้นักเรียนเล่นข้ามอุปกรณ์ได้ ให้ตั้งค่า Supabase:

1. สร้างโปรเจกต์ที่ https://supabase.com
2. รัน `supabase/schema.sql` ใน SQL editor ของโปรเจกต์
3. คัดลอก `.env.example` เป็น `.env` แล้วใส่ Project URL และ anon key
4. รีสตาร์ท `npm run dev`

## Deploy ขึ้น GitHub Pages
1. Push โค้ดนี้ขึ้น GitHub repo ชื่อ `coding-green-life` (หรือแก้ `base` ใน `vite.config.ts` ให้ตรงกับชื่อ repo)
2. เปิด Settings → Pages → Source: GitHub Actions
3. ถ้าใช้ Supabase ให้เพิ่ม repo secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Push ขึ้น branch `main` — workflow ใน `.github/workflows/deploy.yml` จะ build และ deploy ให้อัตโนมัติ

## โครงสร้างที่ทำแล้ว
- Student World: avatar, XP, Level (Green Hero progression), Green Energy, Badge, mission map แบบปลดล็อกตามลำดับ
- Mission 01 Green Detective: เกม "ขับรถเก็บขยะ" แบบขับอิสระ 4 ทิศ ไปรับขยะแล้วนำไปทิ้งถังที่ถูกสี พร้อมหลบยุงพิษ + วิเคราะห์ข้อมูลจากกราฟ 3 ข้อ + Reflection 6 ข้อ
- Mission 02 Think Before Code: Decomposition (จัดลำดับขั้นตอนแบบลาก & วาง), Pattern Recognition, Abstraction, Algorithmic Thinking พร้อมมาสคอต "น้องกรีน" และเกมโบนัสคั่น "ตีตุ่มขยะ" 3 รอบ + Reflection
- Mission 03 Algorithm Builder: ประกอบบล็อก START/INPUT/PROCESS/IF/ELSE/OUTPUT/END เป็น Flowchart 2 สถานการณ์ พร้อม hint แบบไม่เฉลยตรง ๆ + Reflection
- Mission 04 Debug Detective: อ่านโค้ดเทียม → วิเคราะห์สาเหตุบั๊ก → เลือกวิธีแก้ → เห็นผล RUN สำเร็จ ครบ 3 คดี + Reflection
- Mission 05 Green Sorter: เกมคัดแยกขยะแบบจับเวลา 40 วินาที ลาก/แตะขยะไปทิ้งถังให้ทันเวลา มีคอมโบและเลเวลเพิ่มความเร็ว จบแล้ววิเคราะห์ย้อนกลับว่าเกมใช้ Algorithm อย่างไร + Reflection
- Mission 06 Code Builder: เขียนโปรแกรมจริงด้วยบล็อกโค้ด SET/FOR EACH/IF-ELSE/OUTPUT แล้วกด RUN เพื่อรันจริงผ่าน mini-interpreter เทียบผลลัพธ์กับค่าที่ถูกต้อง มี Console แสดง trace การทำงานทีละบรรทัด 2 โจทย์ + Reflection
- Mission 07 Green Game Creator: วิซาร์ดออกแบบเกมของตัวเอง 12 ขั้นตอนครบตามสเปก (Identify Problem → Gather Data → Define Goal → Decompose → Design Algorithm → Flowchart → Design Game → Write Code → Test → Debug → Improve → Present) บังคับกรอกครบทุกขั้นก่อนไปขั้นถัดไป จบแล้วได้ "Game Design Document" สรุปผลงานของตัวเอง
- ทุกภารกิจบันทึก: คะแนน, จำนวนครั้งที่ลอง/คอมโบ, ประเภทข้อผิดพลาด, เวลาที่ใช้, และคำตอบ Reflection — พร้อมสำหรับ Evidence & Analytics ในเฟสถัดไป
- Mission 1-7 ครบทุกด่านตามสเปกต้นฉบับแล้ว
- **Coding Lab**: พื้นที่ฝึกฝนอิสระ 7 เลเวล (Sequence, Condition, Variable, Loop, Algorithm, Debugging, Creative Coding) แยกจาก Mission หลัก เข้าถึงได้จาก Student World โดยตรง ปลดล็อกเลเวลถัดไปเมื่อทำได้ ≥70% เล่นซ้ำได้ไม่จำกัดครั้ง บันทึกคะแนนที่ดีที่สุดของแต่ละเลเวลไว้
- **Pre/Post-test**: แบบประเมิน 8 ข้อ ครอบคลุม Computational Thinking, Algorithm, Coding, Problem Solving ทำได้จาก Student World ก่อน/หลังเล่นภารกิจ เมื่อทำครบทั้งสองรอบจะขึ้นการ์ดเปรียบเทียบพัฒนาการรายทักษะ (Pre → Post พร้อม % เปลี่ยนแปลง)
- **Teacher Dashboard** (`/teacher` — ไม่ต้องมีโปรไฟล์นักเรียน เปิดตรงได้เลย): ภาพรวมชั้นเรียนจาก Supabase — จำนวนนักเรียน, XP เฉลี่ย, เหรียญตรารวม, ตารางรายชื่อคลิกดูรายละเอียดคะแนนแต่ละภารกิจ + ข้อผิดพลาดที่พบบ่อย + Reflection ล่าสุด, ปุ่ม Export CSV (รายชื่อนักเรียน และคะแนนรายภารกิจ) — **ต้องตั้งค่า Supabase ก่อนใช้งานได้** (ดูหัวข้อ Supabase ด้านบน)
- **Class Progress Board** (`/progress`): บอร์ดที่นักเรียนดูกันเองว่าเพื่อนไปถึงไหนแล้ว เข้าถึงได้จาก Student World โดยตรง เรียงตามชื่อ (ไม่ใช่อันดับคะแนน) เพื่อไม่ให้กลายเป็นการแข่งขันเปรียบเทียบ แสดง avatar, Green Hero Level, แถบความคืบหน้าภารกิจ, และเวลาที่ใช้งานล่าสุด
- **Creator Studio** (`/studio`): พื้นที่สร้างผลงานอิสระ (เกม/Animation/Interactive Story/Green Campaign/Digital Solution) ไม่บังคับขั้นตอนเหมือน Mission 7 กรอกฟิลด์ Problem/Goal/Algorithm/Flowchart/Code/Test/Debug/Improvement/Reflection ได้อิสระ สร้างได้หลายชิ้น
- **Peer Feedback** (`/studio/browse` → เลือกผลงาน): ดูผลงานเพื่อนร่วมชั้นทุกคน ให้คะแนน 1-5 ดาว 6 ด้าน (ความเข้าใจง่าย/สนุก/ถูกต้อง/สร้างสรรค์/แก้ปัญหา/ประโยชน์ต่อสิ่งแวดล้อม) พร้อมความเห็นเพิ่มเติม เจ้าของผลงานเห็นคะแนนเฉลี่ย + ความเห็นที่ได้รับ
- **Green Portfolio** (`/portfolio`): หน้าเดียวรวมทุกอย่างของนักเรียนคนนั้น — โปรไฟล์, Green Hero Level, เหรียญตรา, ภารกิจที่สำเร็จ, Coding Lab ที่ผ่าน, ผลงานสร้างสรรค์, และ Reflection ล่าสุด
- **Rubric** (ใน Teacher Dashboard คลิกเลือกนักเรียนแล้วเลื่อนลง): ครูให้คะแนนเชิงคุณภาพ 8 ด้านตามสเปก (CT, Algorithm, Coding, Debugging, Creativity, Problem Solving, Responsibility, Environmental Awareness) แต่ละด้าน 4 ระดับ (ดีเยี่ยม-ต้องพัฒนา) บันทึกทันทีที่กด ไม่ต้องกดปุ่มบันทึกแยก
- **Learning Analytics รวมห้อง** (ใน Teacher Dashboard): กราฟเปรียบเทียบ Pre-test vs Post-test เฉลี่ยทั้งชั้น แยกรายทักษะ พร้อมนับจำนวนคนที่ทำครบ/ทำแค่ Pre/ยังไม่ทำ
- **ระบบแจ้งเตือนช่วยเหลือนักเรียน** (ใน Teacher Dashboard): ตรวจจับอัตโนมัติว่านักเรียนคนไหนลองภารกิจไหนมาแล้ว ≥3 ครั้งแต่ยังไม่ผ่าน พร้อมคำแนะนำกิจกรรมช่วยเหลือ (Hint / Mini Lesson / Unplugged Coding / Extra Challenge / Peer Support) ตามสเปก
- **Evidence Report** (`/teacher/evidence` หรือปุ่มใน Teacher Dashboard): รายงานสรุปหลักฐานการเรียนรู้แบบพิมพ์ได้ ตอบ 4 คำถามตามสเปก (แก้ปัญหาอะไร/แก้อย่างไร/เปลี่ยนแปลงอย่างไร/มีข้อมูลอะไรยืนยัน) ดึงข้อมูลจริงจาก Supabase มาแสดง กดปุ่ม "พิมพ์ / บันทึกเป็น PDF" แล้วเลือก "Save as PDF" ในหน้าต่างพิมพ์ของเบราว์เซอร์ได้เลย (Export PDF)
- ตัวละคร: ใช้ภาพประกอบจริงที่ครูจัดเตรียม (น้องกรีน, โค้ชโค้ด) ผสมกับ SVG มาสคอต (ระบบเตือนภัย)
- พื้นหลังเคลื่อนไหว (เมฆลอย/นกบิน/ต้นไม้โยก) อยู่ทุกหน้าของแอปแล้ว
- เกมโบนัสคั่นระหว่างด่าน: ตีตุ่มขยะ (Mission 2), แข่งรถเก็บพลังงาน+ตอบคำถามเร่งเครื่อง (Mission 3, 4), ล่าบั๊กตัวจริง (Mission 4) — ไม่กระทบคะแนนประเมินหลัก

- **แบบสำรวจความพึงพอใจ** (`/survey` — ขึ้นบน Student World หลังทำ Post-test เสร็จ): Likert 5 ระดับ 5 ข้อ (ความสนุก/ความเข้าใจง่าย/แรงจูงใจ/นำไปใช้จริง/ความพึงพอใจโดยรวม) + ความเห็นเพิ่มเติม ทำได้คนละ 1 ครั้ง ผลรวมแสดงใน Teacher Dashboard เป็น % ที่พึงพอใจระดับ "มาก" ขึ้นไป ตรงตามเป้าหมาย 3.1.3 ของ PA

## ยังไม่ได้ทำ
ทุกอย่างในสเปกต้นฉบับทำครบแล้วค่ะ 🎉 (Mission 1-7, Coding Lab, Pre/Post-test, Teacher Dashboard, Class Progress, Creator Studio, Peer Feedback, Green Portfolio, Rubric, Learning Analytics รวมห้อง, ระบบแจ้งเตือนช่วยเหลือนักเรียน, Export CSV/PDF)

## สำคัญ: ต้องรัน SQL เพิ่มอีกครั้ง (ครั้งที่ 4)
เฟสนี้เพิ่มตาราง `satisfaction_survey` สำหรับเก็บผลแบบสำรวจความพึงพอใจ — กลับไปรัน `supabase/schema.sql` ทั้งไฟล์อีกครั้งใน SQL Editor (ปลอดภัยรันซ้ำได้)
