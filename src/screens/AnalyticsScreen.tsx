import { useEffect, useMemo, useState } from 'react'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '../components/ui'
import { DOMAINS } from '../config/domains'
import { db } from '../lib/db'
import { DailyCheckIn, WeeklyReview } from '../types'

export function AnalyticsScreen() {
  const [daily, setDaily] = useState<DailyCheckIn[]>([])
  const [weekly, setWeekly] = useState<WeeklyReview[]>([])

  useEffect(() => {
    void (async () => {
      const dailyRows = await db.dailyCheckIns.orderBy('date').toArray()
      const weeklyRows = await db.weeklyReviews.orderBy('weekStart').toArray()
      setDaily(dailyRows)
      setWeekly(weeklyRows)
    })()
  }, [])

  const dailyTrend = useMemo(
    () => daily.map((item) => ({ date: item.date.slice(5), overall: item.overallRating })),
    [daily],
  )

  const weeklyTrend = useMemo(
    () =>
      weekly.map((item) => {
        const row: Record<string, number | string> = { week: item.weekStart.slice(5) }
        for (const domain of DOMAINS) {
          row[domain.id] = item.domainScores[domain.id]
        }
        return row
      }),
    [weekly],
  )

  return (
    <div className="grid gap-4">
      <Card title="Daily overall trend">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="overall" stroke="#0f766e" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Weekly domain trends">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[1, 10]} />
              <Tooltip />
              <Legend />
              {DOMAINS.map((domain, idx) => (
                <Line
                  key={domain.id}
                  type="monotone"
                  dataKey={domain.id}
                  name={domain.name}
                  stroke={['#0f766e', '#0284c7', '#f97316', '#a16207', '#334155', '#c2410c', '#6d28d9', '#b91c1c'][idx]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
