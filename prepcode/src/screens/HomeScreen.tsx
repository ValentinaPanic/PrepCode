import { useNavigate } from 'react-router-dom'
import { ModeCard } from '../components/ModeCard'
import { Nav } from '../components/Nav'
import { useStats } from '../hooks/useStats'
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
  const {
    totalQuizSessions,
    totalChallengesCompleted,
    averageQuizScore,
    recentActivity,
  } = useStats()

  const hasActivity = recentActivity.length > 0

  const quizDetail = totalQuizSessions > 0
    ? `${totalQuizSessions} · ${averageQuizScore}%`
    : undefined

  const challengeDetail = totalChallengesCompleted > 0
    ? `${totalChallengesCompleted}/${challenges.length}`
    : undefined

  return (
    <div className="flex flex-col h-full">
      <Nav />

      <div className="flex-1 overflow-y-auto">
        {/* Hero section with subtle background accent */}
        <div className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-emerald-500/5 dark:from-indigo-500/10 dark:to-emerald-500/10 pointer-events-none" />

          <div className="relative px-8 pt-12 pb-14 max-w-4xl">
            <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 mb-4 tracking-wide">
              // frontend interview prep
            </p>
            <h1 className="text-zinc-900 dark:text-white text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
              Practice like you're<br />
              <span className="text-indigo-600 dark:text-indigo-400">in the interview.</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-base mt-5 max-w-xl leading-relaxed">
              Three modes built around how frontend interviews actually go: talking through systems,
              rapid-fire fundamentals, and writing real components. No passive reading.
            </p>
          </div>
        </div>

        {/* Stats bar — only shows after first activity */}
        {hasActivity && (
          <div className="px-8 pt-8">
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

        {/* Mode grid — System Design is featured (spans 2 cols on md+) */}
        <div className="px-8 pt-10">
          <h2 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-4">Practice modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModeCard
              title="System Design"
              description="A real back-and-forth interview. Pick a topic, defend your decisions — from API contracts to failure modes."
              icon="🏗️"
              accent="indigo"
              onClick={() => navigate('/system-design')}
            />
            <ModeCard
              title="Quiz"
              description="Quick-fire on React, JS, TS, CSS. Good for warming up or filling gaps."
              icon="⚡"
              accent="amber"
              detail={quizDetail}
              onClick={() => navigate('/quiz')}
            />
            <ModeCard
              title="Components"
              description="Write accessible HTML from scratch. Scored on semantics and a11y."
              icon="🧩"
              accent="emerald"
              detail={challengeDetail}
              onClick={() => navigate('/components')}
            />
          </div>
        </div>

        {/* How it works — only shown when there's no activity yet (onboarding) */}
        {!hasActivity && (
          <div className="px-8 pt-12 pb-4">
            <h2 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-4">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="font-mono text-xs text-zinc-400 dark:text-zinc-600 mb-2">01</div>
                <h3 className="text-zinc-900 dark:text-white font-medium text-sm mb-1">Pick a mode</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">Pressure-test a different skill each session — design, recall, or hands-on coding.</p>
              </div>
              <div>
                <div className="font-mono text-xs text-zinc-400 dark:text-zinc-600 mb-2">02</div>
                <h3 className="text-zinc-900 dark:text-white font-medium text-sm mb-1">Get pushed</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">The AI interviewer won't let vague answers slide. You have to actually commit to a choice.</p>
              </div>
              <div>
                <div className="font-mono text-xs text-zinc-400 dark:text-zinc-600 mb-2">03</div>
                <h3 className="text-zinc-900 dark:text-white font-medium text-sm mb-1">Track progress</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">Your stats and recent sessions show up here. No account needed — it's saved locally.</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent activity */}
        {hasActivity && (
          <div className="px-8 pt-10 pb-8">
            <h2 className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-3">Recent activity</h2>
            <div className="bg-white dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50 rounded-xl overflow-hidden">
              {recentActivity.map((item, i) => (
                <div key={i} className={`flex items-center justify-between py-3 px-4 ${
                  i > 0 ? 'border-t border-zinc-100 dark:border-zinc-800' : ''
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      item.type === 'quiz' ? 'bg-amber-400' : 'bg-emerald-400'
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

        {/* Tagline footer */}
        <div className="px-8 pb-10 pt-6">
          <p className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
            &lt;built for junior → senior frontend roles /&gt;
          </p>
        </div>
      </div>
    </div>
  )
}
