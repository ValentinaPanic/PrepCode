import { useState, useCallback } from 'react'
import type { QuizResult, ChallengeResult, UserStats } from '../types'

const STORAGE_KEY = 'prepcode-stats'

const emptyStats: UserStats = {
  quizResults: [],
  challengeResults: [],
}

/**
 * Reads stats from localStorage.
 * Returns empty stats if nothing is stored or if the data is corrupted.
 */
function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStats
    return JSON.parse(raw) as UserStats
  } catch {
    return emptyStats
  }
}

/**
 * Writes stats to localStorage as a JSON string.
 */
function saveStats(stats: UserStats): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

/**
 * Hook that provides read/write access to persistent user stats.
 *
 * Stats are stored in localStorage — no backend, no auth.
 * The hook loads stats once on mount and keeps an in-memory copy
 * in React state so the UI re-renders when stats change.
 */
export function useStats() {
  const [stats, setStats] = useState<UserStats>(loadStats)

  // Save a completed quiz session
  const saveQuizResult = useCallback((result: QuizResult) => {
    setStats(prev => {
      const updated = {
        ...prev,
        quizResults: [...prev.quizResults, result],
      }
      saveStats(updated)
      return updated
    })
  }, [])

  // Save or update a component challenge score
  const saveChallengeResult = useCallback((result: ChallengeResult) => {
    setStats(prev => {
      const existing = prev.challengeResults.find(
        r => r.challengeId === result.challengeId
      )

      let updatedChallenges: ChallengeResult[]

      if (existing) {
        // Only update if the new score is higher
        if (result.bestScore > existing.bestScore) {
          updatedChallenges = prev.challengeResults.map(r =>
            r.challengeId === result.challengeId ? result : r
          )
        } else {
          return prev // no change needed
        }
      } else {
        updatedChallenges = [...prev.challengeResults, result]
      }

      const updated = { ...prev, challengeResults: updatedChallenges }
      saveStats(updated)
      return updated
    })
  }, [])

  // Computed values for the dashboard
  const totalQuizSessions = stats.quizResults.length
  const totalChallengesCompleted = stats.challengeResults.filter(r => r.bestScore === 100).length

  const averageQuizScore = totalQuizSessions > 0
    ? Math.round(
        stats.quizResults.reduce((sum, r) => sum + (r.score / r.total) * 100, 0)
        / totalQuizSessions
      )
    : 0

  // Most recent activity (quiz or challenge), sorted by date, latest first
  const recentActivity = [
    ...stats.quizResults.map(r => ({
      type: 'quiz' as const,
      label: `${r.topic} (${r.difficulty})`,
      score: `${r.score}/${r.total}`,
      date: r.date,
    })),
    ...stats.challengeResults.map(r => ({
      type: 'challenge' as const,
      label: r.challengeId,
      score: `${r.bestScore}%`,
      date: r.date,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 10)

  return {
    stats,
    saveQuizResult,
    saveChallengeResult,
    totalQuizSessions,
    totalChallengesCompleted,
    averageQuizScore,
    recentActivity,
  }
}
