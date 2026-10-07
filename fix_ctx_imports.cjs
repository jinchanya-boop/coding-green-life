const fs = require('fs');
let ctxFile = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let ctxContent = fs.readFileSync(ctxFile, 'utf8');

// Find all missing imports
const missing = ['supabaseEnabled', 'syncAttempt', 'syncReflection'];
let newImportStr = "import { syncStudent, fetchStudentByName";
for (const m of missing) {
  if (!ctxContent.includes(`${m} } from`) && !ctxContent.includes(`${m},`) && !ctxContent.includes(`, ${m}`)) {
    newImportStr += `, ${m}`;
  }
}
newImportStr += " } from '../lib/supabase';";

// Replace the existing supabase import with the new comprehensive one
ctxContent = ctxContent.replace(
  /import \{[^}]*?fetchStudentByName[^}]*?\} from '\.\.\/lib\/supabase'/,
  newImportStr
);

// If it still fails, I'll just write a regex to replace ALL supabase imports with a single massive one.
ctxContent = ctxContent.replace(
  /import \{[^}]*?syncStudent[^}]*?\} from '\.\.\/lib\/supabase';?/g,
  ""
);

if (!ctxContent.includes('fetchStudentByName')) {
    ctxContent = newImportStr + "\n" + ctxContent;
}

fs.writeFileSync(ctxFile, ctxContent, 'utf8');
console.log("Fixed imports in StudentContext.tsx");
