import { CodeText } from './CodeText'

interface QuizOptionButtonProps {
  label: 'A' | 'B' | 'C' | 'D'
  text: string
  state: 'default' | 'selected' | 'correct' | 'incorrect'
  disabled: boolean
  onClick: () => void
}

const stateStyles = {
  default:   'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800',
  selected:  'border-indigo-500 bg-indigo-100 dark:bg-indigo-600/20 text-indigo-900 dark:text-white',
  correct:   'border-emerald-500 bg-emerald-100 dark:bg-emerald-600/20 text-emerald-800 dark:text-emerald-300',
  incorrect: 'border-red-500 bg-red-100 dark:bg-red-600/20 text-red-800 dark:text-red-300',
}

const labelStyles = {
  default:   'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400',
  selected:  'bg-indigo-600 text-white',
  correct:   'bg-emerald-600 text-white',
  incorrect: 'bg-red-600 text-white',
}

export function QuizOptionButton({ label, text, state, disabled, onClick }: QuizOptionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left
        transition-all duration-200 disabled:cursor-default
        ${stateStyles[state]}
      `}
    >
      <span className={`
        flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
        text-xs font-bold transition-colors
        ${labelStyles[state]}
      `}>
        {label}
      </span>
      <span className="text-sm leading-relaxed">
        <CodeText text={text} />
      </span>
    </button>
  )
}
