import { FACTOR_INDEX } from './domains'
import { Suggestion } from '../types'

const BLUEPRINTS = [
  {
    title: '10-Minute Focus Block',
    description: 'Schedule one uninterrupted 10-minute block for this factor today.',
    impact: 2,
  },
  {
    title: 'Tiny Habit Trigger',
    description: 'Attach one micro-action to an existing daily routine.',
    impact: 2,
  },
  {
    title: 'Environment Nudge',
    description: 'Adjust your environment to reduce friction for this factor.',
    impact: 3,
  },
  {
    title: 'Calendar Anchor',
    description: 'Reserve a recurring weekly time slot dedicated to this factor.',
    impact: 4,
  },
  {
    title: 'Accountability Check',
    description: 'Share one clear commitment with a trusted person.',
    impact: 3,
  },
  {
    title: 'Progress Snapshot',
    description: 'Track a before/after metric to make progress visible.',
    impact: 2,
  },
  {
    title: 'Remove One Obstacle',
    description: 'Identify and remove the single biggest blocker this week.',
    impact: 4,
  },
  {
    title: 'Weekend Reset',
    description: 'Do a 30-minute reset session to restore this area.',
    impact: 3,
  },
  {
    title: 'Boundary Upgrade',
    description: 'Set one explicit boundary protecting time or energy here.',
    impact: 4,
  },
  {
    title: 'Reflect and Iterate',
    description: 'Review what worked this week and adjust your next action.',
    impact: 2,
  },
] as const

export const SUGGESTION_POOL: Suggestion[] = FACTOR_INDEX.flatMap((factor) =>
  BLUEPRINTS.map((blueprint, idx) => ({
    id: `${factor.id}-s${idx + 1}`,
    factorId: factor.id,
    title: `${factor.name}: ${blueprint.title}`,
    description: `${blueprint.description} Focus area: ${factor.description}`,
    impact: blueprint.impact,
    category: 'ideal-gap',
  })),
)

export const SUGGESTIONS_BY_FACTOR = SUGGESTION_POOL.reduce<Record<string, Suggestion[]>>(
  (acc, suggestion) => {
    const list = acc[suggestion.factorId] ?? []
    list.push(suggestion)
    acc[suggestion.factorId] = list
    return acc
  },
  {},
)
