import { ReactNode } from 'react'

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#E4E6E2] bg-white p-5 shadow-[0_4px_18px_rgba(44,44,44,0.05)]">
      {title ? <h2 className="mb-3 text-base font-semibold text-[#2C2C2C]">{title}</h2> : null}
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
      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#DCE6E3]"
    />
  )
}
