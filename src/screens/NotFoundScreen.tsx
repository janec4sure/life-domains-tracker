import { Link } from 'react-router-dom'

export function NotFoundScreen() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <h1 className="text-xl font-semibold text-stone-800">Page not found</h1>
      <Link to="/" className="mt-3 inline-block rounded-xl bg-stone-800 px-3 py-2 text-sm text-white">
        Back to dashboard
      </Link>
    </div>
  )
}
