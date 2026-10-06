const fs = require('fs');
const file = 'D:/jinchanya/coding-green-life-phase2/src/pages/SatisfactionSurvey.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the broken useEffect
const regex = /useEffect\(\(\) => \{[\s\S]*?\}, \[profile\]\)/;
const newEffect = `  const [alreadyDone, setAlreadyDone] = useState(false)
  useEffect(() => {
    if (!profile || !supabaseEnabled) {
      setLoading(false)
      return
    }
    fetchMySatisfactionSurvey(profile.id)
      .then((row: any) => {
        if (row) {
          setAlreadyDone(true)
          setScores({
            funScore: row.fun_score || 0,
            understandingScore: row.understanding_score || 0,
            selfMotivationScore: row.self_motivation_score || 0,
            realLifeScore: row.real_life_score || 0,
            overallScore: row.overall_score || 0,
          })
          if (row.comment) setComment(row.comment)
        }
      })
      .finally(() => setLoading(false))
  }, [profile])`;
  
content = content.replace(regex, newEffect);

fs.writeFileSync(file, content, 'utf8');
