import { FormEvent, useState } from 'react'
import { format } from 'date-fns'
import { Card, RatingInput } from '../components/ui'
import { DOMAINS } from '../config/domains'
import { db } from '../lib/db'
import { ContributorTag, DomainId } from '../types'

const tags: ContributorTag[] = [
  'sleep',
  'stress',
  'movement',
  'nutrition',
  'social',
  'focus',
  'money',
  'purpose',
  'rest',
]

export function DailyCheckInScreen() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [overallRating, setOverallRating] = useState(6)
  const [selectedTags, setSelectedTags] = useState<ContributorTag[]>([])
  const [quickRatings, setQuickRatings] = useState<Partial<Record<DomainId, number>>>({})
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const toggleTag = (tag: ContributorTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    )
  }

  const toggleQuickRating = (domainId: DomainId) => {
    setQuickRatings((prev) => {
      if (domainId in prev) {
        const copy = { ...prev }
        delete copy[domainId]
        return copy
      }

      return { ...prev, [domainId]: 5 }
    })
  }

  async function saveCheckin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await db.dailyCheckIns.add({
      date,
      overallRating,
      contributorTags: selectedTags,
      quickRatings,
      notes: notes.trim() || undefined,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  return (
    <Card title="Daily check-in">
      <form className="grid gap-4" onSubmit={saveCheckin}>
        <label className="grid gap-1">
          <span className="text-sm">Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2"
          />
        </label>

        <div className="grid gap-1">
          <label htmlFor="overall-rating" className="text-sm">
            Overall score: {overallRating}
          </label>
          <RatingInput id="overall-rating" value={overallRating} onChange={setOverallRating} />
        </div>

        <div className="grid gap-2">
          <p className="text-sm">Contributor tags (optional)</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-3 py-1 text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-teal-600 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <p className="text-sm">Quick domain ratings (optional)</p>
          {DOMAINS.map((domain) => {
            const value = quickRatings[domain.id] ?? 5
            const enabled = domain.id in quickRatings

            return (
              <div key={domain.id} className="rounded-xl border border-stone-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{domain.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleQuickRating(domain.id)}
                    className="rounded-lg bg-stone-100 px-2 py-1 text-xs"
                  >
                    {enabled ? 'Remove' : 'Add'}
                  </button>
                </div>
                {enabled ? (
                  <div className="grid gap-1">
                    <span className="text-xs text-stone-500">Rating: {value}</span>
                    <RatingInput
                      id={`quick-${domain.id}`}
                      value={value}
                      onChange={(newValue) => setQuickRatings((prev) => ({ ...prev, [domain.id]: newValue }))}
                    />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="rounded-xl border border-stone-300 px-3 py-2"
          />
        </label>

        <button type="submit" className="rounded-xl bg-stone-800 px-4 py-2 text-sm font-medium text-white">
          Save check-in
        </button>
        {saved ? <p className="text-sm text-emerald-700">Saved.</p> : null}
      </form>
    </Card>
  )
}
