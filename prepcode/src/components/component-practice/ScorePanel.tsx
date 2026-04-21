import type { SpecCheck, DOMElement } from '../../lib/specChecks'

interface CheckResult {
  label: string
  passed: boolean
}

interface Props {
  checks: SpecCheck[]
  elements: DOMElement[] | null  // null = hasn't run yet
}

export function ScorePanel({ checks, elements }: Props) {
  if (!elements) {
    return (
      <div className="text-zinc-600 dark:text-zinc-500 text-xs">
        Run your code to see results
      </div>
    )
  }

  const results: CheckResult[] = checks.map(c => ({
    label: c.label,
    passed: c.check(elements),
  }))

  const passed = results.filter(r => r.passed).length
  const total = results.length
  const percent = Math.round((passed / total) * 100)

  return (
    <div>
      {/* Score badge */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`text-2xl font-bold ${
          percent === 100 ? 'text-green-600 dark:text-green-400' : percent >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {percent}%
        </div>
        <span className="text-zinc-600 dark:text-zinc-400 text-sm">{passed}/{total} checks passed</span>
      </div>

      {/* Checklist */}
      <ul className="space-y-1.5">
        {results.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={`mt-0.5 ${r.passed ? 'text-green-600 dark:text-green-400' : 'text-zinc-400 dark:text-zinc-600'}`}>
              {r.passed ? '\u2713' : '\u2717'}
            </span>
            <span className={r.passed ? 'text-zinc-800 dark:text-zinc-300' : 'text-zinc-500 dark:text-zinc-500'}>
              {r.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
