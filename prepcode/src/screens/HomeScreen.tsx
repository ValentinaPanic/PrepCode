import { useNavigate } from 'react-router-dom'
import { ModeCard } from '../components/ModeCard'
import { useStats } from '../hooks/useStats'
import { useTheme } from '../hooks/useTheme'
import { challenges } from '../data/componentChallenges'

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function HomeScreen() {
  const navigate = useNavigate()
  const { theme, toggle: toggleTheme } = useTheme()
  const {
    totalQuizSessions,
    totalChallengesCompleted,
    averageQuizScore,
    recentActivity,
  } = useStats()

  const hasActivity = recentActivity.length > 0

  // Build detail strings for mode cards
  const quizDetail = totalQuizSessions > 0
    ? `${totalQuizSessions} session${totalQuizSessions === 1 ? '' : 's'} · avg ${averageQuizScore}%`
    : undefined

  const challengeDetail = totalChallengesCompleted > 0
    ? `${totalChallengesCompleted}/${challenges.length} completed`
    : undefined

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-12 pb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-indigo-500 dark:text-indigo-400">&lt;</span>
            <span className="text-zinc-900 dark:text-white">Prep</span>
            <span className="text-zinc-500 dark:text-zinc-400">Code</span>
            <span className="text-indigo-500 dark:text-indigo-400"> /&gt;</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Frontend interview practice, one session at a time.</p>
        </div>
        <button
          onClick={toggleTheme}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xl transition-colors mt-1"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '\u2600\uFE0F' : '\u{1F319}'}
        </button>
      </div>

      {/* Stats bar — only shows after first activity */}
      {hasActivity && (
        <div className="px-8 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-zinc-500 text-xs">Quiz sessions</p>
              <p className="text-zinc-900 dark:text-white text-lg font-semibold">{totalQuizSessions}</p>
            </div>
            <div className="flex-1 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-zinc-500 text-xs">Avg quiz score</p>
              <p className="text-zinc-900 dark:text-white text-lg font-semibold">{averageQuizScore}%</p>
            </div>
            <div className="flex-1 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-zinc-500 text-xs">Challenges done</p>
              <p className="text-zinc-900 dark:text-white text-lg font-semibold">{totalChallengesCompleted}/{challenges.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mode grid */}
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ModeCard
          title="System Design"
          description="Back and forth with a strict AI interviewer. API contracts, architecture, failure states — nothing gets skipped."
          icon="\u{1F3D7}\u{FE0F}"
          onClick={() => navigate('/system-design')}
        />
        <ModeCard
          title="Quiz"
          description="Quick-fire questions on React, JavaScript, TypeScript, and CSS. Good for warming up or filling gaps."
          icon="\u26A1"
          onClick={() => navigate('/quiz')}
          detail={quizDetail}
        />
        <ModeCard
          title="Component Practice"
          description="Build accessible HTML components from scratch — button, form, input, nav, and more. Scored on correctness."
          icon="\u{1F9E9}"
          onClick={() => navigate('/components')}
          detail={challengeDetail}
        />
      </div>

      {/* Recent activity */}
      {hasActivity && (
        <div className="px-8 mt-8 pb-8">
          <h2 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-3">Recent activity</h2>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    item.type === 'quiz' ? 'bg-indigo-400' : 'bg-emerald-400'
                  }`} />
                  <span className="text-zinc-700 dark:text-zinc-300 text-sm">
                    {item.type === 'quiz' ? 'Quiz' : 'Challenge'}: {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm font-mono">{item.score}</span>
                  <span className="text-zinc-400 dark:text-zinc-600 text-xs">{timeAgo(item.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
