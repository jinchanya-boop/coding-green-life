const fs = require('fs');
let content = fs.readFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', 'utf8');

const replacement = `
  const exportReflectionsCsv = () => {
    if (reflections.length === 0) return
    const headers = ['student_code', 'mission_id', 'learned', 'problem', 'solution', 'mistake', 'improvement', 'real_life_usage', 'created_at']
    
    const rows = reflections.map(r => {
      const student = students.find(s => s.id === r.student_id)
      const code = student ? student.student_code : r.student_id.substring(0,6)
      return [
        code,
        r.mission_id,
        (r.learned || '').replace(/"/g, '""'),
        (r.problem || '').replace(/"/g, '""'),
        (r.solution || '').replace(/"/g, '""'),
        (r.mistake || '').replace(/"/g, '""'),
        (r.improvement || '').replace(/"/g, '""'),
        (r.real_life_usage || '').replace(/"/g, '""'),
        r.created_at
      ].map(v => \`"\${v}"\`).join(',')
    })
    
    const csvContent = "data:text/csv;charset=utf-8,\\uFEFF" + [headers.join(','), ...rows].join('\\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'cgl_reflections.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
`;

if (!content.includes('exportReflectionsCsv')) {
  content = content.replace(/const exportSurveysCsv = [\s\S]*?\}\n/, match => match + '\n' + replacement.trim() + '\n');
}

const btnReplacement = `
            <button
              onClick={exportReflectionsCsv}
              className="px-4 py-2 bg-[var(--color-coral)] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              Export สะท้อนคิด (CSV)
            </button>
`;

if (!content.includes('Export สะท้อนคิด (CSV)')) {
  content = content.replace(
    /Export แบบประเมินความพึงพอใจ \(CSV\)\s*<\/button>/,
    match => match + btnReplacement
  );
}

fs.writeFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', content, 'utf8');
console.log("Added exportReflectionsCsv");
