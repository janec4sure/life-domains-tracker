# Life Domains Tracker PWA

Offline-first Progressive Web App for tracking life domain health with local-only data storage.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Dexie (IndexedDB)
- Recharts
- date-fns
- zod
- Vitest
- Vite PWA plugin

## Features

- Installable PWA with service worker and offline support.
- Local-only persistence (IndexedDB). No auth, no backend.
- Domains and weights:
  - Relationships (20)
  - Health and Wellness (20)
  - Career and Purpose (15)
  - Finances (15)
  - Personal Growth (10)
  - Leisure and Fun (10)
  - Environment (5)
  - Creativity and Expression (5)
- Ratings from 1 to 10.
- Foundational threshold logic:
  - Uses configurable threshold (default `4`).
  - Overall score is weighted by domain weights.
  - If `min(Health, Finances) < threshold`, score is capped by:
    - `cap = 10 - ((threshold - foundationalMin) / threshold) * (10 - threshold)`
  - Final score is `min(weightedScore, cap)`.
- Screens:
  - Onboarding
  - Home dashboard
  - Daily check-in
  - Weekly review
  - Ideal day
  - Suggestions
  - Pinned suggestion detail
  - Analytics
  - Settings
- Suggestions engine:
  - max 5 suggestions
  - up to 3 ideal-gap suggestions
  - up to 2 foundational suggestions
  - each factor has at least 10 predefined suggestions
- CSV export and delete-all-data controls.

## Run

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run test
npm run build
```

## Project Structure

- `src/config/*`: domains + suggestion pool definitions
- `src/lib/*`: db, scoring, suggestion selection, validation, csv export
- `src/screens/*`: app screens
- `src/test/*`: scoring and suggestion constraint tests

## Notes

- All data remains in browser IndexedDB (`lifeDomainsTrackerDB`).
- No external API calls are required for core behavior.
