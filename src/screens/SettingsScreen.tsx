import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Card, RatingInput } from '../components/ui'
import { buildExportCsv, downloadCsv } from '../lib/csv'
import { clearAllData, db, ensureDefaults } from '../lib/db'
import { thresholdSchema } from '../lib/validation'

export function SettingsScreen() {
  const [threshold, setThreshold] = useState(4)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void (async () => {
      await ensureDefaults()
      const settings = await db.settings.toCollection().first()
      if (settings?.foundationalThreshold) {
        setThreshold(settings.foundationalThreshold)
      }
    })()
  }, [])

  async function saveThreshold() {
    const parsed = thresholdSchema.safeParse(threshold)
    if (!parsed.success) {
      setMessage('Threshold must be between 1 and 10.')
      return
    }

    const settings = await db.settings.toCollection().first()
    if (settings?.id) {
      await db.settings.update(settings.id, { foundationalThreshold: threshold })
      setMessage('Threshold saved.')
    }
  }

  async function exportCsv() {
    const daily = await db.dailyCheckIns.orderBy('date').toArray()
    const weekly = await db.weeklyReviews.orderBy('weekStart').toArray()
    const ideal = await db.idealDays.orderBy('createdAt').toArray()
    const csv = buildExportCsv({ daily, weekly, ideal })
    downloadCsv(csv, `life-domains-export-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    setMessage('CSV exported.')
  }

  async function wipeData() {
    const confirmed = window.confirm('Delete all local data? This cannot be undone.')
    if (!confirmed) return

    await clearAllData()
    setMessage('All data deleted.')
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Foundational threshold">
        <p className="mb-2 text-sm text-stone-600">
          Overall score is capped when min(Health, Finances) is below threshold.
        </p>
        <p className="mb-1 text-sm">Threshold: {threshold}</p>
        <RatingInput id="settings-threshold" value={threshold} onChange={setThreshold} />
        <button onClick={saveThreshold} className="mt-3 rounded-xl bg-stone-800 px-3 py-2 text-sm text-white">
          Save threshold
        </button>
      </Card>

      <Card title="Data controls">
        <div className="grid gap-2">
          <button onClick={exportCsv} className="rounded-xl bg-teal-700 px-3 py-2 text-sm text-white">
            Export CSV
          </button>
          <button onClick={wipeData} className="rounded-xl bg-red-700 px-3 py-2 text-sm text-white">
            Delete all data
          </button>
          {message ? <p className="text-sm text-stone-600">{message}</p> : null}
        </div>
      </Card>
    </div>
  )
}
