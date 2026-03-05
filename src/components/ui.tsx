import { ReactNode } from 'react'

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      {title ? <h2 className="mb-3 text-base font-semibold text-stone-700">{title}</h2> : null}
      {children}
    </section>
  )
}

export function RatingInput({
  value,
  onChange,
  id,
}: {
  value: number
  onChange: (value: number) => void
  id: string
}) {
  return (
    <input
      id={id}
      type="range"
      min={1}
      max={10}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200"
    />
  )
}
