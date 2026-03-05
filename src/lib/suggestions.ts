import { FACTOR_TO_DOMAIN } from '../config/domains'
import { SUGGESTIONS_BY_FACTOR } from '../config/suggestions'
import { Suggestion } from '../types'

function topFactorGaps(
  current: Record<string, number>,
  target: Record<string, number>,
  limit: number,
): string[] {
  return Object.keys(target)
    .map((factorId) => ({ factorId, gap: (target[factorId] ?? 0) - (current[factorId] ?? 0) }))
    .filter((entry) => entry.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, limit)
    .map((entry) => entry.factorId)
}

function chooseHighestImpact(factorId: string, usedIds: Set<string>, max: number): Suggestion[] {
  const options = [...(SUGGESTIONS_BY_FACTOR[factorId] ?? [])]
    .sort((a, b) => b.impact - a.impact)
    .filter((suggestion) => !usedIds.has(suggestion.id))
    .slice(0, max)

  for (const option of options) usedIds.add(option.id)
  return options
}

export function selectSuggestions(args: {
  currentFactorRatings: Record<string, number>
  idealFactorTargets: Record<string, number>
  domainScores: Record<string, number>
  threshold: number
  maxSuggestions?: number
}): Suggestion[] {
  const { currentFactorRatings, idealFactorTargets, domainScores, threshold } = args
  const maxSuggestions = args.maxSuggestions ?? 5

  const selected: Suggestion[] = []
  const usedIds = new Set<string>()

  const idealGapFactors = topFactorGaps(currentFactorRatings, idealFactorTargets, 3)
  for (const factorId of idealGapFactors) {
    if (selected.length >= maxSuggestions || selected.filter((s) => s.category === 'ideal-gap').length >= 3) {
      break
    }
    const [candidate] = chooseHighestImpact(factorId, usedIds, 1)
    if (candidate) selected.push({ ...candidate, category: 'ideal-gap' })
  }

  const foundationalDomains = ['health', 'finances'].filter(
    (domainId) => (domainScores[domainId] ?? 0) < threshold,
  )

  const foundationalFactors = Object.keys(currentFactorRatings)
    .filter((factorId) => foundationalDomains.includes(FACTOR_TO_DOMAIN[factorId]))
    .sort((a, b) => (currentFactorRatings[a] ?? 0) - (currentFactorRatings[b] ?? 0))

  for (const factorId of foundationalFactors) {
    if (
      selected.length >= maxSuggestions ||
      selected.filter((s) => s.category === 'foundational').length >= 2
    ) {
      break
    }
    const [candidate] = chooseHighestImpact(factorId, usedIds, 1)
    if (candidate) selected.push({ ...candidate, category: 'foundational' })
  }

  return selected.slice(0, maxSuggestions)
}
