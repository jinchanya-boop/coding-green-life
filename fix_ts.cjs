const fs = require('fs');
const file = 'D:/jinchanya/coding-green-life-phase2/src/pages/SatisfactionSurvey.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('const [alreadyDone, setAlreadyDone] = useState(false)', '');
content = content.replace('setAlreadyDone(true)', '');

fs.writeFileSync(file, content, 'utf8');
