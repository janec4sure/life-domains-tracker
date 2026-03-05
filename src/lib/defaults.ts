import { DOMAINS, FACTOR_INDEX } from '../config/domains'
import { DomainId } from '../types'

export function defaultDomainScores(value = 5): Record<DomainId, number> {
  return Object.fromEntries(DOMAINS.map((domain) => [domain.id, value])) as Record<DomainId, number>
}

export function defaultFactorRatings(value = 5): Record<string, number> {
  return Object.fromEntries(FACTOR_INDEX.map((factor) => [factor.id, value]))
}
