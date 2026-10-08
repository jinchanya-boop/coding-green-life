const fs = require('fs');
let content = fs.readFileSync('very_old_onboarding.tsx', 'utf8');
console.log(content.substring(content.indexOf('return (')));
