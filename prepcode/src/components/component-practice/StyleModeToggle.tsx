export type StyleMode = 'css' | 'tailwind'

interface Props {
  mode: StyleMode
  onChange: (mode: StyleMode) => void
}

export function StyleModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg p-1">
      <button
        onClick={() => onChange('css')}
        className={`px-3 py-1 text-xs rounded-md transition-colors ${
          mode === 'css'
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
        }`}
      >
        CSS
      </button>
      <button
        onClick={() => onChange('tailwind')}
        className={`px-3 py-1 text-xs rounded-md transition-colors ${
          mode === 'tailwind'
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
        }`}
      >
        Tailwind
      </button>
    </div>
  )
}
