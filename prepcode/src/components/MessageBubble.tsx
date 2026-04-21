import type { Message } from '../types'
import { stripArtifactsTag } from '../lib/blocks'

interface Props {
  message: Message
}

// Strip the coverage tag from assistant content — including an in-progress
// opening tag at the end of the string during streaming, so we never flash
// "<phases_covered>" to the user.
function stripPhaseTag(content: string): string {
  return content
    .replace(/<phases_covered>[\s\S]*?<\/phases_covered>/g, '')
    .replace(/<phases_covered>[\s\S]*$/, '')
    .trim()
}

// Strip any legacy inline <block> markers so the chat stays prose-only —
// artifacts live in the side panel now.
function stripBlockMarkers(content: string): string {
  return content.replace(/<block\s+type="[^"]+">[\s\S]*?<\/block>/g, '').trim()
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  const cleaned = isUser
    ? stripBlockMarkers(stripArtifactsTag(message.content))
    : stripBlockMarkers(stripPhaseTag(message.content))

  if (!cleaned) return null

  return (
    <div className={`flex flex-col gap-2 mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm'
        }`}
      >
        {cleaned}
      </div>
    </div>
  )
}
