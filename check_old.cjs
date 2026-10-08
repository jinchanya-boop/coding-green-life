const fs = require('fs');
let content = fs.readFileSync('old_onboarding.tsx', 'utf8');
console.log(content.substring(content.indexOf('return (')));
