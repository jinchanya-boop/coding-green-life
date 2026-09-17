import { CharacterAvatar } from './CharacterAvatar'

export function Mascot({ mood, message }: { mood: 'idle' | 'great' | 'okay'; message: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0">
        <CharacterAvatar variant="green" mood={mood} size={52} />
      </div>
      <div
        className="relative rounded-2xl rounded-tl-sm px-3.5 py-2 text-sm flex-1"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-surface-3)' }}
      >
        {message}
      </div>
    </div>
  )
}
