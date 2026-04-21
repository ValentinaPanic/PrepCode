import { systemDesignTopics, pickRandomTopic, type SystemDesignTopic } from '../../data/systemDesignTopics'

interface Props {
  onStart: (topic: SystemDesignTopic) => void
  onShowPastSessions: () => void
  hasPastSessions: boolean
}

export function SystemDesignSetup({ onStart, onShowPastSessions, hasPastSessions }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Intro */}
        <div className="mb-10">
          <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 mb-3">
            // new interview session
          </p>
          <h1 className="text-zinc-900 dark:text-white text-3xl font-bold tracking-tight">
            Pick a topic to design.
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base mt-3 max-w-2xl leading-relaxed">
            The interviewer will push you through requirements, API contracts, data model, scaling, and failure modes.
            No lectures — commit to decisions and defend them.
          </p>
        </div>

        {/* Surprise me + Resume row */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => onStart(pickRandomTopic())}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            🎲 Surprise me
          </button>
          {hasPastSessions && (
            <button
              onClick={onShowPastSessions}
              className="px-5 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg transition-colors"
            >
              Resume past session →
            </button>
          )}
        </div>

        {/* Topic grid */}
        <h2 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-4">
          Or pick a topic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {systemDesignTopics.map(topic => (
            <button
              key={topic.id}
              onClick={() => onStart(topic)}
              className="group text-left p-4 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all"
            >
              <h3 className="text-zinc-900 dark:text-white font-medium text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                {topic.label}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                {topic.pitch}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
