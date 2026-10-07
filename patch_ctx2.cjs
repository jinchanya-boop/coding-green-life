const fs = require('fs');
const file = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
content = content.replace(
  "import { syncStudent } from '../lib/supabase'",
  "import { syncStudent, fetchStudentByName } from '../lib/supabase'"
);

// Replace createProfile
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
    
    // 1. Try to find in localStorage first (fastest)
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

    // 2. If not found locally, try fetching from Supabase
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
    } catch (err) {
      console.error(err);
    }

    // 3. If completely new, create new profile
    const p: StudentProfile = {`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched StudentContext.tsx!");
