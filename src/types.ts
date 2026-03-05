export type DomainId =
  | 'relationships'
  | 'health'
  | 'career'
  | 'finances'
  | 'growth'
  | 'leisure'
  | 'environment'
  | 'creativity'

export type ScenarioChoice = 'more' | 'less' | 'just-right'

export type ContributorTag =
  | 'sleep'
  | 'stress'
  | 'movement'
  | 'nutrition'
  | 'social'
  | 'focus'
  | 'money'
  | 'purpose'
  | 'rest'

export interface FactorDefinition {
  id: string
  domainId: DomainId
  name: string
  description: string
}

export interface DomainDefinition {
  id: DomainId
  name: string
  weight: number
  factors: FactorDefinition[]
}

export interface Profile {
  id?: number
  createdAt: string
  displayName: string
  onboardingCompleted: boolean
}

export interface DailyCheckIn {
  id?: number
  date: string
  overallRating: number
  contributorTags: ContributorTag[]
  quickRatings: Partial<Record<DomainId, number>>
  notes?: string
}

export interface WeeklyReview {
  id?: number
  weekStart: string
  factorRatings: Record<string, number>
  domainScores: Record<DomainId, number>
  summary?: string
}

export interface IdealDayEntry {
  id?: number
  createdAt: string
  factorTargets: Record<string, number>
  scenarioChoices: Record<string, ScenarioChoice>
}

export interface Suggestion {
  id: string
  factorId: string
  title: string
  description: string
  impact: number
  category: 'ideal-gap' | 'foundational'
}

export interface PinnedSuggestion {
  id?: number
  suggestionId: string
  pinnedAt: string
  status: 'active' | 'completed'
}

export interface UserSettings {
  id?: number
  foundationalThreshold: number
}

export interface ScoringResult {
  rawWeightedScore: number
  finalScore: number
  cap: number | null
  foundationalMin: number
  threshold: number
  domainScores: Record<DomainId, number>
}
