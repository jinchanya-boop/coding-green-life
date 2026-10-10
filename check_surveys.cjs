const fs = require('fs');
let content = fs.readFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', 'utf8');
const match = content.match(/const \[surveys.*?useState/);
console.log(content.substring(0, 500));
