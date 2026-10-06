const fs = require('fs');
const file = 'D:/jinchanya/coding-green-life-phase2/src/pages/SatisfactionSurvey.tsx';
let content = fs.readFileSync(file, 'utf8');

const thaiSubmit = Buffer.from('4Liq4LmI4LiH4LmB4Lia4Lia4Liq4Liz4Lij4Lin4LiI', 'base64').toString('utf8');
const thaiUpdate = Buffer.from('4Lit4Lix4Lib4LmA4LiU4LiV4LmB4Lia4Lia4Liq4Liz4Lij4Lin4LiI', 'base64').toString('utf8');
const newBtn = `{alreadyDone ? "` + thaiUpdate + `" : "` + thaiSubmit + `"}`;

// Find the submit button which has onClick={handleSubmit}
const targetBtnRegex = new RegExp('onClick={handleSubmit}[\\s\\S]*?>\\s*' + thaiSubmit + '\\s*</button>');
const match = content.match(targetBtnRegex);
if (match) {
  content = content.replace(targetBtnRegex, match[0].replace(thaiSubmit, newBtn));
  fs.writeFileSync(file, content, 'utf8');
  console.log("Patched successfully!");
} else {
  console.log("Regex failed to find the button!");
}
