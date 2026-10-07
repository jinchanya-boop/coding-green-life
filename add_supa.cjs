const fs = require('fs');
const file = 'D:/jinchanya/coding-green-life-phase2/src/lib/supabase.ts';
let content = fs.readFileSync(file, 'utf8');

const newFunc = `
export async function fetchStudentByName(name: string) {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('name', name.trim())
      .limit(1)
      .single()
    if (error || !data) return null
    return data
  } catch (e) {
    return null
  }
}
`;

content += newFunc;
fs.writeFileSync(file, content, 'utf8');
console.log("Added fetchStudentByName to supabase.ts");
