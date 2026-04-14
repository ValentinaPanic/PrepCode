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
