import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, RatingInput } from '../components/ui'
import { db, ensureDefaults } from '../lib/db'

export function OnboardingScreen() {
  const [displayName, setDisplayName] = useState('')
  const [threshold, setThreshold] = useState(4)
  const navigate = useNavigate()

  useEffect(() => {
    void (async () => {
      await ensureDefaults()
      const profile = await db.profile.toCollection().first()
      const settings = await db.settings.toCollection().first()
      if (profile?.displayName) setDisplayName(profile.displayName)
      if (settings?.foundationalThreshold) setThreshold(settings.foundationalThreshold)
    })()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const existing = await db.profile.toCollection().first()
    if (existing?.id) {
      await db.profile.update(existing.id, {
        displayName: displayName.trim() || 'You',
        onboardingCompleted: true,
      })
    } else {
      await db.profile.add({
        createdAt: new Date().toISOString(),
        displayName: displayName.trim() || 'You',
        onboardingCompleted: true,
      })
    }

    const settings = await db.settings.toCollection().first()
    if (settings?.id) {
      await db.settings.update(settings.id, { foundationalThreshold: threshold })
    }

    navigate('/')
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-4">
      <Card title="Onboarding">
        <p className="mb-4 text-sm text-stone-600">
          Set your profile and foundational threshold. All data stays local in your browser.
        </p>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1">
            <span className="text-sm">Display name</span>
            <input
              className="rounded-xl border border-stone-300 px-3 py-2"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Jane"
            />
          </label>

          <div className="grid gap-1">
            <label htmlFor="threshold" className="text-sm">
              Foundational threshold (default 4): {threshold}
            </label>
            <RatingInput id="threshold" value={threshold} onChange={setThreshold} />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-stone-800 px-4 py-2 text-sm font-medium text-white"
          >
            Save and continue
          </button>
        </form>
      </Card>
    </div>
  )
}
