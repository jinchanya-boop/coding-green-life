import { useMemo, useState } from 'react'
import type { McChallenge } from '../data/codingLab'
import { shuffleOptions } from '../lib/shuffle'

const OPTION_COLORS = ['#5EEAD4', '#F4B942', '#8FD694', '#38BDF8']

export function LabMcChallenge({ challenge, onAnswered }: { challenge: McChallenge; onAnswered: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null)
  const { options, correctIndex } = useMemo(() => shuffleOptions(challenge.options, challenge.correctIndex), [challenge.id])

  const handleConfirm = () => {
    if (selected === null || feedback) return
    const correct = selected === correctIndex
    setFeedback({ correct })
  }

  const handleNext = () => onAnswered(feedback?.correct ?? false)

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-surface-3)]">
        <p className="text-sm font-medium">{challenge.prompt}</p>
      </div>
      <div className="space-y-2.5">
        {options.map((opt, idx) => {
          const color = OPTION_COLORS[idx % OPTION_COLORS.length]
          const isChosenCorrect = feedback && idx === correctIndex
          const isPicked = selected === idx
          return (
            <button
              key={idx}
              onClick={() => !feedback && setSelected(idx)}
              disabled={!!feedback}
              className="w-full text-left rounded-xl py-2.5 px-3.5 text-sm border disabled:cursor-default flex items-center gap-2.5"
              style={{
                borderColor: isChosenCorrect ? 'var(--color-mint)' : isPicked ? 'var(--color-gold)' : 'var(--color-surface-3)',
                background: 'var(--color-surface-2)',
              }}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                style={{ background: `${color}22`, border: `1.5px solid ${color}` }}
              >
                {idx + 1}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
      {feedback && (
        <div
          className="rounded-lg p-3.5 text-sm"
          style={{
            background: feedback.correct ? 'rgba(94,234,212,0.12)' : 'rgba(242,118,92,0.12)',
            color: feedback.correct ? 'var(--color-mint)' : 'var(--color-coral)',
          }}
        >
          {challenge.explain}
        </div>
      )}
      {!feedback ? (
        <button
          onClick={handleConfirm}
          disabled={selected === null}
          className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)] disabled:opacity-40"
          style={{ background: 'var(--color-mint)' }}
        >
          ยืนยันคำตอบ
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full rounded-lg py-3 font-display font-medium text-[var(--color-bg-deep)]"
          style={{ background: 'var(--color-mint)' }}
        >
          ถัดไป →
        </button>
      )}
    </div>
  )
}
