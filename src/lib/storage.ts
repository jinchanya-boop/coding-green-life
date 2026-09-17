import type { StudentProfile } from '../types'

const KEY_PREFIX = 'cgl_student_'
const ACTIVE_KEY = 'cgl_active_student_id'

export function saveProfile(profile: StudentProfile) {
  localStorage.setItem(KEY_PREFIX + profile.id, JSON.stringify(profile))
  localStorage.setItem(ACTIVE_KEY, profile.id)
}

export function loadActiveProfile(): StudentProfile | null {
  const id = localStorage.getItem(ACTIVE_KEY)
  if (!id) return null
  return loadProfile(id)
}

export function loadProfile(id: string): StudentProfile | null {
  const raw = localStorage.getItem(KEY_PREFIX + id)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StudentProfile
  } catch {
    return null
  }
}

export function clearActiveProfile() {
  localStorage.removeItem(ACTIVE_KEY)
}

export function newId(): string {
  return crypto.randomUUID()
}
