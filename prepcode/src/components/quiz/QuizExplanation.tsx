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
        ? 'bg-zinc-800/60 border-emerald-800/40'
        : 'bg-zinc-800/60 border-red-800/40'
      }
    `}>
      <p className={`font-semibold mb-1.5 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
      </p>
      {isLoading && !text ? (
        <span className="text-zinc-500">Thinking...</span>
      ) : (
        <div className="text-zinc-300 whitespace-pre-wrap">
          <CodeText text={text} />
        </div>
      )}
    </div>
  )
}
