import {DateTime, DurationLike} from 'luxon'

const TIMEZONE = 'Europe/Bratislava'

// Shift an ISO UTC (or Bratislava-local) timestamp by a luxon duration, preserving Bratislava wall-clock semantics
// (e.g. "+1 year" moves Sep 18 14:00 Bratislava to Sep 18 14:00 Bratislava the next year, even across DST boundaries).
export const shiftIso = (iso: string, duration: DurationLike): string => {
  const zone = iso.endsWith('Z') ? 'utc' : TIMEZONE
  return DateTime.fromISO(iso, {zone}).setZone(TIMEZONE).plus(duration).toUTC().toISO() ?? iso
}

// "2024/2025" -> "2025/2026". Returns the input unchanged if it isn't two slash-separated integers.
export const bumpSchoolYear = (schoolYear: string): string => {
  const [a, b] = schoolYear.split('/')
  const aNum = Number(a)
  const bNum = Number(b)
  if (!Number.isFinite(aNum) || !Number.isFinite(bNum)) return schoolYear
  return `${aNum + 1}/${bNum + 1}`
}
