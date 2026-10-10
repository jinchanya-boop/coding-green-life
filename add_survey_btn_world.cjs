const fs = require('fs');
let content = fs.readFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/StudentWorld.tsx', 'utf8');

const replacement = `          <button
            onClick={() => navigate('/survey')}
            title="ทำแบบประเมินความพึงพอใจ"
            className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-gold)] text-[var(--color-bg-deep)] hover:opacity-90 transition-opacity"
          >
            📋 แบบประเมิน
          </button>
          <button
            title="เปลี่ยนผู้เล่น / ออกจากระบบ"`

content = content.replace(/          <button\s*title="เปลี่ยนผู้เล่น \/ ออกจากระบบ"/, replacement);
fs.writeFileSync('D:/jinchanya/coding-green-life-phase2/src/pages/StudentWorld.tsx', content, 'utf8');
console.log("Added survey button to StudentWorld");
