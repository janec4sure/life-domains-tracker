import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/daily-check-in', label: 'Daily' },
  { to: '/weekly-review', label: 'Weekly' },
  { to: '/ideal-day', label: 'Ideal Day' },
  { to: '/suggestions', label: 'Suggestions' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-800">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-stone-50/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="text-lg font-semibold tracking-tight text-stone-700">
            Life Domains Tracker
          </NavLink>
          <NavLink
            to="/onboarding"
            className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700"
          >
            Onboarding
          </NavLink>
        </div>
        <nav className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 pb-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1 text-sm ${
                  isActive ? 'bg-stone-800 text-stone-50' : 'bg-stone-200 text-stone-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-5">
        <Outlet />
      </main>
    </div>
  )
}
