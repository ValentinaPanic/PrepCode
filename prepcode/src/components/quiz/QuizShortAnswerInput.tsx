import { useState } from 'react'

interface QuizShortAnswerInputProps {
  disabled: boolean
  onSubmit: (answer: string) => void
}

export function QuizShortAnswerInput({ disabled, onSubmit }: QuizShortAnswerInputProps) {
  const [value, setValue] = useState('')

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type your answer..."
        className="
          w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700
          text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-sm
          focus:outline-none focus:border-indigo-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        "
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="self-end px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        Submit
      </button>
    </div>
  )
}
