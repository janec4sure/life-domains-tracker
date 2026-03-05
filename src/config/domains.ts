import { DomainDefinition, DomainId } from '../types'

export const DOMAIN_ORDER: DomainId[] = [
  'relationships',
  'health',
  'career',
  'finances',
  'growth',
  'leisure',
  'environment',
  'creativity',
]

export const DOMAINS: DomainDefinition[] = [
  {
    id: 'relationships',
    name: 'Relationships',
    weight: 20,
    factors: [
      { id: 'rel-connection', domainId: 'relationships', name: 'Connection Quality', description: 'Feeling close, supported, and understood.' },
      { id: 'rel-communication', domainId: 'relationships', name: 'Communication', description: 'Open, respectful conversations and boundaries.' },
      { id: 'rel-community', domainId: 'relationships', name: 'Community Belonging', description: 'Sense of belonging with friends or community.' },
    ],
  },
  {
    id: 'health',
    name: 'Health and Wellness',
    weight: 20,
    factors: [
      { id: 'health-sleep', domainId: 'health', name: 'Sleep and Recovery', description: 'Consistent rest and quality recovery.' },
      { id: 'health-movement', domainId: 'health', name: 'Movement', description: 'Regular exercise and physical activity.' },
      { id: 'health-energy', domainId: 'health', name: 'Energy and Nutrition', description: 'Stable energy and nourishing habits.' },
    ],
  },
  {
    id: 'career',
    name: 'Career and Purpose',
    weight: 15,
    factors: [
      { id: 'career-progress', domainId: 'career', name: 'Progress', description: 'Momentum toward meaningful goals.' },
      { id: 'career-alignment', domainId: 'career', name: 'Purpose Alignment', description: 'Work aligned with values and strengths.' },
      { id: 'career-balance', domainId: 'career', name: 'Sustainable Pace', description: 'Workload supports long-term performance.' },
    ],
  },
  {
    id: 'finances',
    name: 'Finances',
    weight: 15,
    factors: [
      { id: 'fin-safety', domainId: 'finances', name: 'Financial Safety', description: 'Emergency runway and stability.' },
      { id: 'fin-cashflow', domainId: 'finances', name: 'Cash Flow', description: 'Healthy spending and saving rhythm.' },
      { id: 'fin-planning', domainId: 'finances', name: 'Planning Confidence', description: 'Clarity in goals, tracking, and decisions.' },
    ],
  },
  {
    id: 'growth',
    name: 'Personal Growth',
    weight: 10,
    factors: [
      { id: 'growth-learning', domainId: 'growth', name: 'Learning', description: 'Deliberate learning and reflection.' },
      { id: 'growth-mindset', domainId: 'growth', name: 'Mindset', description: 'Resilience and adaptive self-talk.' },
      { id: 'growth-discipline', domainId: 'growth', name: 'Habits and Discipline', description: 'Consistent habits supporting growth.' },
    ],
  },
  {
    id: 'leisure',
    name: 'Leisure and Fun',
    weight: 10,
    factors: [
      { id: 'leis-play', domainId: 'leisure', name: 'Play', description: 'Regular joy, hobbies, and laughter.' },
      { id: 'leis-rest', domainId: 'leisure', name: 'Restoration', description: 'Real downtime without guilt.' },
      { id: 'leis-adventure', domainId: 'leisure', name: 'Adventure', description: 'Novel experiences and exploration.' },
    ],
  },
  {
    id: 'environment',
    name: 'Environment',
    weight: 5,
    factors: [
      { id: 'env-home', domainId: 'environment', name: 'Home Clarity', description: 'Physical spaces that feel calm and usable.' },
      { id: 'env-digital', domainId: 'environment', name: 'Digital Hygiene', description: 'Low-friction digital environment.' },
      { id: 'env-routine', domainId: 'environment', name: 'Daily Systems', description: 'Reliable systems and routines.' },
    ],
  },
  {
    id: 'creativity',
    name: 'Creativity and Expression',
    weight: 5,
    factors: [
      { id: 'creat-output', domainId: 'creativity', name: 'Creative Output', description: 'Shipping creative work consistently.' },
      { id: 'creat-expression', domainId: 'creativity', name: 'Self Expression', description: 'Authentic voice in daily life.' },
      { id: 'creat-inspiration', domainId: 'creativity', name: 'Inspiration Intake', description: 'Fuel from art, ideas, and curiosity.' },
    ],
  },
]

export const FACTOR_INDEX = DOMAINS.flatMap((domain) => domain.factors)

export const FACTOR_TO_DOMAIN = Object.fromEntries(
  FACTOR_INDEX.map((factor) => [factor.id, factor.domainId]),
) as Record<string, DomainId>

export const DOMAIN_LABELS = Object.fromEntries(
  DOMAINS.map((domain) => [domain.id, domain.name]),
) as Record<DomainId, string>
