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
      { id: 'relationships-family-connection', domainId: 'relationships', name: 'Family connection', description: 'Quality of closeness and support in family relationships.' },
      { id: 'relationships-friendships', domainId: 'relationships', name: 'Friendships', description: 'Consistency and depth of supportive friendships.' },
      { id: 'relationships-romantic-intimacy', domainId: 'relationships', name: 'Romantic / intimacy', description: 'Connection, care, and closeness in romantic life.' },
      { id: 'relationships-community-belonging', domainId: 'relationships', name: 'Community / belonging', description: 'Sense of belonging in groups and community spaces.' },
    ],
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    weight: 20,
    factors: [
      { id: 'health-physical-activity', domainId: 'health', name: 'Physical activity', description: 'Regular movement and exercise habits.' },
      { id: 'health-nutrition', domainId: 'health', name: 'Nutrition', description: 'Quality and consistency of nourishment.' },
      { id: 'health-sleep-quality', domainId: 'health', name: 'Sleep quality', description: 'Restfulness and consistency of sleep.' },
      { id: 'health-mental-well-being', domainId: 'health', name: 'Mental well-being', description: 'Emotional balance and mental resilience.' },
    ],
  },
  {
    id: 'career',
    name: 'Career & Purpose',
    weight: 15,
    factors: [
      { id: 'career-job-work-satisfaction', domainId: 'career', name: 'Job / work satisfaction', description: 'Satisfaction and alignment in day-to-day work.' },
      { id: 'career-personal-projects', domainId: 'career', name: 'Personal projects', description: 'Progress on meaningful side or personal projects.' },
      { id: 'career-skill-development', domainId: 'career', name: 'Skill development', description: 'Growth and sharpening of important skills.' },
      { id: 'career-sense-of-purpose', domainId: 'career', name: 'Sense of purpose', description: 'Clarity that work connects to bigger meaning.' },
    ],
  },
  {
    id: 'finances',
    name: 'Finances',
    weight: 15,
    factors: [
      { id: 'finances-income-stability', domainId: 'finances', name: 'Income stability', description: 'Consistency and predictability of income.' },
      { id: 'finances-savings-investments', domainId: 'finances', name: 'Savings & investments', description: 'Progress in savings and long-term financial assets.' },
      { id: 'finances-spending-habits', domainId: 'finances', name: 'Spending habits', description: 'Intentionality and control of spending behavior.' },
      { id: 'finances-financial-goals-clarity', domainId: 'finances', name: 'Financial goals / clarity', description: 'Clarity of financial goals and plans.' },
    ],
  },
  {
    id: 'growth',
    name: 'Personal Growth',
    weight: 10,
    factors: [
      { id: 'growth-learning-education', domainId: 'growth', name: 'Learning & education', description: 'Ongoing learning and educational development.' },
      { id: 'growth-self-reflection', domainId: 'growth', name: 'Self-reflection', description: 'Intentional reflection and self-awareness habits.' },
      { id: 'growth-resilience-stress-coping', domainId: 'growth', name: 'Resilience / stress coping', description: 'Ability to manage stress and recover from setbacks.' },
      { id: 'growth-trying-new-things', domainId: 'growth', name: 'Trying new things', description: 'Willingness to explore and experiment with new experiences.' },
    ],
  },
  {
    id: 'leisure',
    name: 'Leisure & Fun',
    weight: 10,
    factors: [
      { id: 'leisure-hobbies', domainId: 'leisure', name: 'Hobbies', description: 'Engagement in enjoyable personal interests.' },
      { id: 'leisure-entertainment', domainId: 'leisure', name: 'Entertainment', description: 'Healthy enjoyment and recreational downtime.' },
      { id: 'leisure-social-outings', domainId: 'leisure', name: 'Social outings', description: 'Participation in social activities and outings.' },
      { id: 'leisure-travel-exploration', domainId: 'leisure', name: 'Travel / exploration', description: 'Variety, discovery, and exploration experiences.' },
    ],
  },
  {
    id: 'environment',
    name: 'Environment',
    weight: 5,
    factors: [
      { id: 'environment-home-comfort', domainId: 'environment', name: 'Home comfort', description: 'Comfort and supportiveness of living environment.' },
      { id: 'environment-workspace-quality', domainId: 'environment', name: 'Workspace quality', description: 'Quality and effectiveness of workspace setup.' },
      { id: 'environment-connection-to-nature', domainId: 'environment', name: 'Connection to nature', description: 'Regular exposure and relationship with nature.' },
      { id: 'environment-organization-clutter', domainId: 'environment', name: 'Organization / clutter', description: 'Order, clarity, and manageable clutter levels.' },
    ],
  },
  {
    id: 'creativity',
    name: 'Creativity & Expression',
    weight: 5,
    factors: [
      { id: 'creativity-art-music-engagement', domainId: 'creativity', name: 'Art/music engagement', description: 'Connection with art, music, and creative inspiration.' },
      { id: 'creativity-creating-writing-making', domainId: 'creativity', name: 'Creating (writing/making/etc.)', description: 'Active creation through writing, making, or building.' },
      { id: 'creativity-personal-style-self-expression', domainId: 'creativity', name: 'Personal style / self-expression', description: 'Authentic expression through style and identity.' },
      { id: 'creativity-sharing-ideas', domainId: 'creativity', name: 'Sharing ideas', description: 'Communicating ideas and perspectives with others.' },
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
