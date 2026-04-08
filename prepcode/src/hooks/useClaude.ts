import { useState, useCallback, useRef } from 'react'
import type { Message } from '../types'

export type { Message }

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function useClaude(systemPrompt: string, mode: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sessionId = useRef<string | null>(null)

  const sendMessage = useCallback(
    async (userMessage: string) => {
      const newMessages: Message[] = [
        ...messages,
        { role: 'user', content: userMessage },
      ]
      setMessages(newMessages)
      setIsLoading(true)
      setError(null)

      try {
        // Create a session on the first message
        if (!sessionId.current) {
          const sessionRes = await fetch(`${API_URL}/api/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode }),
          })
          const session = await sessionRes.json()
          sessionId.current = session.id
        }

        // Save the user message to the database
        await fetch(`${API_URL}/api/sessions/${sessionId.current}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'user', content: userMessage }),
        })

        // Start streaming from the server
        const response = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages,
            systemPrompt,
            sessionId: sessionId.current,
          }),
        })

        if (!response.ok) throw new Error('Failed to reach server')
        if (!response.body) throw new Error('No response body')

        // Add an empty assistant message to fill in as chunks arrive
        setMessages(prev => [...prev, { role: 'assistant', content: '' }])

        // Read the stream chunk by chunk
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          fullText += decoder.decode(value, { stream: true })

          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              role: 'assistant',
              content: fullText,
            }
            return updated
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
    [messages, systemPrompt, mode]
  )

  const reset = useCallback(() => {
    setMessages([])
    setError(null)
    sessionId.current = null
  }, [])

  return { messages, isLoading, error, sendMessage, reset, sessionId: sessionId.current }
}
