const fs = require('fs');
let ctxFile = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let ctxContent = fs.readFileSync(ctxFile, 'utf8');

const replacement = `          badges: row.badges || [],
          missions: row.missions || initialMissionsMap(),
          codingLab: row.coding_lab || initialLabMap(),
          attempts: [],
          reflections: [],
          preTest: row.pre_test || undefined,
          postTest: row.post_test || undefined,
          createdAt: row.created_at,`;
          
ctxContent = ctxContent.replace(
  /badges: row\.badges \|\| \[\],\s*missions: row\.missions \|\| initialMissionsMap\(\),\s*codingLab: row\.coding_lab \|\| initialLabMap\(\),\s*attempts: \[\],\s*reflections: \[\],\s*createdAt: row\.created_at,/,
  replacement
);

fs.writeFileSync(ctxFile, ctxContent, 'utf8');
console.log("Added preTest and postTest mapping to loginWithCode");
