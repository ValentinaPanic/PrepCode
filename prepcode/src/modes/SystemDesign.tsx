import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClaude } from '../hooks/useClaude'
import { ChatWindow } from '../components/ChatWindow'
import { InputBar } from '../components/InputBar'
import { systemDesignPrompt } from '../prompts/systemDesign'

const STARTER_PROMPTS = [
  'Give me a system design question about a real-time messaging or chat system.',
  'Give me a system design question about a file storage or sharing service.',
  'Give me a system design question about a feed or timeline ranking system.',
  'Give me a system design question about a payment or checkout system.',
  'Give me a system design question about a notification delivery service.',
  'Give me a system design question about a URL shortener or link management service.',
  'Give me a system design question about a video or media streaming platform.',
  'Give me a system design question about a search autocomplete or typeahead service.',
  'Give me a system design question about a ride-sharing or dispatch system.',
  'Give me a system design question about a collaborative document editor.',
  'Give me a system design question about a metrics, monitoring, or alerting dashboard.',
  'Give me a system design question about a ticket or reservation booking system.',
  'Give me a system design question about an email delivery service.',
  'Give me a system design question about a rate limiter or API gateway.',
  'Give me a system design question about a social media or content platform.',
]

function pickRandomStarter(): string {
  const index = Math.floor(Math.random() * STARTER_PROMPTS.length)
  return STARTER_PROMPTS[index]
}

export function SystemDesign() {
  const navigate = useNavigate()
  const { messages, isLoading, error, sendMessage, reset } = useClaude(
    systemDesignPrompt,
    'system_design'
  )

  // Kick off the interview with a random topic each session
  useEffect(() => {
    sendMessage(pickRandomStarter())
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            aria-label="Back to home"
          >
            ←
          </button>
          <div>
            <h1 className="text-zinc-900 dark:text-white font-semibold">System Design</h1>
            <p className="text-zinc-500 text-xs mt-0.5">API contracts · Architecture · Scalability</p>
          </div>
        </div>
        <button
          onClick={reset}
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          New session
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mx-4 mt-4 px-4 py-3 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Messages */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* Input */}
      <InputBar
        onSend={sendMessage}
        isLoading={isLoading}
        placeholder="Describe your design..."
      />
    </div>
  )
}
