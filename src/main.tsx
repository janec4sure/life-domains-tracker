import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { AppLayout } from './layout/AppLayout'
import { AnalyticsScreen } from './screens/AnalyticsScreen'
import { DailyCheckInScreen } from './screens/DailyCheckInScreen'
import { HomeDashboardScreen } from './screens/HomeDashboardScreen'
import { IdealDayScreen } from './screens/IdealDayScreen'
import { NotFoundScreen } from './screens/NotFoundScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { PinnedSuggestionScreen } from './screens/PinnedSuggestionScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { SuggestionsScreen } from './screens/SuggestionsScreen'
import { WeeklyReviewScreen } from './screens/WeeklyReviewScreen'
import { ensureDefaults } from './lib/db'
import './index.css'

registerSW({ immediate: true })
void ensureDefaults()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeDashboardScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/daily-check-in" element={<DailyCheckInScreen />} />
          <Route path="/weekly-review" element={<WeeklyReviewScreen />} />
          <Route path="/ideal-day" element={<IdealDayScreen />} />
          <Route path="/suggestions" element={<SuggestionsScreen />} />
          <Route path="/pinned/:id" element={<PinnedSuggestionScreen />} />
          <Route path="/analytics" element={<AnalyticsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
