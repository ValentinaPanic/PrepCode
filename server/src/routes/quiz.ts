import { Router, Request, Response } from 'express'
import { getAnthropicClient } from '../services/claude'
import { supabase } from '../services/supabase'
import { quizQuestionPrompt, quizEvaluationPrompt } from '../prompts/quiz'

const router = Router()

function hasApiKey(req: Request): boolean {
  return !!(req.headers['x-api-key'] || process.env.ANTHROPIC_API_KEY)
}

function mapRowToQuestion(row: Record<string, unknown>) {
  return {
    format: row.format,
    topic: row.topic,
    difficulty: row.difficulty,
    question: row.question,
    options: row.options ?? null,
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
  }
}

// POST /api/quiz/question
// Returns a single QuizQuestion as JSON (not streamed)
router.post('/question', async (req: Request, res: Response) => {
  const { topic, difficulty, previousQuestions = [] } = req.body

  if (!topic || !difficulty) {
    res.status(400).json({ error: 'topic and difficulty are required' })
    return
  }

  // ── Fallback: pull from DB when no API key is available ──────────────────
  if (!hasApiKey(req)) {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('topic', topic)
      .eq('difficulty', difficulty)

    if (error || !data || data.length === 0) {
      res.status(404).json({ error: 'No questions available for this topic and difficulty' })
      return
    }

    const unseen = data.filter((q: Record<string, unknown>) => !previousQuestions.includes(q.question))
    const pool = unseen.length > 0 ? unseen : data
    const row = pool[Math.floor(Math.random() * pool.length)]

    res.json(mapRowToQuestion(row))
    return
  }

  // ── Claude path (streaming) ──────────────────────────────────────────────
  // Tokens are streamed directly to the client so the UI can render the
  // question text as it arrives — feels instant instead of waiting ~4s for
  // the full JSON. The client parses section markers ([QUESTION], [OPTIONS],
  // etc.) incrementally. See prepcode/src/lib/quizStream.ts.
  const avoidClause =
    previousQuestions.length > 0
      ? `\n\nDo not repeat any of these questions:\n- ${previousQuestions.join('\n- ')}`
      : ''

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const anthropic = getAnthropicClient(req.headers['x-api-key'] as string | undefined)

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: quizQuestionPrompt,
      messages: [
        {
          role: 'user',
          content: `Topic: ${topic}\nDifficulty: ${difficulty}${avoidClause}`,
        },
      ],
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(chunk.delta.text)
      }
    }
    res.end()
  } catch (error) {
    const err = error as { status?: number; message?: string; error?: { error?: { message?: string } } }
    const status = err.status ?? 500
    const anthropicMessage = err.error?.error?.message || err.message
    console.error(`Claude API error (status ${status}):`, anthropicMessage)

    // If we've already started streaming, headers are flushed and we can't
    // send a JSON error. Just close the stream; the client will fail to parse
    // and surface a generic error.
    if (res.headersSent) {
      res.end()
      return
    }

    if (status === 401) {
      res.status(401).json({ error: 'Your API key was rejected by Anthropic. Please check it and try again.' })
      return
    }
    res.status(500).json({ error: anthropicMessage || 'Failed to generate question' })
  }
})

// POST /api/quiz/evaluate
// Streams a personalised explanation, or returns JSON if no API key
router.post('/evaluate', async (req: Request, res: Response) => {
  const { question, userAnswer, sessionId } = req.body

  if (!question || !userAnswer) {
    res.status(400).json({ error: 'question and userAnswer are required' })
    return
  }

  // ── Fallback: return the static explanation from the question ────────────
  if (!hasApiKey(req)) {
    res.json({ explanation: question.explanation })
    return
  }

  // ── Claude path: stream personalised explanation ─────────────────────────
  const userContent = [
    `Question: ${question.question}`,
    `Correct answer: ${question.correctAnswer}`,
    `User's answer: ${userAnswer}`,
    `Explanation context: ${question.explanation}`,
  ].join('\n')

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const anthropic = getAnthropicClient(req.headers['x-api-key'] as string | undefined)

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: quizEvaluationPrompt,
      messages: [{ role: 'user', content: userContent }],
    })

    let fullResponse = ''

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        fullResponse += chunk.delta.text
        res.write(chunk.delta.text)
      }
    }

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
    const status = error instanceof Error && 'status' in error ? (error as { status: number }).status : 500
    if (status === 401) {
      res.status(401).json({ error: 'Your API key was rejected by Anthropic. Please check it and try again.' })
      return
    }
    res.status(500).json({ error: 'Failed to get explanation' })
  }
})

export default router
