const fs = require('fs');
let ctxFile = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let ctxContent = fs.readFileSync(ctxFile, 'utf8');

// The line is: const exactName = name.trim();
// Change it to: const exactName = name.trim().replace(/\s+/g, ' ');
ctxContent = ctxContent.replace(
  "const exactName = name.trim();",
  "const exactName = name.trim().replace(/\\s+/g, ' ');"
);

fs.writeFileSync(ctxFile, ctxContent, 'utf8');
console.log("Updated exactName normalization in StudentContext.tsx");
