import {describe, expect, it} from 'vitest'

import {bumpSchoolYear, shiftIso} from './semesterPrefillHelpers'

describe(shiftIso, () => {
  it('shifts a UTC-ISO timestamp by one year preserving Bratislava wall-clock', () => {
    // 2025-09-18 14:00 Bratislava (CEST, UTC+2) -> 12:00:00Z
    // +1 year -> 2026-09-18 14:00 Bratislava (still CEST) -> 12:00:00Z
    expect(shiftIso('2025-09-18T12:00:00.000Z', {years: 1})).toBe('2026-09-18T12:00:00.000Z')
  })

  it('shifts across a DST boundary preserving local wall-clock', () => {
    // 2025-02-16 22:00 Bratislava (CET, UTC+1) -> 21:00:00Z
    // +1 year -> 2026-02-16 22:00 Bratislava (still CET) -> 21:00:00Z
    expect(shiftIso('2025-02-16T21:00:00.000Z', {years: 1})).toBe('2026-02-16T21:00:00.000Z')
  })

  it('shifts by days', () => {
    expect(shiftIso('2027-01-15T19:00:00.000Z', {days: 14})).toBe('2027-01-29T19:00:00.000Z')
  })

  it('accepts a Bratislava-local ISO without Z', () => {
    // 2025-09-18T14:00 interpreted as Bratislava -> next year same wall-clock -> 2026-09-18 12:00Z
    expect(shiftIso('2025-09-18T14:00', {years: 1})).toBe('2026-09-18T12:00:00.000Z')
  })
})

describe(bumpSchoolYear, () => {
  it('increments both halves', () => {
    expect(bumpSchoolYear('2024/2025')).toBe('2025/2026')
  })

  it('handles crossing a decade', () => {
    expect(bumpSchoolYear('2009/2010')).toBe('2010/2011')
  })

  it('returns the input unchanged for non-numeric input', () => {
    expect(bumpSchoolYear('nejaky/text')).toBe('nejaky/text')
  })

  it('returns the input unchanged when missing a slash', () => {
    expect(bumpSchoolYear('2024-2025')).toBe('2024-2025')
  })
})
