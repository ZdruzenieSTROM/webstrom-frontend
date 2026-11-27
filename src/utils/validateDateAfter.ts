import {Validator} from 'react-admin'

const getByPath = (values: unknown, path: string): unknown => {
  let current = values
  for (const key of path.split('.')) {
    current = (current as Record<string, unknown> | null | undefined)?.[key]
  }
  return current
}

// RA field validator pre "end" input - overi, ze hodnota je neskor ako datum v `startSource`.
// `startSource` moze byt nested (napr. 'registration_link.start').
// Ak niektora hodnota chyba, nevalidujeme (to riesi `required()`).
export const validateDateAfter =
  (startSource: string, message = 'Koniec musí byť neskôr ako začiatok.'): Validator =>
  (value, allValues) => {
    const start = getByPath(allValues, startSource)
    if (!value || !start) return undefined

    const startMs = Date.parse(start as string)
    const endMs = Date.parse(value)
    if (Number.isNaN(startMs) || Number.isNaN(endMs)) return undefined

    return endMs > startMs ? undefined : message
  }
