const fs = require('fs');
let content = fs.readFileSync('very_old_onboarding.tsx', 'utf8');
console.log(content.match(/<div className="bg-\[var\(--color-surface\)\].*?>/)[0]);
console.log(content.match(/<label.*?>/g).slice(0,3));
console.log(content.match(/<input.*?>/g).slice(0,3));
