import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/ui'
import { SUGGESTION_POOL } from '../config/suggestions'
import { db } from '../lib/db'
import { PinnedSuggestion, Suggestion } from '../types'

export function PinnedSuggestionScreen() {
  const { id } = useParams()
  const [item, setItem] = useState<PinnedSuggestion | null>(null)
  const [detail, setDetail] = useState<Suggestion | null>(null)

  useEffect(() => {
    void (async () => {
      let pinned: PinnedSuggestion | undefined
      if (id === 'active') {
        const rows = await db.pinnedSuggestions.where('status').equals('active').toArray()
        rows.sort((a, b) => b.pinnedAt.localeCompare(a.pinnedAt))
        pinned = rows[0]
      } else {
        const numericId = Number(id)
        if (!Number.isNaN(numericId)) {
          pinned = await db.pinnedSuggestions.get(numericId)
        }
      }

      if (pinned) {
        setItem(pinned)
        setDetail(SUGGESTION_POOL.find((suggestion) => suggestion.id === pinned.suggestionId) ?? null)
      } else {
        setItem(null)
        setDetail(null)
      }
    })()
  }, [id])

  async function completePinned() {
    if (!item?.id) return
    await db.pinnedSuggestions.update(item.id, { status: 'completed' })
    setItem({ ...item, status: 'completed' })
  }

  async function removePinned() {
    if (!item?.id) return
    await db.pinnedSuggestions.delete(item.id)
    setItem(null)
    setDetail(null)
  }

  return (
    <Card title="Pinned suggestion detail">
      {item && detail ? (
        <div className="grid gap-3">
          <p className="text-xs uppercase text-stone-500">Status: {item.status}</p>
          <h3 className="text-lg font-semibold text-stone-800">{detail.title}</h3>
          <p className="text-sm text-stone-600">{detail.description}</p>
          <p className="text-sm text-stone-600">Impact score: {detail.impact}</p>
          <div className="flex gap-2">
            <button onClick={completePinned} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm text-white">
              Mark complete
            </button>
            <button onClick={removePinned} className="rounded-xl bg-stone-300 px-3 py-2 text-sm text-stone-800">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-stone-500">No pinned suggestion found.</p>
      )}

      <Link to="/suggestions" className="mt-4 inline-block rounded-xl bg-stone-800 px-3 py-2 text-sm text-white">
        Back to suggestions
      </Link>
    </Card>
  )
}
