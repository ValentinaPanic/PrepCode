import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ComponentChallenge } from '../data/componentChallenges'
import { useStats } from '../hooks/useStats'
import { ChallengeSelector } from '../components/component-practice/ChallengeSelector'
import { ChallengeWorkspace } from '../components/component-practice/ChallengeWorkspace'

export function ComponentPractice() {
  const navigate = useNavigate()
  const [activeChallenge, setActiveChallenge] = useState<ComponentChallenge | null>(null)
  const { stats, saveChallengeResult } = useStats()

  if (activeChallenge) {
    return (
      <ChallengeWorkspace
        key={activeChallenge.id}
        challenge={activeChallenge}
        onBack={() => setActiveChallenge(null)}
        onScoreUpdate={(score) => {
          saveChallengeResult({
            challengeId: activeChallenge.id,
            bestScore: score,
            date: new Date().toISOString(),
          })
        }}
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="flex items-center gap-4 px-8 pt-8">
        <button
          onClick={() => navigate('/')}
          className="text-zinc-400 hover:text-white text-sm transition-colors"
        >
          &larr; Home
        </button>
        <h1 className="text-xl font-bold text-white">Component Practice</h1>
      </div>

      <ChallengeSelector
        onSelect={setActiveChallenge}
        challengeResults={stats.challengeResults}
      />
    </div>
  )
}
