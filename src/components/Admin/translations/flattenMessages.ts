// Splosti vnoreny objekt prekladov na mapu `'a.b.c' -> text`.
export const flattenMessages = (messages: object, prefix = ''): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenMessages(value, `${prefix}${key}.`))
    } else {
      result[`${prefix}${key}`] = String(value)
    }
  }
  return result
}
