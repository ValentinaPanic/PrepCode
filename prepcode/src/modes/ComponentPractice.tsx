import { useState } from 'react'
import type { ComponentChallenge } from '../data/componentChallenges'
import { useStats } from '../hooks/useStats'
import { Nav } from '../components/Nav'
import { ChallengeSelector } from '../components/component-practice/ChallengeSelector'
import { ChallengeWorkspace } from '../components/component-practice/ChallengeWorkspace'

export function ComponentPractice() {
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
      <Nav subtitle="Component Practice" />

      <ChallengeSelector
        onSelect={setActiveChallenge}
        challengeResults={stats.challengeResults}
      />
    </div>
  )
}
