const fs = require('fs');
let onbFile = 'D:/jinchanya/coding-green-life-phase2/src/pages/Onboarding.tsx';
let onbContent = fs.readFileSync(onbFile, 'utf8');
const match = onbContent.match(/<button[\s\S]*?onClick=\{handleStart\}[\s\S]*?<\/button>/);
console.log(match ? match[0] : "NOT FOUND");
