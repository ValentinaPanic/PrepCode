import { useEffect, useState } from 'react'
import { useApiKey } from '../contexts/ApiKeyContext'

const GITHUB_URL = 'https://github.com/ValentinaPanic/PrepCode'
const ANTHROPIC_CONSOLE_URL = 'https://console.anthropic.com/settings/keys'

function maskKey(key: string): string {
  if (key.length <= 10) return '••••••••'
  return `${key.slice(0, 7)}…${key.slice(-4)}`
}

export function ApiKeyGate() {
  const { apiKey, hasKey, isModalOpen, closeModal, saveKey, clearKey } = useApiKey()
  const [input, setInput] = useState('')
  const [persist, setPersist] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset the form every time the modal opens so we don't show a stale draft.
  useEffect(() => {
    if (isModalOpen) {
      setInput('')
      setError(null)
      setPersist(false)
    }
  }, [isModalOpen])

  // Escape closes the modal. Listener is scoped to when it's open.
  useEffect(() => {
    if (!isModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isModalOpen, closeModal])

  if (!isModalOpen) return null

  const handleSave = () => {
    const trimmed = input.trim()
    if (!trimmed) {
      setError('Please paste your API key.')
      return
    }
    if (!trimmed.startsWith('sk-ant-')) {
      setError('That doesn\'t look like an Anthropic key (should start with sk-ant-).')
      return
    }
    saveKey(trimmed, persist)
  }

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-zinc-900 dark:text-white text-xl font-semibold mb-1">
            Bring your own API key
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            PrepCode uses Claude to run interviews and generate quiz questions.
            Because this is a public portfolio app, you use your own Anthropic key
            so costs stay on your side.
          </p>

          {/* Privacy block — the core trust message */}
          <div className="mt-5 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm space-y-2">
            <p className="text-zinc-700 dark:text-zinc-300 font-medium">What happens to your key</p>
            <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 text-[13px] leading-relaxed">
              <li>• Stored in your browser only (localStorage or sessionStorage)</li>
              <li>• Sent as an HTTP header to the PrepCode server, which forwards it to Anthropic</li>
              <li>• Never logged, never stored server-side, never sent anywhere else</li>
              <li>
                •{' '}
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Read the source on GitHub
                </a>{' '}
                to verify
              </li>
            </ul>
          </div>

          {/* Current key state */}
          {hasKey && apiKey && (
            <div className="mt-5 flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl">
              <div className="text-sm">
                <p className="text-emerald-800 dark:text-emerald-300 font-medium">Key set</p>
                <p className="text-emerald-700/80 dark:text-emerald-400/80 font-mono text-xs mt-0.5">
                  {maskKey(apiKey)}
                </p>
              </div>
              <button
                onClick={clearKey}
                className="text-xs text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* Input */}
          <div className="mt-5">
            <label className="block text-zinc-700 dark:text-zinc-300 text-sm font-medium mb-1.5">
              {hasKey ? 'Replace your key' : 'Paste your key'}
            </label>
            <input
              type="password"
              value={input}
              onChange={e => {
                setInput(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSave()
              }}
              placeholder="sk-ant-api03-..."
              autoComplete="off"
              spellCheck={false}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm font-mono placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
            />
            {error && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{error}</p>
            )}
            <p className="text-zinc-500 dark:text-zinc-500 text-xs mt-2">
              Don't have one?{' '}
              <a
                href={ANTHROPIC_CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Create one at console.anthropic.com
              </a>{' '}
              — set a monthly spend limit ($5 is plenty) so you can't be surprised.
            </p>
          </div>

          {/* Storage choice */}
          <fieldset className="mt-4">
            <legend className="text-zinc-700 dark:text-zinc-300 text-sm font-medium mb-2">
              Remember it?
            </legend>
            <div className="space-y-1.5">
              <label className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="persist"
                  checked={!persist}
                  onChange={() => setPersist(false)}
                  className="mt-1 accent-indigo-500"
                />
                <span>
                  <span className="font-medium">Just this session</span>
                  <span className="text-zinc-500 dark:text-zinc-400"> — cleared when you close this tab (more private)</span>
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="persist"
                  checked={persist}
                  onChange={() => setPersist(true)}
                  className="mt-1 accent-indigo-500"
                />
                <span>
                  <span className="font-medium">Remember on this device</span>
                  <span className="text-zinc-500 dark:text-zinc-400"> — stays between visits (convenient)</span>
                </span>
              </label>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={closeModal}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              {hasKey ? 'Close' : 'Skip for now'}
            </button>
            <button
              onClick={handleSave}
              disabled={!input.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save key
            </button>
          </div>

          {!hasKey && (
            <p className="text-zinc-500 dark:text-zinc-500 text-xs mt-4 leading-relaxed">
              You can skip and try the quiz on fallback questions, or the component
              practice mode — both work without a key. System Design needs a key.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
