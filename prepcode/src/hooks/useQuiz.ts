import { useState, useRef, useCallback } from 'react'
import type { QuizTopic, QuizQuestion, QuizAttempt, QuizSessionState } from '../types'
import { useApiKey, authHeaders } from '../contexts/ApiKeyContext'
import { parseQuizStream, finalizeQuizQuestion, type PartialQuizQuestion } from '../lib/quizStream'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const initialState: QuizSessionState = {
  topic: null,
  difficulty: 'easy',
  score: 0,
  total: 0,
  currentQuestion: null,
  currentAttempt: null,
  history: [],
  phase: 'idle',
  error: null,
}

// Thrown from fetchQuestion so the caller can inspect status without parsing
// the message string.
class QuestionFetchError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function useQuiz() {
  const [state, setState] = useState<QuizSessionState>(initialState)
  const sessionId = useRef<string | null>(null)
  const previousQuestions = useRef<string[]>([])
  // Holds an in-flight Promise for the *next* question, kicked off while the
  // user reads the current explanation. When they click Next, we await this
  // instead of starting a fresh network request — usually already resolved.
  const nextQuestionCache = useRef<Promise<QuizQuestion> | null>(null)
  const { apiKey, clearKey, openModal } = useApiKey()

  // ─── Session creation ───────────────────────────────────────────────────────

  async function createSession(topic: QuizTopic): Promise<string> {
    const res = await fetch(`${API_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'quiz', topic }),
    })
    const session = await res.json()
    return session.id
  }

  // ─── Fetch a question (pure — no state, no UI side effects) ─────────────────
  //
  // Two response shapes:
  //   - Fallback (no API key): JSON — a full QuizQuestion from the DB bank.
  //   - Claude path: a text/event-stream of tokens in the delimited format
  //     documented in prompts/quiz.ts; parsed incrementally by parseQuizStream.
  //
  // `onPartial` is optional: the interactive path passes it to drive the UI
  // as text streams in; the background prefetch omits it and just accumulates.

  const fetchQuestion = useCallback(async (
    topic: QuizTopic,
    difficulty: QuizSessionState['difficulty'],
    prevQuestions: string[],
    key: string | null,
    onPartial?: (partial: PartialQuizQuestion) => void
  ): Promise<QuizQuestion> => {
    const res = await fetch(`${API_URL}/api/quiz/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(key),
      },
      body: JSON.stringify({ topic, difficulty, previousQuestions: prevQuestions }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      const message = data?.error || `Failed to load question (${res.status})`
      throw new QuestionFetchError(message, res.status)
    }

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      // DB fallback path — one-shot JSON.
      return res.json()
    }

    // Streaming path. Accumulate the whole buffer, re-parse on every chunk,
    // and report partials upward so the UI can render progressively.
    if (!res.body) throw new QuestionFetchError('No response body', 500)
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      if (onPartial) onPartial(parseQuizStream(buffer))
    }

    const question = finalizeQuizQuestion(buffer, topic, difficulty)
    if (!question) {
      console.error('Failed to parse streamed question. Raw buffer:', buffer)
      throw new QuestionFetchError('Failed to parse question from Claude', 500)
    }
    return question
  }, [])

  // ─── Load next question ─────────────────────────────────────────────────────

  const loadNextQuestion = useCallback(async (
    topic: QuizTopic,
    difficulty: QuizSessionState['difficulty']
  ) => {
    setState(prev => ({ ...prev, phase: 'loading_question', error: null }))

    // Consume any prefetched result; otherwise fire a fresh request.
    // For prefetched results the streaming already happened in the background,
    // so the question arrives fully-formed — no progressive render needed.
    const cached = nextQuestionCache.current
    nextQuestionCache.current = null

    // On each stream chunk, update currentQuestion with whatever we've parsed
    // so far. Stay in 'loading_question' phase until the stream finishes — the
    // UI will render the partial question but keep it disabled, so the user
    // can't click an option before correctAnswer has arrived.
    const onPartial = (partial: PartialQuizQuestion) => {
      if (!partial.question) return
      setState(prev => ({
        ...prev,
        currentAttempt: null,
        currentQuestion: {
          format: 'multiple_choice',
          topic,
          difficulty,
          question: partial.question!,
          options: partial.options ?? [],
          correctAnswer: partial.correctAnswer ?? '',
          explanation: partial.explanation ?? '',
        },
      }))
    }

    const fetchPromise = cached
      ?? fetchQuestion(topic, difficulty, previousQuestions.current, apiKey, onPartial)

    try {
      const question = await fetchPromise
      previousQuestions.current.push(question.question)

      // Commit the finalized question. For the streamed path this is usually
      // a no-op (state already matches), but it guarantees a consistent final
      // state even if the stream ends mid-update.
      setState(prev => ({
        ...prev,
        currentQuestion: question,
        currentAttempt: null,
        phase: 'question_ready',
      }))
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Failed to load question'
      if (err instanceof QuestionFetchError && err.status === 401) {
        clearKey()
        openModal()
      }
      setState(prev => ({ ...prev, phase: 'idle', error: message }))
    }
  }, [apiKey, clearKey, openModal, fetchQuestion])

  // ─── Start session ──────────────────────────────────────────────────────────

  const startSession = useCallback(async (
    topic: QuizTopic,
    difficulty: QuizSessionState['difficulty']
  ) => {
    setState({ ...initialState, topic, difficulty, phase: 'loading_question' })
    previousQuestions.current = []

    // Fire session creation in parallel — the question doesn't need the
    // session ID, and submitAnswer guards on sessionId.current anyway. This
    // removes ~100-300ms from the time-to-first-question.
    createSession(topic)
      .then(id => { sessionId.current = id })
      .catch(() => console.warn('Could not create session in DB'))

    await loadNextQuestion(topic, difficulty)
  }, [loadNextQuestion])

  // ─── Submit answer ──────────────────────────────────────────────────────────

  const submitAnswer = useCallback(async (userAnswer: string) => {
    const { currentQuestion, topic } = state
    if (!currentQuestion || !topic) return

    const isCorrect =
      userAnswer.trim().toLowerCase() ===
      currentQuestion.correctAnswer.trim().toLowerCase()

    const attempt: QuizAttempt = {
      question: currentQuestion,
      userAnswer,
      isCorrect,
      claudeExplanation: '',
    }

    setState(prev => ({
      ...prev,
      currentAttempt: attempt,
      phase: 'loading_explanation',
    }))

    try {
      const res = await fetch(`${API_URL}/api/quiz/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(apiKey),
        },
        body: JSON.stringify({
          question: currentQuestion,
          userAnswer,
          sessionId: sessionId.current,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const message = data?.error || `Failed to get explanation (${res.status})`
        throw new Error(message)
      }

      let explanation = ''
      const contentType = res.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        // Fallback path: static explanation from DB question, no streaming
        const data = await res.json()
        explanation = data.explanation
      } else {
        // Claude path: stream the explanation word by word
        if (!res.body) throw new Error('No response body')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          explanation += decoder.decode(value, { stream: true })

          setState(prev => ({
            ...prev,
            currentAttempt: prev.currentAttempt
              ? { ...prev.currentAttempt, claudeExplanation: explanation }
              : prev.currentAttempt,
          }))
        }
      }

      // Save the completed attempt to the DB
      if (sessionId.current) {
        await fetch(`${API_URL}/api/sessions/${sessionId.current}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'user',
            content: JSON.stringify({
              type: 'quiz_attempt',
              question: currentQuestion.question,
              userAnswer,
              isCorrect,
            }),
          }),
        })
      }

      setState(prev => ({
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        total: prev.total + 1,
        history: [
          ...prev.history,
          { ...attempt, claudeExplanation: explanation },
        ],
        phase: 'explanation_shown',
      }))

      // Prefetch the next question while the user reads the explanation.
      // If this is the last question (total was 9, about to be 10), skip —
      // there's no next question to load. Errors are swallowed on purpose:
      // the Next click will retry as a normal user-facing fetch.
      const nextTotal = state.total + 1
      if (nextTotal < 10) {
        const prefetch = fetchQuestion(topic, state.difficulty, previousQuestions.current, apiKey)
        nextQuestionCache.current = prefetch
        prefetch.catch(() => {
          if (nextQuestionCache.current === prefetch) nextQuestionCache.current = null
        })
      }
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Failed to get explanation'
      setState(prev => ({ ...prev, phase: 'explanation_shown', error: message }))
    }
  }, [state, apiKey, fetchQuestion])

  // ─── Next question or finish ────────────────────────────────────────────────

  const nextQuestion = useCallback(() => {
    const { topic, difficulty, total } = state
    if (!topic) return

    if (total >= 10) {
      setState(prev => ({ ...prev, phase: 'session_complete' }))
      return
    }

    loadNextQuestion(topic, difficulty)
  }, [state, loadNextQuestion])

  // ─── Reset ──────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setState(initialState)
    sessionId.current = null
    previousQuestions.current = []
    nextQuestionCache.current = null
  }, [])

  return { state, startSession, submitAnswer, nextQuestion, reset }
}
