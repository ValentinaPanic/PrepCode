import { PHASES, type PhaseId } from '../../lib/blocks'

interface Props {
  covered: PhaseId[]
}

export function CoverageTracker({ covered }: Props) {
  const coveredSet = new Set(covered)
  const done = covered.length
  const total = PHASES.length
  const percent = Math.round((done / total) * 100)

  return (
    <aside className="w-60 shrink-0 border-l border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto hidden lg:block">
      <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-3">
        Coverage
      </h3>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{done} / {total} phases</span>
          <span className="font-mono text-xs text-zinc-900 dark:text-white font-semibold">{percent}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <ul className="flex flex-col gap-1.5">
        {PHASES.map(phase => {
          const isCovered = coveredSet.has(phase.id)
          return (
            <li
              key={phase.id}
              className={`flex items-center gap-2 py-1 text-sm transition-colors ${
                isCovered ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-500'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                isCovered
                  ? 'bg-indigo-500 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600'
              }`}>
                {isCovered ? '✓' : ''}
              </span>
              <span>{phase.label}</span>
            </li>
          )
        })}
      </ul>

      <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-5 leading-relaxed">
        The interviewer marks phases covered as you commit to specifics.
      </p>
    </aside>
  )
}
