import {AxiosError, AxiosHeaders} from 'axios'
import {describe, expect, it} from 'vitest'

import {composeToastMessage, parseError} from './parseError'

// AxiosError s nastavenou response (nepotrebujeme realny request, staci aby `isAxiosError` vratil true
// a data/status boli citatelne).
const axiosErrorWith = (status: number | undefined, data: unknown): AxiosError => {
  const err = new AxiosError('test error')
  if (status !== undefined) {
    err.response = {status, data, statusText: '', headers: {}, config: {headers: new AxiosHeaders()}}
  }
  return err
}

describe(parseError, () => {
  it('flat field error → single inline entry, empty top-level message', () => {
    const err = axiosErrorWith(400, {school_year: ['Missing slash.']})

    expect(parseError(err)).toStrictEqual({
      message: '',
      errors: {school_year: 'Missing slash.'},
    })
  })

  it('nested field error (DRF nested serializer) → dot-path key', () => {
    const err = axiosErrorWith(400, {registration_link: {url: ['Zadajte platnú URL adresu.']}})

    expect(parseError(err)).toStrictEqual({
      message: '',
      errors: {'registration_link.url': 'Zadajte platnú URL adresu.'},
    })
  })

  it('array-of-objects error (DRF list serializer) → indexed dot-path', () => {
    const err = axiosErrorWith(400, {galleries: [{}, {name: ['Required.']}]})

    expect(parseError(err)).toStrictEqual({
      message: '',
      errors: {'galleries.1.name': 'Required.'},
    })
  })

  it('multiple messages on one field → joined with newline', () => {
    const err = axiosErrorWith(400, {password: ['Too short.', 'Must contain a digit.']})

    expect(parseError(err).errors).toStrictEqual({password: 'Too short.\nMust contain a digit.'})
  })

  it('top-level `detail` → becomes message, no field errors', () => {
    const err = axiosErrorWith(403, {detail: 'Authentication credentials were not provided.'})

    expect(parseError(err)).toStrictEqual({
      message: 'Authentication credentials were not provided.',
      errors: {},
    })
  })

  it('top-level `non_field_errors` → becomes message, joined with newline', () => {
    const err = axiosErrorWith(400, {non_field_errors: ['Začiatok musí byť pred koncom.', 'Dátum neplatný.']})

    expect(parseError(err)).toStrictEqual({
      message: 'Začiatok musí byť pred koncom.\nDátum neplatný.',
      errors: {},
    })
  })

  it('`non_field_errors` + field errors → both surface (message + inline)', () => {
    const err = axiosErrorWith(400, {
      non_field_errors: ['Kombinácia neplatná.'],
      school_year: ['Missing slash.'],
    })

    expect(parseError(err)).toStrictEqual({
      message: 'Kombinácia neplatná.',
      errors: {school_year: 'Missing slash.'},
    })
  })

  it('500 with no parseable body → fallback with status in message', () => {
    const err = axiosErrorWith(500, '<html>Internal Server Error</html>')

    expect(parseError(err)).toStrictEqual({
      message: 'Nastala neznáma chyba (HTTP 500)',
      errors: {},
    })
  })

  it('502 with null body → fallback with status', () => {
    const err = axiosErrorWith(502, null)

    expect(parseError(err)).toStrictEqual({
      message: 'Nastala neznáma chyba (HTTP 502)',
      errors: {},
    })
  })

  it('network error (no response) → plain fallback, no status suffix', () => {
    const err = axiosErrorWith(undefined, undefined)

    expect(parseError(err)).toStrictEqual({
      message: 'Nastala neznáma chyba',
      errors: {},
    })
  })

  it('non-axios error → plain fallback', () => {
    expect(parseError(new Error('oops'))).toStrictEqual({
      message: 'Nastala neznáma chyba',
      errors: {},
    })
  })

  it('empty 400 body → fallback with status', () => {
    const err = axiosErrorWith(400, {})

    expect(parseError(err)).toStrictEqual({
      message: 'Nastala neznáma chyba (HTTP 400)',
      errors: {},
    })
  })
})

describe(composeToastMessage, () => {
  it('only top-level message → shown as-is, no bullets', () => {
    expect(composeToastMessage({message: 'Nemáš oprávnenie.', errors: {}})).toBe('Nemáš oprávnenie.')
  })

  it('only field errors → each on a bulleted line prefixed with its dot-path', () => {
    expect(
      composeToastMessage({
        message: '',
        errors: {
          'registration_link.url': 'Zadajte platnú URL adresu.',
          school_year: 'Missing slash.',
        },
      }),
    ).toBe('• registration_link.url: Zadajte platnú URL adresu.\n• school_year: Missing slash.')
  })

  it('top-level + field errors → top-level on top (no bullet, no path), fields bulleted below', () => {
    expect(
      composeToastMessage({
        message: 'Kombinácia neplatná.',
        errors: {school_year: 'Missing slash.'},
      }),
    ).toBe('Kombinácia neplatná.\n• school_year: Missing slash.')
  })

  it('multi-line top-level message (joined non_field_errors) preserved before bullets', () => {
    expect(
      composeToastMessage({
        message: 'Chyba 1.\nChyba 2.',
        errors: {foo: 'bar'},
      }),
    ).toBe('Chyba 1.\nChyba 2.\n• foo: bar')
  })

  it('completely empty → safe fallback', () => {
    expect(composeToastMessage({message: '', errors: {}})).toBe('Nastala neznáma chyba')
  })
})
