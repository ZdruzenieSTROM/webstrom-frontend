import {describe, expect, it} from 'vitest'

import {validateDateAfter} from './validateDateAfter'

describe('validateDateAfter', () => {
  const validate = validateDateAfter('start')

  it('passes when end is after start', () => {
    expect(validate('2026-01-02T00:00', {start: '2026-01-01T00:00'}, {})).toBeUndefined()
  })

  it('fails when end is before or equal to start', () => {
    expect(validate('2026-01-01T00:00', {start: '2026-01-02T00:00'}, {})).toBe('Koniec musí byť neskôr ako začiatok.')
    expect(validate('2026-01-01T00:00', {start: '2026-01-01T00:00'}, {})).toBe('Koniec musí byť neskôr ako začiatok.')
  })

  it('skips validation when a value is missing or invalid', () => {
    expect(validate(undefined, {start: '2026-01-01T00:00'}, {})).toBeUndefined()
    expect(validate('2026-01-01T00:00', {}, {})).toBeUndefined()
    expect(validate('not a date', {start: '2026-01-01T00:00'}, {})).toBeUndefined()
  })

  it('supports nested start source and custom message', () => {
    const nested = validateDateAfter('registration_link.start', 'Zlý dátum')
    const values = {registration_link: {start: '2026-01-02T00:00'}}
    expect(nested('2026-01-01T00:00', values, {})).toBe('Zlý dátum')
    expect(nested('2026-01-03T00:00', values, {})).toBeUndefined()
  })
})
