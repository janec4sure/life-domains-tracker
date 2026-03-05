import { FormEvent, useEffect, useState } from 'react'
import { format, startOfWeek } from 'date-fns'
import { Card, RatingInput } from '../components/ui'
import { DOMAINS, FACTOR_INDEX } from '../config/domains'
import { db } from '../lib/db'
import { defaultFactorRatings } from '../lib/defaults'
import { calculateOverallScore, getDomainScoresFromFactors } from '../lib/scoring'

export function WeeklyReviewScreen() {
  const [weekStart, setWeekStart] = useState(format(startOfWeek(new Date()), 'yyyy-MM-dd'))
  const [factorRatings, setFactorRatings] = useState<Record<string, number>>(defaultFactorRatings())
  const [summary, setSummary] = useState('')
  const [saved, setSaved] = useState(false)
  const [threshold, setThreshold] = useState(4)

  useEffect(() => {
    void (async () => {
      const latest = await db.weeklyReviews.orderBy('weekStart').reverse().first()
      const settings = await db.settings.toCollection().first()
      if (latest) {
        setFactorRatings(latest.factorRatings)
      }
      if (settings?.foundationalThreshold) {
        setThreshold(settings.foundationalThreshold)
      }
    })()
  }, [])

  async function saveWeeklyReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const domainScores = getDomainScoresFromFactors(factorRatings)

    await db.weeklyReviews.add({
      weekStart,
      factorRatings,
      domainScores,
      summary: summary.trim() || undefined,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const domainScores = getDomainScoresFromFactors(factorRatings)
  const result = calculateOverallScore(domainScores, threshold)

  return (
    <div className="grid gap-4">
      <Card title="Weekly review">
        <form className="grid gap-4" onSubmit={saveWeeklyReview}>
          <label className="grid gap-1">
            <span className="text-sm">Week start</span>
            <input
              type="date"
              value={weekStart}
              onChange={(event) => setWeekStart(event.target.value)}
              className="rounded-xl border border-stone-300 px-3 py-2"
            />
          </label>

          <div className="rounded-xl bg-stone-100 p-3 text-sm text-stone-700">
            Weighted score preview: <strong>{result.finalScore.toFixed(2)}</strong> / 10
            {result.cap !== null ? ` (capped at ${result.cap.toFixed(2)})` : ' (not capped)'}
          </div>

          {DOMAINS.map((domain) => (
            <div key={domain.id} className="rounded-xl border border-stone-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-stone-700">{domain.name}</h3>
                <p className="text-sm text-stone-500">Domain score: {domainScores[domain.id].toFixed(2)}</p>
              </div>

              <div className="grid gap-3">
                {domain.factors.map((factor) => (
                  <div key={factor.id} className="grid gap-1">
                    <label htmlFor={factor.id} className="text-sm">
                      {factor.name}: {factorRatings[factor.id]}
                    </label>
                    <RatingInput
                      id={factor.id}
                      value={factorRatings[factor.id]}
                      onChange={(value) => setFactorRatings((prev) => ({ ...prev, [factor.id]: value }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <label className="grid gap-1">
            <span className="text-sm">Weekly summary (optional)</span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={3}
              className="rounded-xl border border-stone-300 px-3 py-2"
            />
          </label>

          <button className="rounded-xl bg-stone-800 px-4 py-2 text-sm font-medium text-white" type="submit">
            Save weekly review
          </button>
          {saved ? <p className="text-sm text-emerald-700">Weekly review saved.</p> : null}
        </form>
      </Card>

      <Card title="Factor coverage">
        <p className="text-sm text-stone-600">All {FACTOR_INDEX.length} factors are included in weekly scoring.</p>
      </Card>
    </div>
  )
}
