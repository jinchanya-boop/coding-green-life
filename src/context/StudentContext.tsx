import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AvatarId, Badge, LabLevelState, MissionAttempt, Reflection, StudentProfile, AssessmentSkill } from '../types'
import { MISSIONS, getHeroLevel } from '../data/missions'
import { syncStudent, fetchStudentByName, fetchStudentByCode, supabaseEnabled, syncAttempt, syncReflection } from '../lib/supabase';
import { LAB_LEVELS } from '../data/codingLab'
import { loadActiveProfile, newId, saveProfile } from '../lib/storage'


interface StudentContextValue {
  profile: StudentProfile | null
  createProfile: (name: string, className: string, avatar: AvatarId) => Promise<void>
  loginWithCode: (code: string) => Promise<boolean>
  recordMissionResult: (
    missionId: string,
    result: { score: number; maxScore: number; correctCount: number; wrongCount: number; errorTypes: string[]; timeSeconds: number },
    reflection: Omit<Reflection, 'missionId' | 'createdAt'>
  ) => void
  recordLabLevel: (levelId: string, fraction: number) => void
  recordAssessment: (type: 'pre' | 'post', scoreBySkill: Record<AssessmentSkill, { correct: number; total: number }>) => void
  heroLevelName: string
  isMissionUnlocked: (missionId: string) => boolean
  resetProfile: () => void
}

const StudentContext = createContext<StudentContextValue | null>(null)

function initialMissionsMap(): StudentProfile['missions'] {
  const map: StudentProfile['missions'] = {}
  for (const m of MISSIONS) {
    map[m.id] = { status: m.unlockRequires ? 'locked' : 'unlocked', bestScore: 0, attempts: 0 }
  }
  return map
}

function initialLabMap(): StudentProfile['codingLab'] {
  const map: StudentProfile['codingLab'] = {}
  LAB_LEVELS.forEach((lvl, i) => {
    map[lvl.id] = { status: i === 0 ? 'unlocked' : 'locked', bestScore: 0, attempts: 0 }
  })
  return map
}

// Older saved profiles (before Coding Lab existed) won't have a `codingLab`
// field yet — backfill it lazily so the rest of the app can assume it's always present.
function withLabDefaults(p: StudentProfile): StudentProfile {
  if (p.codingLab) return p
  return { ...p, codingLab: initialLabMap() }
}

export function StudentProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile | null>(null)

  useEffect(() => {
    const loaded = loadActiveProfile()
    const withDefaults = loaded ? withLabDefaults(loaded) : null
    setProfile(withDefaults)
    // One-time backfill: a profile created back when Supabase wasn't
    // configured yet only ever lived in this browser's localStorage. Now
    // that Supabase is available, push it up so it shows in Class Progress
    // and the Teacher Dashboard without the student needing to do anything.
    if (withDefaults && supabaseEnabled) {
      void syncStudent(withDefaults)
    }
  }, [])

  const persist = (p: StudentProfile) => {
    setProfile(p)
    saveProfile(p)
    void syncStudent(p)
  }

  const createProfile = async (name: string, className: string, avatar: AvatarId) => {
    const exactName = name.trim().replace(/\s+/g, ' ');
    
    // 1. Try to find in localStorage first (fastest)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cgl_student_')) {
        try {
          const p = JSON.parse(localStorage.getItem(key) || '{}');
          if (p.name === exactName) {
            p.avatar = avatar;
            if (className.trim()) p.className = className.trim();
            persist(p);
            return;
          }
        } catch (e) {}
      }
    }

    // 2. If not found locally, try fetching from Supabase
    try {
      const row = await fetchStudentByName(exactName);
      if (row) {
        const p: StudentProfile = {
          id: row.id,
          studentCode: row.student_code,
          name: row.name,
          className: className.trim() || row.class_name,
          avatar: avatar,
          xp: row.xp,
          level: row.level,
          greenEnergy: row.green_energy,
                    badges: row.badges || [],
          missions: row.missions || initialMissionsMap(),
          codingLab: row.coding_lab || initialLabMap(),
          attempts: [],
          reflections: [],
          preTest: row.pre_test || undefined,
          postTest: row.post_test || undefined,
          createdAt: row.created_at,
        };
        persist(p);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    // 3. If completely new, create new profile
    const p: StudentProfile = {
      id: newId(),
      studentCode: name.trim().slice(0, 2).toUpperCase() + Math.floor(1000 + Math.random() * 9000),
      name: name.trim(),
      className: className.trim(),
      avatar,
      xp: 0,
      level: 1,
      greenEnergy: 0,
      badges: [],
      missions: initialMissionsMap(),
      codingLab: initialLabMap(),
      attempts: [],
      reflections: [],
      createdAt: new Date().toISOString(),
    }
    persist(p)
  }

  const loginWithCode = async (code: string): Promise<boolean> => {
    const exactCode = code.trim();
    if (!exactCode) return false;

    // 1. check localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cgl_student_')) {
        try {
          const p = JSON.parse(localStorage.getItem(key) || '{}');
          if (p.studentCode === exactCode) {
            persist(p);
            return true;
          }
        } catch (e) {}
      }
    }

    // 2. check supabase
    try {
      const row = await fetchStudentByCode(exactCode);
      if (row) {
        const p: StudentProfile = {
          id: row.id,
          studentCode: row.student_code,
          name: row.name,
          className: row.class_name,
          avatar: row.avatar as AvatarId,
          xp: row.xp,
          level: row.level,
          greenEnergy: row.green_energy,
          badges: row.badges || [],
          missions: row.missions || initialMissionsMap(),
          codingLab: row.coding_lab || initialLabMap(),
          attempts: [],
          reflections: [],
          createdAt: row.created_at,
        };
        persist(p);
        return true;
      }
    } catch (err) {}

    return false;
  };


  const isMissionUnlocked = (missionId: string) => {
    if (!profile) return false
    const def = MISSIONS.find((m) => m.id === missionId)
    if (!def) return false
    if (!def.unlockRequires) return true
    return profile.missions[def.unlockRequires]?.status === 'completed'
  }

  const recordMissionResult: StudentContextValue['recordMissionResult'] = (missionId, result, reflectionInput) => {
    if (!profile) return
    const prevState = profile.missions[missionId] ?? { status: 'unlocked', bestScore: 0, attempts: 0 }
    const attemptNumber = prevState.attempts + 1
    const attempt: MissionAttempt = {
      missionId,
      attemptNumber,
      score: result.score,
      maxScore: result.maxScore,
      correctCount: result.correctCount,
      wrongCount: result.wrongCount,
      errorTypes: result.errorTypes,
      timeSeconds: result.timeSeconds,
      completedAt: new Date().toISOString(),
    }
    const reflection: Reflection = {
      missionId,
      createdAt: new Date().toISOString(),
      ...reflectionInput,
    }

    const passed = result.score / result.maxScore >= 0.6
    const xpGain = Math.round(result.score * 0.6)
    const energyGain = Math.round(result.score * 0.3)

    const newBadges: Badge[] = [...profile.badges]
    if (passed && !newBadges.find((b) => b.id === `badge_${missionId}`)) {
      const def = MISSIONS.find((m) => m.id === missionId)
      newBadges.push({
        id: `badge_${missionId}`,
        name: `${def?.title ?? missionId} สำเร็จ`,
        icon: '🏅',
        earnedAt: new Date().toISOString(),
      })
    }

    const newMissions = { ...profile.missions }
    newMissions[missionId] = {
      status: passed ? 'completed' : 'in_progress',
      bestScore: Math.max(prevState.bestScore, result.score),
      attempts: attemptNumber,
      lastAttemptAt: attempt.completedAt,
    }
    if (passed) {
      const def = MISSIONS.find((m) => m.id === missionId)
      const nextDef = MISSIONS.find((m) => m.unlockRequires === def?.id)
      if (nextDef && newMissions[nextDef.id]?.status === 'locked') {
        newMissions[nextDef.id] = { ...newMissions[nextDef.id], status: 'unlocked' }
      }
    }

    const newXp = profile.xp + xpGain
    const updated: StudentProfile = {
      ...profile,
      xp: newXp,
      level: Math.floor(newXp / 150) + 1,
      greenEnergy: profile.greenEnergy + energyGain,
      badges: newBadges,
      missions: newMissions,
      attempts: [...profile.attempts, attempt],
      reflections: [...profile.reflections, reflection],
    }
    persist(updated)
    void syncAttempt(updated.id, attempt)
    void syncReflection(updated.id, reflection)
  }

  const recordLabLevel = (levelId: string, fraction: number) => {
    if (!profile) return
    const lab = profile.codingLab ?? initialLabMap()
    const prevState: LabLevelState = lab[levelId] ?? { status: 'unlocked', bestScore: 0, attempts: 0 }
    const score = Math.round(fraction * 100)
    const passed = fraction >= 0.7
    const attemptNumber = prevState.attempts + 1

    const newLab = { ...lab }
    newLab[levelId] = {
      status: passed ? 'completed' : prevState.status === 'completed' ? 'completed' : 'unlocked',
      bestScore: Math.max(prevState.bestScore, score),
      attempts: attemptNumber,
    }
    if (passed) {
      const idx = LAB_LEVELS.findIndex((l) => l.id === levelId)
      const next = LAB_LEVELS[idx + 1]
      if (next && (!newLab[next.id] || newLab[next.id].status === 'locked')) {
        newLab[next.id] = { status: 'unlocked', bestScore: 0, attempts: 0 }
      }
    }

    const xpGain = passed ? 15 : 5
    const energyGain = passed ? 10 : 3
    const newXp = profile.xp + xpGain
    const updated: StudentProfile = {
      ...profile,
      xp: newXp,
      level: Math.floor(newXp / 150) + 1,
      greenEnergy: profile.greenEnergy + energyGain,
      codingLab: newLab,
    }
    persist(updated)
  }

  const recordAssessment: StudentContextValue['recordAssessment'] = (type, scoreBySkill) => {
    if (!profile) return
    const totalCorrect = Object.values(scoreBySkill).reduce((sum, s) => sum + s.correct, 0)
    const totalQuestions = Object.values(scoreBySkill).reduce((sum, s) => sum + s.total, 0)
    const result = {
      type,
      totalScore: totalCorrect,
      maxScore: totalQuestions,
      scoreBySkill,
      takenAt: new Date().toISOString(),
    }
    const updated: StudentProfile = {
      ...profile,
      ...(type === 'pre' ? { preTest: result } : { postTest: result }),
    }
    persist(updated)
  }

  const resetProfile = () => {
    localStorage.removeItem('cgl_active_student_id')
    setProfile(null)
  }

  const heroLevelName = useMemo(() => (profile ? getHeroLevel(profile.xp) : 'GREEN ROOKIE'), [profile])

  return (
    <StudentContext.Provider
      value={{ profile, createProfile,
    loginWithCode, recordMissionResult, recordLabLevel, recordAssessment, heroLevelName, isMissionUnlocked, resetProfile }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const ctx = useContext(StudentContext)
  if (!ctx) throw new Error('useStudent must be used within StudentProvider')
  return ctx
}
