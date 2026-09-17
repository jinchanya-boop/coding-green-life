export type AvatarId = 'fern' | 'coral' | 'moss' | 'ember'

export interface Badge {
  id: string
  name: string
  icon: string
  earnedAt: string
}

export interface MissionAttempt {
  missionId: string
  attemptNumber: number
  score: number
  maxScore: number
  correctCount: number
  wrongCount: number
  errorTypes: string[]
  timeSeconds: number
  completedAt: string
}

export interface Reflection {
  missionId: string
  learned: string
  problem: string
  solution: string
  mistake: string
  improve: string
  realLifeUse: string
  createdAt: string
}

export interface MissionState {
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed'
  bestScore: number
  attempts: number
  lastAttemptAt?: string
}

export interface LabLevelState {
  status: 'locked' | 'unlocked' | 'completed'
  bestScore: number
  attempts: number
}

export type AssessmentSkill = 'computationalThinking' | 'algorithm' | 'coding' | 'problemSolving'

export interface AssessmentResult {
  type: 'pre' | 'post'
  totalScore: number
  maxScore: number
  scoreBySkill: Record<AssessmentSkill, { correct: number; total: number }>
  takenAt: string
}

export interface StudentProfile {
  id: string
  studentCode: string
  name: string
  className: string
  avatar: AvatarId
  xp: number
  level: number
  greenEnergy: number
  badges: Badge[]
  missions: Record<string, MissionState>
  codingLab: Record<string, LabLevelState>
  attempts: MissionAttempt[]
  reflections: Reflection[]
  preTest?: AssessmentResult
  postTest?: AssessmentResult
  createdAt: string
}

export type GreenHeroLevel =
  | 'GREEN ROOKIE'
  | 'GREEN EXPLORER'
  | 'GREEN CODER'
  | 'GREEN DEBUGGER'
  | 'GREEN CREATOR'
  | 'GREEN HERO'

export interface MissionDef {
  id: string
  order: number
  code: string
  title: string
  role: string
  gpas: string
  threeR: string
  learningGoal: string
  storyIntro: string
  maxScore: number
  unlockRequires?: string
}
