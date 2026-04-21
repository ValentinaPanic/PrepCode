import { challenges } from '../../data/componentChallenges'
import type { ComponentChallenge } from '../../data/componentChallenges'
import type { ChallengeResult } from '../../types'

interface Props {
  onSelect: (challenge: ComponentChallenge) => void
  challengeResults?: ChallengeResult[]
}

export function ChallengeSelector({ onSelect, challengeResults = [] }: Props) {
  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Choose a challenge</h2>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
        Build each component with correct, accessible HTML. Scored on semantics, not style.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {challenges.map((c, i) => {
          const result = challengeResults.find(r => r.challengeId === c.id)
          const isPerfect = result && result.bestScore === 100

          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className={`text-left rounded-xl p-4 transition-colors border ${
                isPerfect
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-800/40 hover:border-emerald-500 dark:hover:border-emerald-600'
                  : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-indigo-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-500 text-xs font-mono">{String(i + 1).padStart(2, '0')}</span>
                {result && (
                  <span className={`text-xs font-medium ${isPerfect ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-500'}`}>
                    {result.bestScore}%
                  </span>
                )}
              </div>
              <h3 className="text-zinc-900 dark:text-white text-sm font-medium mt-1">{c.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-1 line-clamp-2">{c.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
