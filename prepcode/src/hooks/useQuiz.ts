import { useState, useRef, useCallback } from 'react'
import type { QuizTopic, QuizQuestion, QuizAttempt, QuizSessionState } from '../types'

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
}

export function useQuiz() {
  const [state, setState] = useState<QuizSessionState>(initialState)
  const sessionId = useRef<string | null>(null)
  const previousQuestions = useRef<string[]>([])

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

  // ─── Load next question ─────────────────────────────────────────────────────

  const loadNextQuestion = useCallback(async (
    topic: QuizTopic,
    difficulty: QuizSessionState['difficulty']
  ) => {
    setState(prev => ({ ...prev, phase: 'loading_question' }))

    try {
      const res = await fetch(`${API_URL}/api/quiz/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          difficulty,
          previousQuestions: previousQuestions.current,
        }),
      })

      if (!res.ok) throw new Error('Failed to load question')

      const question: QuizQuestion = await res.json()
      previousQuestions.current.push(question.question)

      setState(prev => ({
        ...prev,
        currentQuestion: question,
        currentAttempt: null,
        phase: 'question_ready',
      }))
    } catch (err) {
      console.error(err)
      setState(prev => ({ ...prev, phase: 'idle' }))
    }
  }, [])

  // ─── Start session ──────────────────────────────────────────────────────────

  const startSession = useCallback(async (
    topic: QuizTopic,
    difficulty: QuizSessionState['difficulty']
  ) => {
    setState({ ...initialState, topic, difficulty, phase: 'loading_question' })
    previousQuestions.current = []

    try {
      sessionId.current = await createSession(topic)
    } catch {
      // Session creation failing shouldn't block the quiz
      console.warn('Could not create session in DB')
    }

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          userAnswer,
          sessionId: sessionId.current,
        }),
      })

      if (!res.ok) throw new Error('Failed to get explanation')

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
    } catch (err) {
      console.error(err)
      setState(prev => ({ ...prev, phase: 'explanation_shown' }))
    }
  }, [state])

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
  }, [])

  return { state, startSession, submitAnswer, nextQuestion, reset }
}
