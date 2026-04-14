import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../hooks/useQuiz'
import { QuizScoreBar } from '../components/quiz/QuizScoreBar'
import { QuizTopicSelector } from '../components/quiz/QuizTopicSelector'
import { QuizQuestionCard } from '../components/quiz/QuizQuestionCard'
import { QuizExplanation } from '../components/quiz/QuizExplanation'
import { QuizSummary } from '../components/quiz/QuizSummary'

export function Quiz() {
  const navigate = useNavigate()
  const { state, startSession, submitAnswer, nextQuestion, reset } = useQuiz()
  const { phase, currentQuestion, currentAttempt, score, total } = state

  const isAnswered = phase === 'loading_explanation' || phase === 'explanation_shown'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Back to home"
          >
            ←
          </button>
          <div>
            <h1 className="text-white font-semibold">Quiz</h1>
            <p className="text-zinc-500 text-xs mt-0.5">React · JavaScript · TypeScript · CSS</p>
          </div>
        </div>
        {phase !== 'idle' && (
          <button
            onClick={reset}
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            New session
          </button>
        )}
      </div>

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
          <div className="flex items-center justify-center flex-1 gap-2 text-zinc-500">
            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
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
