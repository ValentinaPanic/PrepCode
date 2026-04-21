import { CodeText } from './CodeText'

interface QuizExplanationProps {
  text: string
  isLoading: boolean
  isCorrect: boolean
}

export function QuizExplanation({ text, isLoading, isCorrect }: QuizExplanationProps) {
  return (
    <div className={`
      mx-6 mb-4 p-4 rounded-xl border text-sm leading-relaxed
      ${isCorrect
        ? 'bg-emerald-50 dark:bg-zinc-800/60 border-emerald-200 dark:border-emerald-800/40'
        : 'bg-red-50 dark:bg-zinc-800/60 border-red-200 dark:border-red-800/40'
      }
    `}>
      <p className={`font-semibold mb-1.5 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
      </p>
      {isLoading && !text ? (
        <span className="text-zinc-500 dark:text-zinc-500">Thinking...</span>
      ) : (
        <div className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
          <CodeText text={text} />
        </div>
      )}
    </div>
  )
}
