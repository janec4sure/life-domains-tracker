import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui'
import { SUGGESTION_POOL } from '../config/suggestions'
import { db, getSettings } from '../lib/db'
import { defaultDomainScores, defaultFactorRatings } from '../lib/defaults'
import { selectSuggestions } from '../lib/suggestions'
import { DomainId, PinnedSuggestion, Suggestion, WeeklyReview } from '../types'

export function SuggestionsScreen() {
  const [review, setReview] = useState<WeeklyReview | null>(null)
  const [idealTargets, setIdealTargets] = useState<Record<string, number>>(defaultFactorRatings(7))
  const [threshold, setThreshold] = useState(4)
  const [regenSeed, setRegenSeed] = useState(7)
  const [activePinned, setActivePinned] = useState<PinnedSuggestion[]>([])

  useEffect(() => {
    void (async () => {
      const latestReview = await db.weeklyReviews.orderBy('weekStart').reverse().first()
      const latestIdeal = await db.idealDays.orderBy('createdAt').reverse().first()
      const settings = await getSettings()
      const pinned = await db.pinnedSuggestions.where('status').equals('active').toArray()
      pinned.sort((a, b) => b.pinnedAt.localeCompare(a.pinnedAt))

      setReview(latestReview ?? null)
      setIdealTargets(latestIdeal?.factorTargets ?? defaultFactorRatings(7))
      setThreshold(settings.foundationalThreshold)
      setActivePinned(pinned)
    })()
  }, [])

  const activePinnedIds = useMemo(() => new Set(activePinned.map((item) => item.suggestionId)), [activePinned])

  const pinnedSuggestions = useMemo(
    () =>
      activePinned
        .map((item) => SUGGESTION_POOL.find((s) => s.id === item.suggestionId))
        .filter((s): s is Suggestion => Boolean(s)),
    [activePinned],
  )

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
      seed: regenSeed,
    }).filter((suggestion) => !activePinnedIds.has(suggestion.id))

    return base
  }, [activePinnedIds, idealTargets, regenSeed, review, threshold])

  async function pinSuggestion(suggestion: Suggestion) {
    await db.pinnedSuggestions.add({
      suggestionId: suggestion.id,
      pinnedAt: new Date().toISOString(),
      status: 'active',
    })

    setActivePinned((prev) => [
      { suggestionId: suggestion.id, pinnedAt: new Date().toISOString(), status: 'active' },
      ...prev,
    ])
  }

  return (
    <div className="grid gap-4">
      <Card title="Focus actions">
        <p className="mb-3 text-sm text-stone-600">
          A small set of actions tailored to your ideal-day gaps and foundational needs.
        </p>
        <button
          className="mb-4 rounded-xl bg-stone-800 px-3 py-2 text-sm text-white"
          onClick={() => setRegenSeed((seed) => seed + 11)}
        >
          Regenerate unpinned
        </button>

        {pinnedSuggestions.length > 0 ? (
          <div className="mb-4 grid gap-3">
            <p className="text-xs uppercase tracking-wide text-stone-500">Pinned focus areas</p>
            {pinnedSuggestions.map((suggestion) => (
              <article key={`pinned-${suggestion.id}`} className="rounded-xl border border-teal-200 bg-teal-50/40 p-3">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium">{suggestion.title}</h3>
                  <span className="rounded-full bg-teal-100 px-2 py-1 text-xs">Pinned</span>
                </div>
                <p className="text-sm text-stone-600">{suggestion.description}</p>
                <Link
                  to="/pinned/active"
                  className="mt-3 inline-block rounded-lg bg-teal-700 px-3 py-1 text-sm text-white"
                >
                  Open pinned detail
                </Link>
              </article>
            ))}
          </div>
        ) : null}

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
    </div>
  )
}
