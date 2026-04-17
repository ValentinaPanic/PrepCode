/**
 * Renders text with backtick-delimited code formatted properly.
 * Handles both:
 *   - ```code blocks```  → <pre><code>
 *   - `inline code`      → <code>
 *
 * Everything else is rendered as plain text.
 */
export function CodeText({ text, className }: { text: string; className?: string }) {
  const parts = parseCodeBlocks(text)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.type === 'code-block') {
          return (
            <pre
              key={i}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 my-2 overflow-x-auto"
            >
              <code className="text-zinc-300 text-xs font-mono whitespace-pre">
                {part.content}
              </code>
            </pre>
          )
        }

        if (part.type === 'inline-code') {
          return (
            <code
              key={i}
              className="bg-zinc-800/80 text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-700/50"
            >
              {part.content}
            </code>
          )
        }

        return <span key={i}>{part.content}</span>
      })}
    </span>
  )
}

interface TextPart {
  type: 'text' | 'code-block' | 'inline-code'
  content: string
}

function parseCodeBlocks(text: string): TextPart[] {
  const parts: TextPart[] = []

  // First pass: split on triple-backtick code blocks (```...```)
  // The language identifier after ``` (e.g. ```ts) is stripped
  const blockRegex = /```(?:\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = blockRegex.exec(text)) !== null) {
    // Text before this code block
    if (match.index > lastIndex) {
      parts.push(...parseInlineCode(text.slice(lastIndex, match.index)))
    }
    // The code block itself
    parts.push({ type: 'code-block', content: match[1].trim() })
    lastIndex = match.index + match[0].length
  }

  // Remaining text after the last code block
  if (lastIndex < text.length) {
    parts.push(...parseInlineCode(text.slice(lastIndex)))
  }

  return parts
}

function parseInlineCode(text: string): TextPart[] {
  const parts: TextPart[] = []
  const inlineRegex = /`([^`]+)`/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'inline-code', content: match[1] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return parts
}
