import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useApiKey } from '../contexts/ApiKeyContext'

interface Props {
  subtitle?: string
}

export function Nav({ subtitle }: Props) {
  const { theme, toggle } = useTheme()
  const { hasKey, openModal } = useApiKey()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
          <span className="text-indigo-500 dark:text-indigo-400">&lt;</span>
          <span className="text-zinc-900 dark:text-white">Prep</span>
          <span className="text-zinc-500 dark:text-zinc-400">Code</span>
          <span className="text-indigo-500 dark:text-indigo-400"> /&gt;</span>
        </Link>
        {!isHome && subtitle && (
          <>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">{subtitle}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={openModal}
          className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
          aria-label="Manage API key"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              hasKey ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-zinc-600'
            }`}
            aria-hidden
          />
          <span>API key</span>
        </button>
        <button
          onClick={toggle}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-2 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}
