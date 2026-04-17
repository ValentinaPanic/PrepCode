import { challenges } from '../../data/componentChallenges'
import type { ComponentChallenge } from '../../data/componentChallenges'

interface Props {
  onSelect: (challenge: ComponentChallenge) => void
}

export function ChallengeSelector({ onSelect }: Props) {
  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold text-white mb-1">Choose a challenge</h2>
      <p className="text-zinc-400 text-sm mb-6">
        Build each component with correct, accessible HTML. Scored on semantics, not style.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {challenges.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="text-left bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-indigo-500 rounded-xl p-4 transition-colors"
          >
            <span className="text-zinc-500 text-xs font-mono">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="text-white text-sm font-medium mt-1">{c.title}</h3>
            <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{c.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
