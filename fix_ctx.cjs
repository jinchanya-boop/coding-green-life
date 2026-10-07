const fs = require('fs');
let ctxFile = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let ctxContent = fs.readFileSync(ctxFile, 'utf8');

// The original import might look like: import { syncStudent, supabaseEnabled, ... } from '../lib/supabase'
// It's safer to just ADD a new import line if it doesn't exist
if (!ctxContent.includes('fetchStudentByName')) {
  ctxContent = "import { fetchStudentByName } from '../lib/supabase';\n" + ctxContent;
}

const oldFunc = `  const createProfile = (name: string, className: string, avatar: AvatarId) => {
    const exactName = name.trim();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cgl_student_')) {
        try {
          const p = JSON.parse(localStorage.getItem(key) || '{}');
          if (p.name === exactName) {
            p.avatar = avatar;
            if (className.trim()) p.className = className.trim();
            persist(p);
            return;
          }
        } catch (e) {}
      }
    }
    const p: StudentProfile = {`;

const newFunc = `  const createProfile = async (name: string, className: string, avatar: AvatarId) => {
    const exactName = name.trim();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cgl_student_')) {
        try {
          const p = JSON.parse(localStorage.getItem(key) || '{}');
          if (p.name === exactName) {
            p.avatar = avatar;
            if (className.trim()) p.className = className.trim();
            persist(p);
            return;
          }
        } catch (e) {}
      }
    }

    try {
      const row = await fetchStudentByName(exactName);
      if (row) {
        const p: StudentProfile = {
          id: row.id,
          studentCode: row.student_code,
          name: row.name,
          className: className.trim() || row.class_name,
          avatar: avatar,
          xp: row.xp,
          level: row.level,
          greenEnergy: row.green_energy,
          badges: row.badges || [],
          missions: row.missions || initialMissionsMap(),
          codingLab: row.coding_lab || initialLabMap(),
          attempts: [],
          reflections: [],
          createdAt: row.created_at,
        };
        persist(p);
        return;
      }
    } catch (err) {}

    const p: StudentProfile = {`;

ctxContent = ctxContent.replace(oldFunc, newFunc);
ctxContent = ctxContent.replace(
  "createProfile: (name: string, className: string, avatar: AvatarId) => void",
  "createProfile: (name: string, className: string, avatar: AvatarId) => Promise<void>"
);

fs.writeFileSync(ctxFile, ctxContent, 'utf8');
console.log("Restored and repatched StudentContext.tsx!");
