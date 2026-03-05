import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { DOMAINS } from '../config/domains'
import { Card } from '../components/ui'
import { db, getSettings } from '../lib/db'
import { calculateOverallScore, thresholdExplanation } from '../lib/scoring'
import { defaultDomainScores } from '../lib/defaults'
import { DomainId, WeeklyReview } from '../types'

export function HomeDashboardScreen() {
  const [latestReview, setLatestReview] = useState<WeeklyReview | null>(null)
  const [threshold, setThreshold] = useState(4)
  const [name, setName] = useState('there')
  const [activePinnedCount, setActivePinnedCount] = useState(0)

  useEffect(() => {
    void (async () => {
      const review = await db.weeklyReviews.orderBy('weekStart').reverse().first()
      const settings = await getSettings()
      const profile = await db.profile.toCollection().first()
      const pinnedCount = await db.pinnedSuggestions.where('status').equals('active').count()

      setLatestReview(review ?? null)
      setThreshold(settings.foundationalThreshold)
      setName(profile?.displayName ?? 'there')
      setActivePinnedCount(pinnedCount)
    })()
  }, [])

  const domainScores = useMemo(
    () => (latestReview?.domainScores ?? defaultDomainScores(5)) as Record<DomainId, number>,
    [latestReview],
  )

  const result = calculateOverallScore(domainScores, threshold)

  const chartData = DOMAINS.map((domain) => ({
    domain: domain.name,
    score: domainScores[domain.id],
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title={`Welcome, ${name}`}>
        <p className="text-sm text-stone-600">Simple dashboard snapshot. Use analytics for deeper trend detail.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-stone-100 p-3">
            <p className="text-xs uppercase text-stone-500">Overall score</p>
            <p className="text-2xl font-semibold">{result.finalScore.toFixed(2)} / 10</p>
          </div>
          <div className="rounded-xl bg-stone-100 p-3">
            <p className="text-xs uppercase text-stone-500">Pinned suggestions</p>
            <p className="text-2xl font-semibold">{activePinnedCount}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-stone-500">{thresholdExplanation(result)}</p>

        <div className="mt-4 flex gap-2">
          <Link className="rounded-xl bg-stone-800 px-3 py-2 text-sm text-white" to="/daily-check-in">
            Daily check-in
          </Link>
          <Link className="rounded-xl bg-stone-700 px-3 py-2 text-sm text-white" to="/weekly-review">
            Weekly review
          </Link>
        </div>
      </Card>

      <Card title="Domain pulse">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11 }} />
              <Radar dataKey="score" stroke="#0f766e" fill="#99f6e4" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Next steps">
        <ul className="grid gap-2 text-sm text-stone-700">
          <li>1. Log your daily overall score.</li>
          <li>2. Refresh all factor ratings in weekly review.</li>
          <li>3. Set ideal targets and generate focused suggestions.</li>
        </ul>
      </Card>

      <Card title="Onboarding status">
        <p className="text-sm text-stone-600">Profile + threshold can be changed anytime.</p>
        <Link className="mt-3 inline-block rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-800" to="/onboarding">
          Open onboarding
        </Link>
      </Card>
    </div>
  )
}
