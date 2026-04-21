interface QuizScoreBarProps {
  score: number
  total: number
}

export function QuizScoreBar({ score, total }: QuizScoreBarProps) {
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100)

  return (
    <div className="flex items-center gap-4 px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">
      <span className="text-zinc-600 dark:text-zinc-400 text-sm">
        Score: <span className="text-zinc-900 dark:text-white font-semibold">{score}</span>
        <span className="text-zinc-400 dark:text-zinc-600"> / {total}</span>
      </span>

      <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="text-zinc-500 dark:text-zinc-500 text-xs">{percentage}%</span>
    </div>
  )
}
