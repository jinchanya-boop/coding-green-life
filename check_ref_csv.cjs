const fs = require('fs');
let content = fs.readFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', 'utf8');
const match = content.match(/exportReflectionsCsv = [\s\S]*?\}]/);
console.log(content.match(/exportReflectionsCsv = [\s\S]*?\n  }/)[0]);
