import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/daily-check-in', label: 'Today' },
  { to: '/weekly-review', label: 'Weekly reflection' },
  { to: '/ideal-day', label: 'Ideal Day' },
  { to: '/suggestions', label: 'Focus actions' },
  { to: '/analytics', label: 'Insights' },
  { to: '/settings', label: 'Settings' },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#2C2C2C]">
      <header className="sticky top-0 z-20 border-b border-[#E6E8E5] bg-[#F7F7F5]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="text-lg font-semibold tracking-tight text-[#2C2C2C]">
            Life Domains Tracker
          </NavLink>
          <NavLink
            to="/onboarding"
            className="rounded-full bg-[#E9F1EF] px-3 py-1 text-sm text-[#3F6F68]"
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
                  isActive ? 'bg-stone-800 text-stone-50' : 'bg-stone-200 text-[#2C2C2C]'
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
