const fs = require('fs');
let ctxFile = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let ctxContent = fs.readFileSync(ctxFile, 'utf8');
console.log(ctxContent.substring(0, 300));
