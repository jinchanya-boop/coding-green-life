import { useState } from 'react'
import type { OpenChallenge } from '../data/codingLab'

export function LabOpenChallenge({ challenge, onAnswered }: { challenge: OpenChallenge; onAnswered: (completed: boolean) => void }) {
  const [text, setText] = useState('')
  const canSubmit = text.trim().length > 10

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
        <p className="text-sm font-medium">{challenge.prompt}</p>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={challenge.placeholder}
        rows={5}
        className="w-full rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] px-3.5 py-2.5 outline-none focus:border-[var(--color-mint)] text-sm resize-none"
      />
      <button
        onClick={() => onAnswered(canSubmit)}
        disabled={!canSubmit}
        className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
        style={{ background: 'var(--color-mint)' }}
      >
        ส่งไอเดีย
      </button>
    </div>
  )
}
