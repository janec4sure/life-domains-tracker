import Dexie, { Table } from 'dexie'
import {
  DailyCheckIn,
  IdealDayEntry,
  PinnedSuggestion,
  Profile,
  UserSettings,
  WeeklyReview,
} from '../types'

class LifeDomainsDB extends Dexie {
  profile!: Table<Profile, number>
  dailyCheckIns!: Table<DailyCheckIn, number>
  weeklyReviews!: Table<WeeklyReview, number>
  idealDays!: Table<IdealDayEntry, number>
  pinnedSuggestions!: Table<PinnedSuggestion, number>
  settings!: Table<UserSettings, number>

  constructor() {
    super('lifeDomainsTrackerDB')
    this.version(1).stores({
      profile: '++id, createdAt',
      dailyCheckIns: '++id, date',
      weeklyReviews: '++id, weekStart',
      idealDays: '++id, createdAt',
      pinnedSuggestions: '++id, suggestionId, status, pinnedAt',
      settings: '++id',
    })
  }
}

export const db = new LifeDomainsDB()

export async function ensureDefaults() {
  const settingCount = await db.settings.count()
  if (settingCount === 0) {
    await db.settings.add({ foundationalThreshold: 4 })
  }
}

export async function getSettings(): Promise<UserSettings> {
  await ensureDefaults()
  const settings = await db.settings.toCollection().first()
  return settings ?? { foundationalThreshold: 4 }
}

export async function clearAllData() {
  await db.transaction(
    'rw',
    [db.profile, db.dailyCheckIns, db.weeklyReviews, db.idealDays, db.pinnedSuggestions, db.settings],
    async () => {
      await db.profile.clear()
      await db.dailyCheckIns.clear()
      await db.weeklyReviews.clear()
      await db.idealDays.clear()
      await db.pinnedSuggestions.clear()
      await db.settings.clear()
    },
  )
  await ensureDefaults()
}
