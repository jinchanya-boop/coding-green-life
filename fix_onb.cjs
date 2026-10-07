const fs = require('fs');

// Fix StudentContext
let ctxFile = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let ctxContent = fs.readFileSync(ctxFile, 'utf8');
if (!ctxContent.includes('fetchStudentByName } from')) {
  ctxContent = ctxContent.replace(
    /import \{[^}]*?syncStudent[^}]*?\} from '\.\.\/lib\/supabase'/,
    "import { syncStudent, fetchStudentByName } from '../lib/supabase'"
  );
  fs.writeFileSync(ctxFile, ctxContent, 'utf8');
}

// Fix Onboarding
let onbFile = 'D:/jinchanya/coding-green-life-phase2/src/pages/Onboarding.tsx';
let onbContent = fs.readFileSync(onbFile, 'utf8');

// Revert the bad replacement
onbContent = onbContent.replace(
  "onClick={handleStart} disabled={isStarting}\n            disabled={!canStart}",
  "onClick={handleStart}\n            disabled={!canStart || isStarting}"
);

// Replace button text correctly
onbContent = onbContent.replace(
  ">เริ่มภารกิจ<",
  ">{isStarting ? 'กำลังค้นหาข้อมูล...' : 'เริ่มภารกิจ'}<"
);

fs.writeFileSync(onbFile, onbContent, 'utf8');
console.log("Fixed files!");
