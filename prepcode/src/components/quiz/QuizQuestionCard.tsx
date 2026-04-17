import type { QuizQuestion, QuizAttempt } from '../../types'
import { QuizOptionButton } from './QuizOptionButton'
import { QuizShortAnswerInput } from './QuizShortAnswerInput'
import { CodeText } from './CodeText'

interface QuizQuestionCardProps {
  question: QuizQuestion
  attempt: QuizAttempt | null
  disabled: boolean
  onAnswer: (answer: string) => void
}

export function QuizQuestionCard({ question, attempt, disabled, onAnswer }: QuizQuestionCardProps) {
  function getOptionState(label: string): 'default' | 'selected' | 'correct' | 'incorrect' {
    if (!attempt) return 'default'

    const isCorrectOption = label === question.correctAnswer
    const isSelectedOption = label === attempt.userAnswer

    if (isCorrectOption) return 'correct'
    if (isSelectedOption && !attempt.isCorrect) return 'incorrect'
    return 'default'
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Question text */}
      <div className="text-white text-base leading-relaxed">
        <CodeText text={question.question} />
      </div>

      {/* Answer input — MCQ or short answer */}
      {question.format === 'multiple_choice' && question.options ? (
        <div className="flex flex-col gap-2">
          {question.options.map(option => (
            <QuizOptionButton
              key={option.label}
              label={option.label}
              text={option.text}
              state={getOptionState(option.label)}
              disabled={disabled}
              onClick={() => onAnswer(option.label)}
            />
          ))}
        </div>
      ) : (
        <QuizShortAnswerInput
          disabled={disabled}
          onSubmit={onAnswer}
        />
      )}
    </div>
  )
}
