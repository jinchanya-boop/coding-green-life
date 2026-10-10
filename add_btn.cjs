const fs = require('fs');
let content = fs.readFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', 'utf8');

const surveyBtn = `
            <button
              onClick={exportSurveysCsv}
              className="px-4 py-2 bg-[var(--color-gold)] text-[var(--color-bg-deep)] rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              Export แบบประเมินความพึงพอใจ (CSV)
            </button>
`
content = content.replace(
  /<button\s+onClick=\{exportAttemptsCsv\}[\s\S]*?Export คะแนนรายภารกิจ \(CSV\)\s*<\/button>/,
  match => match + surveyBtn
);
fs.writeFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', content, 'utf8');
console.log("Added button");
