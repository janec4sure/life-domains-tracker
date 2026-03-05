import { DOMAINS, FACTOR_INDEX } from '../config/domains'
import { DomainId, ScoringResult } from '../types'

const round2 = (value: number) => Math.round(value * 100) / 100

export function getDomainScoresFromFactors(
  factorRatings: Record<string, number>,
): Record<DomainId, number> {
  const result = {} as Record<DomainId, number>

  for (const domain of DOMAINS) {
    const values = domain.factors
      .map((factor) => factorRatings[factor.id])
      .filter((value): value is number => typeof value === 'number')

    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
    result[domain.id] = round2(avg)
  }

  return result
}

export function getEmptyFactorRatings() {
  return Object.fromEntries(FACTOR_INDEX.map((factor) => [factor.id, 5])) as Record<string, number>
}

export function calculateOverallScore(
  domainScores: Record<DomainId, number>,
  threshold = 4,
): ScoringResult {
  const rawWeightedScore = round2(
    DOMAINS.reduce((sum, domain) => sum + domainScores[domain.id] * (domain.weight / 100), 0),
  )

  const healthScore = domainScores.health
  const financesScore = domainScores.finances
  const foundationalMin = Math.min(healthScore, financesScore)

  if (foundationalMin >= threshold) {
    return {
      rawWeightedScore,
      finalScore: rawWeightedScore,
      cap: null,
      foundationalMin,
      threshold,
      domainScores,
    }
  }

  const deficitRatio = (threshold - foundationalMin) / threshold
  const cap = round2(10 - deficitRatio * (10 - threshold))
  const finalScore = round2(Math.min(rawWeightedScore, cap))

  return {
    rawWeightedScore,
    finalScore,
    cap,
    foundationalMin,
    threshold,
    domainScores,
  }
}

export function thresholdExplanation(result: ScoringResult) {
  if (result.cap === null) {
    return 'Health and Finances are above threshold, so no foundational cap is applied.'
  }

  return `Foundational cap active: min(Health, Finances)=${result.foundationalMin.toFixed(1)} is below threshold ${result.threshold}. Score is capped at ${result.cap.toFixed(2)} until foundational domains improve.`
}
