import { FormEvent, useEffect, useState } from 'react'
import { Card } from '../components/ui'
import { FACTOR_INDEX } from '../config/domains'
import { db } from '../lib/db'
import { defaultFactorRatings } from '../lib/defaults'
import { ScenarioChoice } from '../types'

const scenarios: { id: ScenarioChoice; label: string }[] = [
  { id: 'more', label: 'More' },
  { id: 'less', label: 'Less' },
  { id: 'just-right', label: 'Just Right' },
]

export function IdealDayScreen() {
  const [factorTargets, setFactorTargets] = useState<Record<string, number>>(defaultFactorRatings(7))
  const [scenarioChoices, setScenarioChoices] = useState<Record<string, ScenarioChoice>>(
    Object.fromEntries(FACTOR_INDEX.map((factor) => [factor.id, 'just-right'])),
  )
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void (async () => {
      const latest = await db.idealDays.orderBy('createdAt').reverse().first()
      if (latest) {
        setFactorTargets(latest.factorTargets)
        setScenarioChoices(latest.scenarioChoices)
      }
    })()
  }, [])

  async function saveIdealDay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await db.idealDays.add({
      createdAt: new Date().toISOString(),
      factorTargets,
      scenarioChoices,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function applyScenario(factorId: string, choice: ScenarioChoice) {
    setScenarioChoices((prev) => ({ ...prev, [factorId]: choice }))
    setFactorTargets((prev) => {
      const current = prev[factorId] ?? 5
      const next = choice === 'more' ? Math.min(10, current + 1) : choice === 'less' ? Math.max(1, current - 1) : current
      return { ...prev, [factorId]: next }
    })
  }

  return (
    <Card title="Ideal Day scenario cards">
      <p className="mb-4 text-sm text-stone-600">
        For each factor, pick More / Less / Just Right and tune your target score.
      </p>

      <form onSubmit={saveIdealDay} className="grid gap-3">
        {FACTOR_INDEX.map((factor) => (
          <div key={factor.id} className="rounded-xl border border-stone-200 p-3">
            <div className="mb-2">
              <p className="text-sm font-medium">{factor.name}</p>
              <p className="text-xs text-stone-500">{factor.description}</p>
            </div>
            <div className="mb-2 flex gap-2">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => applyScenario(factor.id, scenario.id)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    scenarioChoices[factor.id] === scenario.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {scenario.label}
                </button>
              ))}
            </div>
            <label className="text-xs text-stone-600">
              Target: {factorTargets[factor.id]}
              <input
                type="range"
                min={1}
                max={10}
                value={factorTargets[factor.id]}
                onChange={(event) =>
                  setFactorTargets((prev) => ({ ...prev, [factor.id]: Number(event.target.value) }))
                }
                className="mt-1 h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200"
              />
            </label>
          </div>
        ))}

        <button className="rounded-xl bg-stone-800 px-4 py-2 text-sm font-medium text-white" type="submit">
          Save ideal day
        </button>
        {saved ? <p className="text-sm text-emerald-700">Ideal day saved.</p> : null}
      </form>
    </Card>
  )
}
