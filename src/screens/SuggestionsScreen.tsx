import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui'
import { db, getSettings } from '../lib/db'
import { defaultDomainScores, defaultFactorRatings } from '../lib/defaults'
import { selectSuggestions } from '../lib/suggestions'
import { DomainId, Suggestion, WeeklyReview } from '../types'

function shuffled<T>(arr: T[], seed: number) {
  const copy = [...arr]
  let s = seed
  for (let i = copy.length - 1; i > 0; i -= 1) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

export function SuggestionsScreen() {
  const [review, setReview] = useState<WeeklyReview | null>(null)
  const [idealTargets, setIdealTargets] = useState<Record<string, number>>(defaultFactorRatings(7))
  const [threshold, setThreshold] = useState(4)
  const [regenSeed, setRegenSeed] = useState(7)
  const [activePinnedIds, setActivePinnedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    void (async () => {
      const latestReview = await db.weeklyReviews.orderBy('weekStart').reverse().first()
      const latestIdeal = await db.idealDays.orderBy('createdAt').reverse().first()
      const settings = await getSettings()
      const activePinned = await db.pinnedSuggestions.where('status').equals('active').toArray()

      setReview(latestReview ?? null)
      setIdealTargets(latestIdeal?.factorTargets ?? defaultFactorRatings(7))
      setThreshold(settings.foundationalThreshold)
      setActivePinnedIds(new Set(activePinned.map((item) => item.suggestionId)))
    })()
  }, [])

  const suggestions = useMemo(() => {
    const factorRatings = review?.factorRatings ?? defaultFactorRatings(5)
    const domainScores =
      (review?.domainScores as Record<DomainId, number> | undefined) ?? defaultDomainScores(5)

    const base = selectSuggestions({
      currentFactorRatings: factorRatings,
      idealFactorTargets: idealTargets,
      domainScores,
      threshold,
      maxSuggestions: 5,
    }).filter((suggestion) => !activePinnedIds.has(suggestion.id))

    return shuffled(base, regenSeed).slice(0, 5)
  }, [activePinnedIds, idealTargets, regenSeed, review, threshold])

  async function pinSuggestion(suggestion: Suggestion) {
    await db.pinnedSuggestions.add({
      suggestionId: suggestion.id,
      pinnedAt: new Date().toISOString(),
      status: 'active',
    })
    setActivePinnedIds((prev) => new Set(prev).add(suggestion.id))
  }

  return (
    <div className="grid gap-4">
      <Card title="Suggestions">
        <p className="mb-3 text-sm text-stone-600">
          Max 5 suggestions: up to 3 from ideal-day gaps and up to 2 from foundational needs.
        </p>
        <button
          className="mb-4 rounded-xl bg-stone-800 px-3 py-2 text-sm text-white"
          onClick={() => setRegenSeed((seed) => seed + 11)}
        >
          Regenerate unpinned
        </button>

        <div className="grid gap-3">
          {suggestions.length === 0 ? (
            <p className="text-sm text-stone-500">No available suggestions. Complete or remove pinned items.</p>
          ) : (
            suggestions.map((suggestion) => (
              <article key={suggestion.id} className="rounded-xl border border-stone-200 p-3">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium">{suggestion.title}</h3>
                  <span className="rounded-full bg-stone-100 px-2 py-1 text-xs">Impact {suggestion.impact}</span>
                </div>
                <p className="text-sm text-stone-600">{suggestion.description}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-teal-700">{suggestion.category}</p>
                <button
                  onClick={() => pinSuggestion(suggestion)}
                  className="mt-3 rounded-lg bg-teal-600 px-3 py-1 text-sm text-white"
                >
                  Pin suggestion
                </button>
              </article>
            ))
          )}
        </div>
      </Card>

      <Card title="Pinned suggestions">
        <p className="text-sm text-stone-600">Pinned items persist until completed or removed.</p>
        <Link to="/pinned/active" className="mt-3 inline-block rounded-xl bg-stone-700 px-3 py-2 text-sm text-white">
          Open pinned detail
        </Link>
      </Card>
    </div>
  )
}
