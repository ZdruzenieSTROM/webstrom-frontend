import englishMessages from 'ra-language-english'
import {describe, expect, it} from 'vitest'

import {flattenMessages} from './flattenMessages'
import {raSk} from './ra_sk'

const en = flattenMessages(englishMessages)
const sk = flattenMessages(raSk)

const placeholders = (text: string) => new Set(text.match(/%{\w+}/g))

// Kluce, ktore RA 5.15 v kode prekladá, ale v ra-language-english chybaju (PaginationActions, aria-label pri "...")
const EXTRA_KEYS = new Set(['ra.navigation.start-ellipsis', 'ra.navigation.end-ellipsis'])

// Placeholdery, ktore RA posiela navyse oproti anglickemu textu: sort_by dostane `field` aj `field_lower_first`
// (`field_lower_first` by z "URL" spravil "uRL")
const EXTRA_PLACEHOLDERS: Record<string, string[]> = {'ra.sort.sort_by': ['%{field}']}

// Pri upgrade react-adminu tento test vypise nove alebo zrusene kluce `ra.*`, ktore treba prelozit.
describe('raSk', () => {
  it('has exactly the keys of ra-language-english', () => {
    const missing = Object.keys(en).filter((key) => !Object.hasOwn(sk, key))
    const extra = Object.keys(sk).filter((key) => !Object.hasOwn(en, key) && !EXTRA_KEYS.has(key))
    expect({missing, extra}).toStrictEqual({missing: [], extra: []})
  })

  it('uses only placeholders that the English text has', () => {
    const wrong = Object.keys(sk)
      .filter((key) => Object.hasOwn(en, key))
      .flatMap((key) => {
        const allowed = new Set([...placeholders(en[key]), ...(EXTRA_PLACEHOLDERS[key] ?? [])])
        return [...placeholders(sk[key])].filter((p) => !allowed.has(p)).map((p) => `${key}: ${p}`)
      })
    expect(wrong).toStrictEqual([])
  })

  it('has 3 plural forms (1 |||| 2-4 |||| 0, 5+) exactly where English has plural forms', () => {
    const wrong = Object.keys(sk).filter((key) => {
      const enPlural = en[key]?.includes('||||') ?? false
      const skForms = sk[key].split('||||').length
      return enPlural ? skForms !== 3 : skForms !== 1
    })
    expect(wrong).toStrictEqual([])
  })
})
