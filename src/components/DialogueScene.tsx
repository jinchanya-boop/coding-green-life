import { useState } from 'react'
import { CharacterAvatar, type CharacterVariant } from './CharacterAvatar'

export interface DialogueLine {
  speaker: string
  variant: CharacterVariant
  text: string
  color?: string
}

export function DialogueScene({ lines, onDone, buttonLabel = 'เริ่มกันเลย!' }: { lines: DialogueLine[]; onDone: () => void; buttonLabel?: string }) {
  const [index, setIndex] = useState(0)
  const line = lines[index]
  const isLast = index === lines.length - 1

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5 border space-y-4 min-h-[180px] flex flex-col justify-between"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-surface-3)' }}
      >
        <div className="flex items-start gap-3">
          <div
            className="shrink-0 rounded-full p-1"
            style={{ background: `${line.color ?? 'var(--color-mint)'}18`, border: `2px solid ${line.color ?? 'var(--color-mint)'}` }}
          >
            <CharacterAvatar variant={line.variant} size={52} />
          </div>
          <div className="flex-1 pt-1">
            <p className="text-xs font-medium mb-1" style={{ color: line.color ?? 'var(--color-mint)' }}>
              {line.speaker}
            </p>
            <p className="text-sm leading-relaxed">{line.text}</p>
          </div>
        </div>
        <div className="flex justify-center gap-1.5">
          {lines.map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: i === index ? 'var(--color-mint)' : 'var(--color-surface-3)' }}
            />
          ))}
        </div>
      </div>
      <button
        onClick={() => (isLast ? onDone() : setIndex((i) => i + 1))}
        className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
        style={{ background: 'var(--color-mint)' }}
      >
        {isLast ? buttonLabel : 'ถัดไป →'}
      </button>
    </div>
  )
}
