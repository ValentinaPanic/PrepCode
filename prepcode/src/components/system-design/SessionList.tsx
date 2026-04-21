import { useState } from 'react'
import type { SessionSummary } from '../../types'
import { findTopic } from '../../data/systemDesignTopics'

interface Props {
  sessions: SessionSummary[]
  onResume: (sessionId: string) => void
  onDelete: (sessionId: string) => void
  onBack: () => void
  isLoading: boolean
}

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

export function SessionList({ sessions, onResume, onDelete, onBack, isLoading }: Props) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10">
        <button
          onClick={onBack}
          className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm transition-colors mb-6"
        >
          ← Back to setup
        </button>

        <h1 className="text-zinc-900 dark:text-white text-2xl font-bold tracking-tight mb-1">
          Past sessions
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
          Pick up where you left off, or clear out ones you're done with.
        </p>

        {isLoading && (
          <p className="text-zinc-500 text-sm">Loading sessions...</p>
        )}

        {!isLoading && sessions.length === 0 && (
          <p className="text-zinc-500 text-sm">No past sessions yet.</p>
        )}

        <div className="flex flex-col gap-2">
          {sessions.map(session => {
            const topic = session.topic ? findTopic(session.topic) : null
            const messageCount = session.messages?.[0]?.count ?? 0
            const isConfirming = confirmingId === session.id

            return (
              <div
                key={session.id}
                className="group flex items-center gap-2 p-4 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all"
              >
                <button
                  onClick={() => onResume(session.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <h3 className="text-zinc-900 dark:text-white font-medium text-sm mb-0.5 truncate">
                    {topic?.label ?? 'Untitled session'}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                    {messageCount} {messageCount === 1 ? 'message' : 'messages'} · {timeAgo(session.created_at)}
                  </p>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  {isConfirming ? (
                    <>
                      <button
                        onClick={() => {
                          onDelete(session.id)
                          setConfirmingId(null)
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-300 dark:border-zinc-700 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onResume(session.id)}
                        className="text-zinc-400 group-hover:text-indigo-500 text-sm transition-colors"
                      >
                        Resume →
                      </button>
                      <button
                        onClick={() => setConfirmingId(session.id)}
                        aria-label="Delete session"
                        className="text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        🗑
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
