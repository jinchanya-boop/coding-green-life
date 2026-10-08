const fs = require('fs');
let file = 'D:/jinchanya/coding-green-life-phase2/src/lib/supabase.ts';
let content = fs.readFileSync(file, 'utf8');

const newFunc = `
export async function fetchStudentByCode(code: string) {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_code', code.trim())
      .limit(1)
      .single()
    if (error || !data) return null
    return data
  } catch (e) {
    return null
  }
}
`;

if (!content.includes('fetchStudentByCode')) {
  content += newFunc;
  fs.writeFileSync(file, content, 'utf8');
  console.log("Added fetchStudentByCode to supabase.ts");
} else {
  console.log("fetchStudentByCode already exists");
}
