import { useState } from 'react'
import type { KeyboardEvent } from 'react'

interface Props {
  onSend: (message: string) => void
  isLoading: boolean
  placeholder?: string
}

export function InputBar({ onSend, isLoading, placeholder = 'Type a message...' }: Props) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (!value.trim() || isLoading) return
    onSend(value.trim())
    setValue('')
  }

  // Send on Enter, new line on Shift+Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-zinc-800 px-4 py-4">
      <div className="flex gap-3 items-end">
        <textarea
          className="flex-1 bg-zinc-800 text-zinc-100 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-500"
          rows={1}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors"
        >
          Send
        </button>
      </div>
      <p className="text-zinc-600 text-xs mt-2 pl-1">Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
