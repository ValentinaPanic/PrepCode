interface QuizSummaryProps {
  score: number
  total: number
  onRetry: () => void
  onHome: () => void
}

function getMessage(percentage: number): string {
  if (percentage === 100) return 'Perfect score. Seriously impressive.'
  if (percentage >= 80) return 'Strong result. A few gaps to iron out.'
  if (percentage >= 60) return 'Solid foundation. Worth reviewing the misses.'
  if (percentage >= 40) return 'Getting there. More practice will help.'
  return 'Tough session. Good data on what to focus on.'
}

export function QuizSummary({ score, total, onRetry, onHome }: QuizSummaryProps) {
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100)

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 py-12 gap-8">
      {/* Score ring */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-28 h-28 rounded-full border-4 border-indigo-500 flex items-center justify-center">
          <span className="text-3xl font-bold text-zinc-900 dark:text-white">{percentage}%</span>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          {score} correct out of {total}
        </p>
      </div>

      <p className="text-zinc-700 dark:text-zinc-300 text-center max-w-xs">{getMessage(percentage)}</p>

      <div className="flex gap-3">
        <button
          onClick={onHome}
          className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500 text-sm transition-colors"
        >
          Home
        </button>
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
