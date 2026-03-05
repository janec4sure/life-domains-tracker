import { describe, expect, it } from 'vitest'
import { selectSuggestions } from '../lib/suggestions'
import { defaultDomainScores, defaultFactorRatings } from '../lib/defaults'
import { FACTOR_INDEX } from '../config/domains'

describe('selectSuggestions', () => {
  it('respects max suggestions and category limits', () => {
    const current = defaultFactorRatings(4)
    const ideal = defaultFactorRatings(8)
    const domainScores = defaultDomainScores(6)
    domainScores.health = 3
    domainScores.finances = 2

    const result = selectSuggestions({
      currentFactorRatings: current,
      idealFactorTargets: ideal,
      domainScores,
      threshold: 4,
      maxSuggestions: 5,
    })

    const idealGapCount = result.filter((item) => item.category === 'ideal-gap').length
    const foundationalCount = result.filter((item) => item.category === 'foundational').length

    expect(result.length).toBeLessThanOrEqual(5)
    expect(idealGapCount).toBeLessThanOrEqual(3)
    expect(foundationalCount).toBeLessThanOrEqual(2)
  })

  it('returns unique suggestions and maps to known factors', () => {
    const current = defaultFactorRatings(5)
    const ideal = defaultFactorRatings(9)
    const domainScores = defaultDomainScores(7)

    const result = selectSuggestions({
      currentFactorRatings: current,
      idealFactorTargets: ideal,
      domainScores,
      threshold: 4,
    })

    const ids = new Set(result.map((item) => item.id))
    const factorIds = new Set(FACTOR_INDEX.map((factor) => factor.id))

    expect(ids.size).toBe(result.length)
    expect(result.every((item) => factorIds.has(item.factorId))).toBe(true)
  })
})
