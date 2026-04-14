import { Router, Request, Response } from 'express'
import { anthropic } from '../services/claude'
import { supabase } from '../services/supabase'
import { quizQuestionPrompt, quizEvaluationPrompt } from '../prompts/quiz'

const router = Router()

// POST /api/quiz/question
// Returns a single QuizQuestion as JSON (not streamed)
router.post('/question', async (req: Request, res: Response) => {
  const { topic, difficulty, previousQuestions = [] } = req.body

  if (!topic || !difficulty) {
    res.status(400).json({ error: 'topic and difficulty are required' })
    return
  }

  const avoidClause =
    previousQuestions.length > 0
      ? `\n\nDo not repeat any of these questions:\n- ${previousQuestions.join('\n- ')}`
      : ''

  try {
    const message = await anthropic.messages.create({
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

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''

    let question
    try {
      question = JSON.parse(raw)
    } catch {
      console.error('Claude returned invalid JSON:', raw)
      res.status(500).json({ error: 'Failed to parse question from Claude' })
      return
    }

    res.json(question)
  } catch (error) {
    console.error('Claude API error:', error)
    res.status(500).json({ error: 'Failed to generate question' })
  }
})

// POST /api/quiz/evaluate
// Streams a personalised explanation back to the client
router.post('/evaluate', async (req: Request, res: Response) => {
  const { question, userAnswer, sessionId } = req.body

  if (!question || !userAnswer) {
    res.status(400).json({ error: 'question and userAnswer are required' })
    return
  }

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

    // Save the explanation to the session if we have one
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
    res.status(500).json({ error: 'Failed to get explanation' })
  }
})

export default router
