import {DateTime} from 'luxon'

const TIMEZONE = 'Europe/Bratislava'

// BE format: 2002-05-31T22:59:00Z
// HTML datetime-local input format: 2002-06-01T00:59

// RA calls `format` with the BE value (UTC, ending 'Z'), then re-calls it with the current internal value,
// so `format` must handle both shapes and return the same result.
export const dateTimeInputFormat = (value?: string) => {
  if (!value) return

  const isUTC = value.endsWith('Z')

  return DateTime.fromISO(value, {zone: isUTC ? 'utc' : TIMEZONE})
    .setZone(TIMEZONE)
    .toFormat("yyyy-MM-dd'T'HH:mm")
}

export const dateTimeInputParse = (value?: string) => {
  if (!value) return

  return DateTime.fromISO(value, {zone: TIMEZONE}).toUTC().toISO()
}
