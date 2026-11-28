import polyglotI18nProvider from 'ra-i18n-polyglot'
import {I18nProvider} from 'react-admin'

import {flattenMessages} from './translations/flattenMessages'
import {sk_SK} from './translations/sk_SK'

const baseI18nProvider = polyglotI18nProvider(() => sk_SK, 'sk', [{locale: 'sk', name: 'Slovak (sk_SK)'}])

// Kluce, pri ktorych chceme vediet, ze chybaju. Ostatne `resources.<r>.*` kluce (napr. `notifications.*`,
// `message.*`, `forcedCaseName`) react-admin skusa len volitelne s vlastnym fallbackom.
const CHECKED_KEY = /^(ra|content|controls)\.|^resources\.[^.]+\.(name|fields\..+)$/

// Len pre vyvoj: react-admin pri chybajucom kluci casto potichu pouzije anglicky fallback (`_`),
// preto chybajuci kluc vypiseme do konzoly (kazdy iba raz).
const withMissingKeyLogger = (provider: I18nProvider): I18nProvider => {
  const knownKeys = new Set(Object.keys(flattenMessages(sk_SK)))
  const reportedKeys = new Set<string>()
  return {
    ...provider,
    translate: (key, options) => {
      if (CHECKED_KEY.test(key) && !knownKeys.has(key) && !reportedKeys.has(key)) {
        reportedKeys.add(key)
        // eslint-disable-next-line no-console
        console.warn('[i18n] missing key', key)
      }
      return provider.translate(key, options)
    },
  }
}

export const myI18nProvider =
  process.env.NODE_ENV === 'development' ? withMissingKeyLogger(baseI18nProvider) : baseI18nProvider
