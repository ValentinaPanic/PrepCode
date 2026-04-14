import { useState } from 'react'
import type { QuizTopic, QuizSessionState } from '../../types'

interface QuizTopicSelectorProps {
  onStart: (topic: QuizTopic, difficulty: QuizSessionState['difficulty']) => void
}

const TOPICS: { value: QuizTopic; label: string; icon: string }[] = [
  { value: 'react',      label: 'React',      icon: '⚛️' },
  { value: 'javascript', label: 'JavaScript', icon: '𝙅𝙎' },
  { value: 'typescript', label: 'TypeScript', icon: '𝙏𝙎' },
  { value: 'css',        label: 'CSS',        icon: '🎨' },
]

const DIFFICULTIES: { value: QuizSessionState['difficulty']; label: string; description: string }[] = [
  { value: 'easy',   label: 'Easy',   description: 'Core concepts' },
  { value: 'medium', label: 'Medium', description: 'Common gotchas' },
  { value: 'hard',   label: 'Hard',   description: 'Deep internals' },
]

export function QuizTopicSelector({ onStart }: QuizTopicSelectorProps) {
  const [topic, setTopic] = useState<QuizTopic | null>(null)
  const [difficulty, setDifficulty] = useState<QuizSessionState['difficulty']>('medium')

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 py-12 gap-10">
      <div className="text-center">
        <h2 className="text-white text-xl font-semibold">Choose a topic</h2>
        <p className="text-zinc-500 text-sm mt-1">10 questions per session</p>
      </div>

      {/* Topic grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {TOPICS.map(t => (
          <button
            key={t.value}
            onClick={() => setTopic(t.value)}
            className={`
              flex flex-col items-center gap-2 p-5 rounded-xl border transition-all
              ${topic === t.value
                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
              }
            `}
          >
            <span className="text-2xl">{t.icon}</span>
            <span className="text-sm font-medium">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Difficulty row */}
      <div className="flex gap-2">
        {DIFFICULTIES.map(d => (
          <button
            key={d.value}
            onClick={() => setDifficulty(d.value)}
            className={`
              flex flex-col items-center px-4 py-2.5 rounded-lg border text-sm transition-all
              ${difficulty === d.value
                ? 'bg-zinc-700 border-zinc-500 text-white'
                : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:border-zinc-500'
              }
            `}
          >
            <span className="font-medium">{d.label}</span>
            <span className="text-xs text-zinc-500 mt-0.5">{d.description}</span>
          </button>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={() => topic && onStart(topic, difficulty)}
        disabled={!topic}
        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
      >
        Start quiz
      </button>
    </div>
  )
}
