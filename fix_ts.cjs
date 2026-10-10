const fs = require('fs');
let content = fs.readFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', 'utf8');

// The survey type is inferred as { student_id, fun_score, understanding_score, self_motivation_score, real_life_score, overall_score, comment }
const replacement = `
  const exportSurveysCsv = () => {
    if (surveys.length === 0) return
    const headers = ['รหัสผู้เล่น', 'ข้อ 1 (สนุก)', 'ข้อ 2 (เข้าใจ)', 'ข้อ 3 (อยากเรียนรู้)', 'ข้อ 4 (ชีวิตประจำวัน)', 'ข้อ 5 (ภาพรวม)', 'ข้อเสนอแนะ']
    
    const rows = surveys.map(s => {
      const student = students.find(st => st.id === s.student_id)
      const code = student ? student.student_code : s.student_id.substring(0,6)
      return [
        code,
        s.fun_score || '',
        s.understanding_score || '',
        s.self_motivation_score || '',
        s.real_life_score || '',
        s.overall_score || '',
        (s.comment || '').replace(/"/g, '""')
      ].map(v => \`"\${v}"\`).join(',')
    })
    
    const csvContent = "data:text/csv;charset=utf-8,\\uFEFF" + [headers.join(','), ...rows].join('\\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'cgl_satisfaction_surveys.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
`;

content = content.replace(/const exportSurveysCsv = \(\) => \{[\s\S]*?document\.body\.removeChild\(link\)\n  \}/, replacement.trim());
fs.writeFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/TeacherDashboard.tsx', content, 'utf8');
console.log("Fixed exportSurveysCsv typescript errors");
