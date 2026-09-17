import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { MissionAttempt, Reflection, StudentProfile } from '../types'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseEnabled = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url as string, anonKey as string)
  : null

// All sync functions no-op safely when Supabase isn't configured, so the app is
// fully playable offline (localStorage only) and gains multi-device / teacher
// dashboard sync the moment a project URL + anon key are supplied via .env.

export async function syncStudent(profile: StudentProfile) {
  if (!supabase) return
  await supabase.from('students').upsert({
    id: profile.id,
    student_code: profile.studentCode,
    name: profile.name,
    class_name: profile.className,
    avatar: profile.avatar,
    xp: profile.xp,
    level: profile.level,
    green_energy: profile.greenEnergy,
    badges: profile.badges,
    missions: profile.missions,
    pre_test: profile.preTest ?? null,
    post_test: profile.postTest ?? null,
    updated_at: new Date().toISOString(),
  })
}

export async function syncAttempt(studentId: string, attempt: MissionAttempt) {
  if (!supabase) return
  await supabase.from('mission_attempts').insert({
    student_id: studentId,
    mission_id: attempt.missionId,
    attempt_number: attempt.attemptNumber,
    score: attempt.score,
    max_score: attempt.maxScore,
    correct_count: attempt.correctCount,
    wrong_count: attempt.wrongCount,
    error_types: attempt.errorTypes,
    time_seconds: attempt.timeSeconds,
    completed_at: attempt.completedAt,
  })
}

export async function syncReflection(studentId: string, reflection: Reflection) {
  if (!supabase) return
  await supabase.from('reflections').insert({
    student_id: studentId,
    mission_id: reflection.missionId,
    learned: reflection.learned,
    problem: reflection.problem,
    solution: reflection.solution,
    mistake: reflection.mistake,
    improve: reflection.improve,
    real_life_use: reflection.realLifeUse,
    created_at: reflection.createdAt,
  })
}

export async function fetchStudents() {
  if (!supabase) return []
  const { data, error } = await supabase.from('students').select('*').order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchAttempts() {
  if (!supabase) return []
  const { data, error } = await supabase.from('mission_attempts').select('*').order('completed_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchReflections() {
  if (!supabase) return []
  const { data, error } = await supabase.from('reflections').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// ---------------------------------------------------------------------------
// Creator Studio: student-authored projects
// ---------------------------------------------------------------------------

export async function saveProject(project: Record<string, unknown>) {
  if (!supabase) return
  const { error } = await supabase.from('projects').upsert(project)
  if (error) throw error
}

export async function fetchMyProjects(studentId: string) {
  if (!supabase) return []
  const { data, error } = await supabase.from('projects').select('*').eq('student_id', studentId).order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchAllProjects() {
  if (!supabase) return []
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function deleteProject(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Peer Feedback
// ---------------------------------------------------------------------------

export async function submitPeerFeedback(feedback: Record<string, unknown>) {
  if (!supabase) return
  const { error } = await supabase.from('peer_feedback').insert(feedback)
  if (error) throw error
}

export async function fetchFeedbackForProject(projectId: string) {
  if (!supabase) return []
  const { data, error } = await supabase.from('peer_feedback').select('*').eq('project_id', projectId).order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchAllFeedback() {
  if (!supabase) return []
  const { data, error } = await supabase.from('peer_feedback').select('*')
  if (error) throw error
  return data ?? []
}

// ---------------------------------------------------------------------------
// Rubric (teacher-scored, 4-level, per criterion)
// ---------------------------------------------------------------------------

export async function saveRubricScore(row: Record<string, unknown>) {
  if (!supabase) return
  const { error } = await supabase.from('rubric_scores').upsert(row, { onConflict: 'student_id,criterion' })
  if (error) throw error
}

export async function fetchRubricForStudent(studentId: string) {
  if (!supabase) return []
  const { data, error } = await supabase.from('rubric_scores').select('*').eq('student_id', studentId)
  if (error) throw error
  return data ?? []
}

export async function fetchAllRubrics() {
  if (!supabase) return []
  const { data, error } = await supabase.from('rubric_scores').select('*')
  if (error) throw error
  return data ?? []
}
