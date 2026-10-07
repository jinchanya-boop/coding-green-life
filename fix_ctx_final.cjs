const fs = require('fs');
let ctxFile = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let ctxContent = fs.readFileSync(ctxFile, 'utf8');

const importStr = "import { syncStudent, fetchStudentByName, supabaseEnabled, syncAttempt, syncReflection } from '../lib/supabase';\n";

if (!ctxContent.includes('import { syncStudent')) {
  // Add it after the other imports
  ctxContent = ctxContent.replace("import { LAB_LEVELS }", importStr + "import { LAB_LEVELS }");
  fs.writeFileSync(ctxFile, ctxContent, 'utf8');
}
console.log("Added imports!");
