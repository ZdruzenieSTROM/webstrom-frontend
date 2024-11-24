import polyglotI18nProvider from 'ra-i18n-polyglot'

import {sk_SK} from './translations/sk_SK'

export const myI18nProvider = polyglotI18nProvider(() => sk_SK, 'sk', [{locale: 'sk', name: 'Slovak (sk_SK)'}])
