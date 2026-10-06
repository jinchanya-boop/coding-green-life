const fs = require('fs');
const file = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFunc = `  const createProfile = (name: string, className: string, avatar: AvatarId) => {
    const p: StudentProfile = {
      id: newId(),`;
      
const newFunc = `  const createProfile = (name: string, className: string, avatar: AvatarId) => {
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
    const p: StudentProfile = {
      id: newId(),`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched StudentContext.tsx!");
