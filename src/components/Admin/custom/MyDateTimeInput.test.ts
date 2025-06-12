import {describe, expect, it} from 'vitest'

import {myDateTimeInputFormat, myDateTimeInputParse} from './MyDateTimeInput'

describe(myDateTimeInputFormat, () => {
  it('should format UTC string to Bratislava local time', () => {
    expect(myDateTimeInputFormat('2023-06-01T10:00:00Z')).toBe('2023-06-01T12:00')
  })

  it('should format Bratislava local time string as itself', () => {
    expect(myDateTimeInputFormat('2023-06-01T12:00')).toBe('2023-06-01T12:00')
  })

  it('should return undefined for undefined input', () => {
    expect(myDateTimeInputFormat(undefined)).toBeUndefined()
  })
})

describe(myDateTimeInputParse, () => {
  it('should parse Bratislava local time to UTC ISO string', () => {
    expect(myDateTimeInputParse('2023-06-01T12:00')).toBe('2023-06-01T10:00:00.000Z')
  })

  it('should return undefined for undefined input', () => {
    expect(myDateTimeInputParse(undefined)).toBeUndefined()
  })
})
