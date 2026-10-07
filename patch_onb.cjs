const fs = require('fs');
const file = 'D:/jinchanya/coding-green-life-phase2/src/pages/Onboarding.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHandleStart = `  const handleStart = () => {
    if (!canStart) return
    createProfile(name, className, avatar)
    navigate('/world')
  }`;
  
const newHandleStart = `  const [isStarting, setIsStarting] = useState(false);
  const handleStart = async () => {
    if (!canStart || isStarting) return
    setIsStarting(true);
    await createProfile(name, className, avatar)
    navigate('/world')
  }`;
  
content = content.replace(oldHandleStart, newHandleStart);

// Also change the button text to show loading state
content = content.replace(
  `onClick={handleStart}`,
  `onClick={handleStart} disabled={isStarting}`
);
content = content.replace(
  `>เริ่มเลย<`,
  `>{isStarting ? 'กำลังค้นหาข้อมูล...' : 'เริ่มเลย'}<`
);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched Onboarding.tsx");
