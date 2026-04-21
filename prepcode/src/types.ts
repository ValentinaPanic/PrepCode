export interface Message {
  role: 'user' | 'assistant'
  content: string
}

// ─── Quiz ────────────────────────────────────────────────────────────────────

export type QuizTopic = 'react' | 'javascript' | 'typescript' | 'css'

export type QuestionFormat = 'multiple_choice' | 'short_answer'

export interface QuizOption {
  label: 'A' | 'B' | 'C' | 'D'
  text: string
}

export interface QuizQuestion {
  format: QuestionFormat
  topic: QuizTopic
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options?: QuizOption[]
  correctAnswer: string
  explanation: string
}

export interface QuizAttempt {
  question: QuizQuestion
  userAnswer: string
  isCorrect: boolean
  claudeExplanation: string
}

export type QuizPhase =
  | 'idle'
  | 'loading_question'
  | 'question_ready'
  | 'loading_explanation'
  | 'explanation_shown'
  | 'session_complete'

export interface QuizSessionState {
  topic: QuizTopic | null
  difficulty: 'easy' | 'medium' | 'hard'
  score: number
  total: number
  currentQuestion: QuizQuestion | null
  currentAttempt: QuizAttempt | null
  history: QuizAttempt[]
  phase: QuizPhase
}

// ─── Stats (persisted to localStorage) ──────────────────────────────────────

export interface QuizResult {
  topic: QuizTopic
  difficulty: 'easy' | 'medium' | 'hard'
  score: number
  total: number
  date: string  // ISO string
}

export interface ChallengeResult {
  challengeId: string
  bestScore: number   // percentage 0-100
  date: string        // ISO string
}

export interface UserStats {
  quizResults: QuizResult[]
  challengeResults: ChallengeResult[]
}

// ─── Sessions (from the server) ─────────────────────────────────────────────

interface SessionBase {
  id: string
  mode: string
  topic: string | null
  created_at: string
}

export interface SessionSummary extends SessionBase {
  messages?: { count: number }[]
}

export interface SessionWithMessages extends SessionBase {
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    created_at: string
  }>
}
