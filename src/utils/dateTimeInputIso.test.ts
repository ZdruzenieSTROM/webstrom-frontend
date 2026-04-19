import {describe, expect, it} from 'vitest'

import {dateTimeInputFormat, dateTimeInputParse} from './dateTimeInputIso'

describe(dateTimeInputFormat, () => {
  it('should format UTC string to Bratislava local time', () => {
    expect(dateTimeInputFormat('2023-06-01T10:00:00Z')).toBe('2023-06-01T12:00')
  })

  it('should format Bratislava local time string as itself', () => {
    expect(dateTimeInputFormat('2023-06-01T12:00')).toBe('2023-06-01T12:00')
  })

  it('should return undefined for undefined input', () => {
    expect(dateTimeInputFormat(undefined)).toBeUndefined()
  })
})

describe(dateTimeInputParse, () => {
  it('should parse Bratislava local time to UTC ISO string', () => {
    expect(dateTimeInputParse('2023-06-01T12:00')).toBe('2023-06-01T10:00:00.000Z')
  })

  it('should return undefined for undefined input', () => {
    expect(dateTimeInputParse(undefined)).toBeUndefined()
  })
})
