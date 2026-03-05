# PRODUCT_SPEC

## Product

Life Domains Tracker PWA

## Scope

Build-from-scratch personal life tracking app with local-only data and explainable scoring.

## Architecture

- Frontend: React + TypeScript + Vite
- Styling: Tailwind
- Storage: IndexedDB via Dexie
- Charts: Recharts
- Dates: date-fns
- Validation: zod
- Testing: Vitest
- PWA: vite-plugin-pwa, installable, offline-first

## Data Model

- `Profile`: onboarding completion + display name
- `UserSettings`: foundational threshold (default `4`)
- `DailyCheckIn`: date, overall score, contributor tags, optional quick ratings
- `WeeklyReview`: factor ratings + derived domain scores
- `IdealDayEntry`: scenario choices + factor targets
- `PinnedSuggestion`: persisted until completed/removed

## Domains and Weights

1. Relationships - 20
2. Health and Wellness - 20
3. Career and Purpose - 15
4. Finances - 15
5. Personal Growth - 10
6. Leisure and Fun - 10
7. Environment - 5
8. Creativity and Expression - 5

All ratings are 1-10.

## Scoring

1. Weekly factor ratings are averaged into domain scores.
2. Weighted score uses domain weights.
3. Foundational cap checks `Health` and `Finances`.
4. If `min(Health, Finances) < threshold`, apply cap:
   - `deficitRatio = (threshold - foundationalMin) / threshold`
   - `cap = 10 - deficitRatio * (10 - threshold)`
5. Final score: `min(rawWeightedScore, cap)`.
6. UI shows human-readable explanation of cap state.

## Core Screens

- Onboarding
- Home dashboard (simple)
- Daily check-in
- Weekly review
- Ideal day
- Suggestions
- Pinned suggestion detail
- Analytics (deeper trends)
- Settings

## Suggestions

- Pool is predefined in code and local.
- Every factor has >=10 suggestions with:
  - `title`
  - `description`
  - `factorId`
  - `impact`
- Selection constraints:
  - max 5 total
  - up to 3 ideal-gap driven
  - up to 2 foundational-driven
- Pinning persists until complete/remove.
- Regenerate affects only unpinned suggestions.

## Privacy

- No authentication.
- No backend.
- No cloud sync.
- All data is local browser storage only.

## Data Controls

- CSV export
- Delete all data

## Tests

- Scoring logic (cap on/off behavior)
- Suggestion selection constraints (5 max, 3/2 category caps, uniqueness)
