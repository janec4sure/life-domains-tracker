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

  const humanLabels: Record<DomainId, string> = {
    relationships: 'Relationships',
    health: 'Health',
    career: 'Work & Purpose',
    finances: 'Money & Security',
    growth: 'Personal Growth',
    leisure: 'Leisure',
    environment: 'Home & Space',
    creativity: 'Creativity',
  }

  const chartData = DOMAINS.map((domain) => ({
    domain: humanLabels[domain.id],
    score: domainScores[domain.id],
  }))

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card title={`Welcome, ${name}`}>
        <p className="text-sm text-[#5A5A5A]">A calm space to notice your direction, one day at a time.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link className="rounded-2xl bg-[#3F6F68] px-4 py-2.5 text-sm font-medium text-white" to="/daily-check-in">
            Reflect on today
          </Link>
          <Link className="rounded-2xl bg-[#E3ECEA] px-4 py-2.5 text-sm font-medium text-[#355D57]" to="/weekly-review">
            Weekly reflection
          </Link>
        </div>

        <div className="mt-5 rounded-2xl bg-[#F4F6F4] p-4">
          <p className="text-xs uppercase tracking-wide text-[#666]">Life balance snapshot</p>
          <p className="mt-1 text-lg font-semibold text-[#2C2C2C]">{result.finalScore.toFixed(1)} / 10</p>
          <p className="mt-2 text-xs text-[#666]">{thresholdExplanation(result)}</p>
        </div>
      </Card>

      <Card title="Life balance map">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 34, right: 46, bottom: 34, left: 46 }}>
              <PolarGrid stroke="#D7DEDB" />
              <PolarAngleAxis dataKey="domain" tick={{ fontSize: 12, fill: '#4B4B4B' }} />
              <Radar dataKey="score" stroke="#3F6F68" fill="#7FA7A1" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Next gentle steps">
        <ul className="grid gap-2 text-sm text-[#4A4A4A]">
          <li>1. Take one minute to reflect on today.</li>
          <li>2. Revisit your weekly reflection when ready.</li>
          <li>3. Choose one focus action for this week.</li>
        </ul>
      </Card>

      {activePinnedCount > 0 ? (
        <Card title="Focus areas">
          <p className="text-sm text-[#5A5A5A]">You have {activePinnedCount} active focus {activePinnedCount === 1 ? 'area' : 'areas'}.</p>
          <Link className="mt-3 inline-block rounded-2xl bg-[#3F6F68] px-3 py-2 text-sm text-white" to="/pinned/active">
            Open focus areas
          </Link>
        </Card>
      ) : null}
    </div>
  )
}
