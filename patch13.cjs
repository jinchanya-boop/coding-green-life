const fs = require('fs');
const https = require('https');
const path = require('path');

async function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data).toString('utf8')));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const tdUrl = 'https://raw.githubusercontent.com/jinchanya-boop/coding-green-life/a4b873f24562c28b68b31124c22be24cca3fe42f/src/pages/TeacherDashboard.tsx';
    const swUrl = 'https://raw.githubusercontent.com/jinchanya-boop/coding-green-life/a4b873f24562c28b68b31124c22be24cca3fe42f/src/pages/StudentWorld.tsx';
    const scUrl = 'https://raw.githubusercontent.com/jinchanya-boop/coding-green-life/a4b873f24562c28b68b31124c22be24cca3fe42f/src/context/StudentContext.tsx';
    
    let tdContent = await download(tdUrl);
    let swContent = await download(swUrl);
    let scContent = await download(scUrl);

    // Patch TeacherDashboard
    const getLocalDataCode = `function getLocalData() {
  const s: any[] = []; const a: any[] = []; const r: any[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('cgl_student_')) {
      try {
        const p = JSON.parse(localStorage.getItem(key) || '{}');
        if (!p.id) continue;
        s.push({
          id: p.id, student_code: p.studentCode || '', name: p.name || '', class_name: p.className || '', avatar: p.avatar || 'fern',
          xp: p.xp || 0, level: p.level || 1, green_energy: p.greenEnergy || 0, badges: p.badges || [], missions: p.missions || {}, pre_test: p.preTest || null, post_test: p.postTest || null, updated_at: p.createdAt || new Date().toISOString()
        });
        if (p.attempts) { p.attempts.forEach((att: any) => a.push({ student_id: p.id, mission_id: att.missionId, attempt_number: att.attemptNumber, score: att.score, max_score: att.maxScore, correct_count: att.correctCount, wrong_count: att.wrongCount, error_types: att.errorTypes || [], time_seconds: att.timeSeconds || 0, completed_at: att.completedAt || new Date().toISOString() })); }
        if (p.reflections) { p.reflections.forEach((ref: any) => r.push({ student_id: p.id, mission_id: ref.missionId, learned: ref.learned, problem: ref.problem, solution: ref.solution, mistake: ref.mistake, improve: ref.improve, real_life_use: ref.realLifeUse, created_at: ref.createdAt || new Date().toISOString() })); }
      } catch (e) {}
    }
  }
  return { s, a, r };
}`;
    tdContent = tdContent.replace('export default function TeacherDashboard() {', getLocalDataCode + '\nexport default function TeacherDashboard() {');
    const thaiErrorMsg = Buffer.from('4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiU4LmD4LiZ4LiB4Liy4Lij4LmC4Lir4Lil4LiU4LiC4LmJ4Lit4Lih4Li54LilICjguYHguKXguLDguYTguKHguYjguKHguLXguILguYnguK3guKHguLnguKXguYPguJnguYDguITguKPguLfguYjguK3guIfguJnguLXguYgp', 'base64').toString('utf8');
    const newCatch = `.catch((e) => {
        console.error('Supabase fetch failed', e);
        const local = getLocalData();
        if (local.s.length > 0) { setStudents(local.s); setAttempts(local.a); setReflections(local.r); } else { setError(e instanceof Error ? e.message : '` + thaiErrorMsg + `'); }
      })`;
    tdContent = tdContent.replace(/\.catch\(\(e\) => setError\([\s\S]*?\)\)/, newCatch);

    // Patch StudentWorld
    const titleStr = Buffer.from('4LmA4Lib4Lil4Li14LmI4Lii4LiZ4Lic4Li54LmJ4LmA4Lil4LmI4LiZIC8g4Lit4Lit4LiB4LiI4Liy4LiB4Lij4Liw4Lia4Lia', 'base64').toString('utf8');
    const confirmStr = Buffer.from('4LmA4Lib4Lil4Li14LmI4Lii4LiZ4Lic4Li54LmJ4LmA4Lil4LmI4LiZPyDguILguYnguK3guKHguLnguKXguYPguJnguYDguITguKPguLfguYjguK3guIfguJnguLXguYnguIjguLDguJbguLnguIHguKXguYnguLLguIc=', 'base64').toString('utf8');
    const newDiv = `            <p className="text-[10px] text-[var(--color-ink-dim)]">Green Energy</p>\n          </div>\n          <button\n            title="` + titleStr + `"\n            onClick={() => { if (window.confirm("` + confirmStr + `")) { localStorage.removeItem('cgl_active_student_id'); window.location.href = '#/'; window.location.reload(); } }}\n            className="ml-2 w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 hover:opacity-80 transition-opacity"\n            style={{ background: "rgba(255,100,100,0.12)", border: "1px solid var(--color-coral)" }}\n          >\n            🚪\n          </button>`;
    swContent = swContent.replace(/<p className="text-\[10px\] text-\[var\(--color-ink-dim\)\]">Green Energy<\/p>\s*<\/div>/, newDiv);

    // Patch StudentContext
    scContent = scContent.replace('localStorage.clear()', "localStorage.removeItem('cgl_active_student_id')");

    // Write files
    fs.writeFileSync(path.join('D:', 'jinchanya', 'coding-green-life-phase2', 'src', 'pages', 'TeacherDashboard.tsx'), tdContent, 'utf8');
    fs.writeFileSync(path.join('D:', 'jinchanya', 'coding-green-life-phase2', 'src', 'pages', 'StudentWorld.tsx'), swContent, 'utf8');
    fs.writeFileSync(path.join('D:', 'jinchanya', 'coding-green-life-phase2', 'src', 'context', 'StudentContext.tsx'), scContent, 'utf8');
    
    console.log("Success! Files perfectly patched.");
  } catch (err) {
    console.error(err);
  }
}
run();
