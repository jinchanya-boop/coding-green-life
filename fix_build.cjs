const fs = require('fs');

// Fix StudentContext
let ctxFile = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let ctxContent = fs.readFileSync(ctxFile, 'utf8');
if (!ctxContent.includes('fetchStudentByName')) {
  ctxContent = ctxContent.replace(
    /import \{[^}]*?syncStudent[^}]*?\} from '\.\.\/lib\/supabase'/,
    "import { syncStudent, fetchStudentByName } from '../lib/supabase'"
  );
  if (!ctxContent.includes('fetchStudentByName')) {
    // maybe it imports syncStudent without braces? No, it should have braces.
    // Let's just prepend the import.
    ctxContent = "import { fetchStudentByName } from '../lib/supabase';\n" + ctxContent;
  }
  fs.writeFileSync(ctxFile, ctxContent, 'utf8');
} else if (ctxContent.includes('fetchStudentByName') && !ctxContent.includes('import') && !ctxContent.includes('fetchStudentByName }')) {
  ctxContent = "import { fetchStudentByName } from '../lib/supabase';\n" + ctxContent;
  fs.writeFileSync(ctxFile, ctxContent, 'utf8');
}

// Fix Onboarding
let onbFile = 'D:/jinchanya/coding-green-life-phase2/src/pages/Onboarding.tsx';
let onbContent = fs.readFileSync(onbFile, 'utf8');
// It already had a disabled attribute: `disabled={!canStart}` probably!
// Let's check Onboarding.tsx lines around the button.
console.log(onbContent.match(/<button[\s\S]*?<\/button>/)[0]);

