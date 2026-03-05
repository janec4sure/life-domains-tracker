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
    .sort((a, b) => b.gap - a.gap)
    .slice(0, limit)
    .map((entry) => entry.factorId)
}

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function weightedSampleWithoutReplacement(
  pool: Suggestion[],
  count: number,
  random: () => number,
  usedIds: Set<string>,
): Suggestion[] {
  const candidates = pool.filter((s) => !usedIds.has(s.id))
  const picked: Suggestion[] = []

  while (picked.length < count && candidates.length > 0) {
    const total = candidates.reduce((sum, s) => sum + Math.max(1, s.impact), 0)
    let threshold = random() * total
    let idx = 0

    for (let i = 0; i < candidates.length; i += 1) {
      threshold -= Math.max(1, candidates[i].impact)
      if (threshold <= 0) {
        idx = i
        break
      }
    }

    const [choice] = candidates.splice(idx, 1)
    usedIds.add(choice.id)
    picked.push(choice)
  }

  return picked
}

function suggestionsForFactors(factorIds: string[], category: 'ideal-gap' | 'foundational'): Suggestion[] {
  return factorIds.flatMap((factorId) =>
    (SUGGESTIONS_BY_FACTOR[factorId] ?? []).map((suggestion) => ({ ...suggestion, category })),
  )
}

export function selectSuggestions(args: {
  currentFactorRatings: Record<string, number>
  idealFactorTargets: Record<string, number>
  domainScores: Record<string, number>
  threshold: number
  maxSuggestions?: number
  seed?: number
}): Suggestion[] {
  const { currentFactorRatings, idealFactorTargets } = args
  const maxSuggestions = args.maxSuggestions ?? 5
  const random = mulberry32(args.seed ?? Date.now())

  const selected: Suggestion[] = []
  const usedIds = new Set<string>()

  // Up to 3 from ideal-day gaps
  const idealGapFactors = topFactorGaps(currentFactorRatings, idealFactorTargets, 12)
  const idealPool = suggestionsForFactors(idealGapFactors, 'ideal-gap')
  selected.push(...weightedSampleWithoutReplacement(idealPool, Math.min(3, maxSuggestions), random, usedIds))

  // Up to 2 from deficits: prioritize foundational factors, then lowest overall factors
  const allFactorsByLowScore = Object.keys(currentFactorRatings).sort(
    (a, b) => (currentFactorRatings[a] ?? 0) - (currentFactorRatings[b] ?? 0),
  )

  const foundationalFirst = allFactorsByLowScore.sort((a, b) => {
    const aFound = ['health', 'finances'].includes(FACTOR_TO_DOMAIN[a]) ? 0 : 1
    const bFound = ['health', 'finances'].includes(FACTOR_TO_DOMAIN[b]) ? 0 : 1
    return aFound - bFound
  })

  const deficitPool = suggestionsForFactors(foundationalFirst.slice(0, 16), 'foundational')
  selected.push(
    ...weightedSampleWithoutReplacement(deficitPool, Math.min(2, maxSuggestions - selected.length), random, usedIds),
  )

  // Backfill to max (weighted), if either bucket had too few unique candidates
  if (selected.length < maxSuggestions) {
    const combinedPool = [
      ...idealPool,
      ...deficitPool,
      ...suggestionsForFactors(allFactorsByLowScore.slice(0, 24), 'foundational'),
    ]
    selected.push(
      ...weightedSampleWithoutReplacement(
        combinedPool,
        maxSuggestions - selected.length,
        random,
        usedIds,
      ),
    )
  }

  return selected.slice(0, maxSuggestions)
}
