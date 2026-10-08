const fs = require('fs');
let ctxFile = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let ctxContent = fs.readFileSync(ctxFile, 'utf8');

// Add to imports
if (!ctxContent.includes('fetchStudentByCode')) {
  ctxContent = ctxContent.replace(
    "fetchStudentByName,",
    "fetchStudentByName, fetchStudentByCode,"
  );
}

// Add to context interface
if (!ctxContent.includes('loginWithCode:')) {
  ctxContent = ctxContent.replace(
    "createProfile: (name: string, className: string, avatar: AvatarId) => Promise<void>",
    "createProfile: (name: string, className: string, avatar: AvatarId) => Promise<void>\n  loginWithCode: (code: string) => Promise<boolean>"
  );
}

// Add function implementation
const createProfileMatch = ctxContent.match(/const createProfile = async[\s\S]*?const p: StudentProfile = \{[\s\S]*?\}\s*persist\(p\)\s*\}/);
if (createProfileMatch && !ctxContent.includes('const loginWithCode = async')) {
  const loginFunc = `

  const loginWithCode = async (code: string): Promise<boolean> => {
    const exactCode = code.trim();
    if (!exactCode) return false;

    // 1. check localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cgl_student_')) {
        try {
          const p = JSON.parse(localStorage.getItem(key) || '{}');
          if (p.studentCode === exactCode) {
            persist(p);
            return true;
          }
        } catch (e) {}
      }
    }

    // 2. check supabase
    try {
      const row = await fetchStudentByCode(exactCode);
      if (row) {
        const p: StudentProfile = {
          id: row.id,
          studentCode: row.student_code,
          name: row.name,
          className: row.class_name,
          avatar: row.avatar as AvatarId,
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
        return true;
      }
    } catch (err) {}

    return false;
  };
`;
  ctxContent = ctxContent.replace(createProfileMatch[0], createProfileMatch[0] + loginFunc);
}

// Export the function
if (!ctxContent.includes('loginWithCode,')) {
  ctxContent = ctxContent.replace(
    "createProfile,",
    "createProfile,\n    loginWithCode,"
  );
}

fs.writeFileSync(ctxFile, ctxContent, 'utf8');
console.log("Updated StudentContext.tsx");
