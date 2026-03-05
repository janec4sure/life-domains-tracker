import { DailyCheckIn, IdealDayEntry, WeeklyReview } from '../types'

function escapeCsv(value: unknown): string {
  const text = String(value ?? '')
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replaceAll('"', '""')}"`
  }
  return text
}

export function toCsv(data: unknown[], columns: string[]): string {
  const lines = [columns.join(',')]
  for (const row of data as Record<string, unknown>[]) {
    lines.push(columns.map((col) => escapeCsv(row[col])).join(','))
  }
  return lines.join('\n')
}

export function buildExportCsv(args: {
  daily: DailyCheckIn[]
  weekly: WeeklyReview[]
  ideal: IdealDayEntry[]
}): string {
  const sections = [
    'Daily Check-ins',
    toCsv(args.daily, ['date', 'overallRating', 'contributorTags', 'quickRatings', 'notes']),
    '',
    'Weekly Reviews',
    toCsv(args.weekly, ['weekStart', 'domainScores', 'factorRatings', 'summary']),
    '',
    'Ideal Day',
    toCsv(args.ideal, ['createdAt', 'scenarioChoices', 'factorTargets']),
  ]

  return sections.join('\n')
}

export function downloadCsv(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
