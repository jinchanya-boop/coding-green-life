const fs = require('fs');
const file = 'D:/jinchanya/coding-green-life-phase2/src/context/StudentContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "createProfile: (name: string, className: string, avatar: AvatarId) => void",
  "createProfile: (name: string, className: string, avatar: AvatarId) => Promise<void>"
);

fs.writeFileSync(file, content, 'utf8');
console.log("Updated interface in StudentContext.tsx");
