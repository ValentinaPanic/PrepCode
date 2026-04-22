import type { QuizQuestion, QuizOption, QuizTopic } from '../types'

/**
 * Partial parse of a streaming quiz question response.
 *
 * The server streams text in this shape (see prompts/quiz.ts):
 *
 *   [FORMAT]
 *   multiple_choice
 *
 *   [QUESTION]
 *   What does...
 *
 *   [OPTIONS]
 *   A: ...
 *   B: ...
 *
 *   [ANSWER]
 *   B
 *
 *   [EXPLANATION]
 *   ...
 *
 * On each stream chunk we re-parse the whole accumulated buffer. The buffer
 * is small (<4KB) so the cost is trivial, and it keeps the parser stateless.
 */

export interface PartialQuizQuestion {
  question?: string
  options?: QuizOption[]
  correctAnswer?: string
  explanation?: string
}

const SECTION_RE = /\[(FORMAT|QUESTION|OPTIONS|ANSWER|EXPLANATION)\]\n([\s\S]*?)(?=\n\[(?:FORMAT|QUESTION|OPTIONS|ANSWER|EXPLANATION)\]|$)/g

export function parseQuizStream(buffer: string): PartialQuizQuestion {
  const result: PartialQuizQuestion = {}

  // Reset regex state since we use the /g flag.
  SECTION_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = SECTION_RE.exec(buffer)) !== null) {
    const name = match[1]
    const content = match[2].trim()
    if (!content) continue

    switch (name) {
      case 'QUESTION':
        result.question = content
        break
      case 'OPTIONS':
        result.options = parseOptions(content)
        break
      case 'ANSWER': {
        // Single letter A–D. Only commit once it's complete (avoid flashing "A"
        // when the model was about to emit "ABC" mid-word).
        const letter = content.match(/^[A-D]\b/)
        if (letter) result.correctAnswer = letter[0]
        break
      }
      case 'EXPLANATION':
        result.explanation = content
        break
    }
  }

  return result
}

function parseOptions(content: string): QuizOption[] {
  const options: QuizOption[] = []
  for (const line of content.split('\n')) {
    const m = line.match(/^([A-D]):\s*(.+)$/)
    if (m) {
      options.push({ label: m[1] as QuizOption['label'], text: m[2].trim() })
    }
  }
  return options
}

/**
 * Convert a final buffer into a full QuizQuestion, filling in the
 * request-time fields (topic, difficulty) that the model doesn't emit.
 * Returns null if the buffer is incomplete or malformed.
 */
export function finalizeQuizQuestion(
  buffer: string,
  topic: QuizTopic,
  difficulty: QuizQuestion['difficulty']
): QuizQuestion | null {
  const partial = parseQuizStream(buffer)
  if (
    !partial.question ||
    !partial.options ||
    partial.options.length !== 4 ||
    !partial.correctAnswer ||
    !partial.explanation
  ) {
    return null
  }
  return {
    format: 'multiple_choice',
    topic,
    difficulty,
    question: partial.question,
    options: partial.options,
    correctAnswer: partial.correctAnswer,
    explanation: partial.explanation,
  }
}
