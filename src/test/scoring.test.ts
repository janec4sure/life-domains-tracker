import { describe, expect, it } from 'vitest'
import { calculateOverallScore } from '../lib/scoring'
import { DomainId } from '../types'

function makeScores(value: number): Record<DomainId, number> {
  return {
    relationships: value,
    health: value,
    career: value,
    finances: value,
    growth: value,
    leisure: value,
    environment: value,
    creativity: value,
  }
}

describe('calculateOverallScore', () => {
  it('returns raw score when foundational scores are above threshold', () => {
    const scores = makeScores(8)
    const result = calculateOverallScore(scores, 4)

    expect(result.rawWeightedScore).toBe(8)
    expect(result.finalScore).toBe(8)
    expect(result.cap).toBeNull()
  })

  it('caps score when health or finances is below threshold', () => {
    const scores = makeScores(9)
    scores.health = 2

    const result = calculateOverallScore(scores, 4)

    expect(result.rawWeightedScore).toBeGreaterThan(result.finalScore)
    expect(result.cap).not.toBeNull()
    expect(result.cap).toBeCloseTo(7, 2)
    expect(result.finalScore).toBeLessThanOrEqual(result.cap ?? 10)
  })
})
