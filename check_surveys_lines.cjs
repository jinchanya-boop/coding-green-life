const fs = require('fs');
let content = fs.readFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', 'utf8');
const lines = content.split('\n');
for (let i=0; i<30; i++) {
  if (lines[i].includes('surveys')) console.log(lines[i]);
}
