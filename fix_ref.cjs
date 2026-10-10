const fs = require('fs');
let content = fs.readFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', 'utf8');

content = content.replace(/\(r\.improvement \|\| ''\)/, '(r.improve || \'\')');
content = content.replace(/\(r\.real_life_usage \|\| ''\)/, '(r.real_life_use || \'\')');

fs.writeFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', content, 'utf8');
console.log("Fixed properties");
