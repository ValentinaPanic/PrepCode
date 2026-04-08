import { useEffect } from 'react'
import { useClaude } from '../hooks/useClaude'
import { ChatWindow } from '../components/ChatWindow'
import { InputBar } from '../components/InputBar'
import { systemDesignPrompt } from '../prompts/systemDesign'

export function SystemDesign() {
  const { messages, isLoading, error, sendMessage, reset } = useClaude(
    systemDesignPrompt,
    'system_design'
  )

  // Kick off the interview automatically when the mode loads
  useEffect(() => {
    sendMessage('Start the interview. Give me a system design question.')
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div>
          <h1 className="text-white font-semibold">System Design</h1>
          <p className="text-zinc-500 text-xs mt-0.5">API contracts · Architecture · Scalability</p>
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
