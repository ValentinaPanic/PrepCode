import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../hooks/useQuiz'
import { useStats } from '../hooks/useStats'
import { Nav } from '../components/Nav'
import { QuizScoreBar } from '../components/quiz/QuizScoreBar'
import { QuizTopicSelector } from '../components/quiz/QuizTopicSelector'
import { QuizQuestionCard } from '../components/quiz/QuizQuestionCard'
import { QuizExplanation } from '../components/quiz/QuizExplanation'
import { QuizSummary } from '../components/quiz/QuizSummary'

export function Quiz() {
  const navigate = useNavigate()
  const { state, startSession, submitAnswer, nextQuestion, reset } = useQuiz()
  const { saveQuizResult } = useStats()
  const { phase, currentQuestion, currentAttempt, score, total } = state
  const savedRef = useRef(false)

  // Save stats when a session completes
  useEffect(() => {
    if (phase === 'session_complete' && state.topic && !savedRef.current) {
      savedRef.current = true
      saveQuizResult({
        topic: state.topic,
        difficulty: state.difficulty,
        score,
        total,
        date: new Date().toISOString(),
      })
    }
    if (phase === 'idle') {
      savedRef.current = false
    }
  }, [phase, state.topic, state.difficulty, score, total, saveQuizResult])

  const isAnswered = phase === 'loading_explanation' || phase === 'explanation_shown'

  return (
    <div className="flex flex-col h-full">
      <Nav subtitle="Quiz" />

      {phase !== 'idle' && (
        <div className="flex justify-end px-8 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={reset}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm transition-colors"
          >
            New session
          </button>
        </div>
      )}

      {/* Score bar — visible once a session is active */}
      {phase !== 'idle' && phase !== 'session_complete' && (
        <QuizScoreBar score={score} total={total} />
      )}

      {/* Main content — driven entirely by phase */}
      <div className="flex flex-col flex-1 overflow-y-auto">

        {phase === 'idle' && (
          <QuizTopicSelector onStart={startSession} />
        )}

        {phase === 'loading_question' && (
          <div className="flex flex-col gap-6 p-6 animate-pulse">
            {/* Question text skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/5" />
            </div>

            {/* Option skeletons */}
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/30">
                  <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded flex-1" style={{ width: `${50 + i * 10}%` }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {(phase === 'question_ready' || isAnswered) && currentQuestion && (
          <>
            <QuizQuestionCard
              question={currentQuestion}
              attempt={currentAttempt}
              disabled={isAnswered}
              onAnswer={submitAnswer}
            />

            {isAnswered && currentAttempt && (
              <QuizExplanation
                text={currentAttempt.claudeExplanation}
                isLoading={phase === 'loading_explanation'}
                isCorrect={currentAttempt.isCorrect}
              />
            )}

            {phase === 'explanation_shown' && (
              <div className="px-6 pb-6">
                <button
                  onClick={nextQuestion}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors"
                >
                  {total >= 10 ? 'See results' : 'Next question →'}
                </button>
              </div>
            )}
          </>
        )}

        {phase === 'session_complete' && (
          <QuizSummary
            score={score}
            total={total}
            onRetry={reset}
            onHome={() => navigate('/')}
          />
        )}

      </div>
    </div>
  )
}
