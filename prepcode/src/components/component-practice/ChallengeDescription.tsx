import { useState } from 'react'
import type { ComponentChallenge } from '../../data/componentChallenges'

interface Props {
  challenge: ComponentChallenge
}

export function ChallengeDescription({ challenge }: Props) {
  const [showHints, setShowHints] = useState(false)

  return (
    <div className="mb-4">
      <h2 className="text-white text-lg font-semibold">{challenge.title}</h2>
      <p className="text-zinc-400 text-sm mt-1">{challenge.description}</p>

      <button
        onClick={() => setShowHints(!showHints)}
        className="text-indigo-400 text-xs mt-2 hover:text-indigo-300 transition-colors"
      >
        {showHints ? 'Hide hints' : 'Show hints'}
      </button>

      {showHints && (
        <ul className="mt-2 space-y-1">
          {challenge.hints.map((hint, i) => (
            <li key={i} className="text-zinc-500 text-xs pl-3 border-l border-zinc-700">
              {hint}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
