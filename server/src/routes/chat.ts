import { Router, Request, Response } from 'express'
import { anthropic } from '../services/claude'
import { supabase } from '../services/supabase'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { messages, systemPrompt, sessionId } = req.body

  if (!messages || !systemPrompt) {
    res.status(400).json({ error: 'messages and systemPrompt are required' })
    return
  }

  // Set headers so the browser knows this is a streaming text response
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    })

    let fullResponse = ''

    // Send each chunk to the frontend as it arrives
    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        fullResponse += chunk.delta.text
        res.write(chunk.delta.text)
      }
    }

    // Save the assistant response to the database if we have a session
    if (sessionId) {
      await supabase.from('messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: fullResponse,
      })
    }

    res.end()
  } catch (error) {
    console.error('Claude API error:', error)
    res.status(500).json({ error: 'Failed to get response from Claude' })
  }
})

export default router
