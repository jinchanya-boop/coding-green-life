const fs = require('fs');
let content = fs.readFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/Onboarding.tsx', 'utf8');
console.log(content.substring(content.indexOf('return (')));
