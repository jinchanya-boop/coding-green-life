import type { AvatarId } from '../types'

export const AVATARS: { id: AvatarId; label: string; emoji: string; color: string }[] = [
  { id: 'fern', label: 'เฟิร์น', emoji: '🌿', color: '#5EEAD4' },
  { id: 'coral', label: 'คอรัล', emoji: '🪸', color: '#F2765C' },
  { id: 'moss', label: 'มอส', emoji: '🍃', color: '#8FD694' },
  { id: 'ember', label: 'เอมเบอร์', emoji: '🔥', color: '#F4B942' },
]

export function Avatar({ id, size = 56 }: { id: AvatarId; size?: number }) {
  const a = AVATARS.find((v) => v.id === id) ?? AVATARS[0]
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: `${a.color}22`,
        border: `2px solid ${a.color}`,
      }}
    >
      {a.emoji}
    </div>
  )
}
