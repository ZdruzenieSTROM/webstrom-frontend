import {isAxiosError} from 'axios'
import {HttpError} from 'react-admin'

export interface ParsedError {
  /** Top-level message (DRF `detail` / `non_field_errors` / status-based fallback). Empty when only field errors were parsed. */
  message: string
  /** Field errors keyed by RHF dot-path (e.g. `registration_link.url`, `galleries.1.name`). */
  errors: Record<string, string>
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const joinStringArray = (value: unknown): string | null => {
  if (!Array.isArray(value)) return null
  if (!value.every((e) => typeof e === 'string')) return null
  return value.join('\n')
}

// DRF moze vratit field errors vnorene (napr. {registration_link: {url: ["..."]}}) alebo v poli
// objektov (napr. {galleries: [{}, {name: ["..."]}]}). Splostujeme na dot-path aby RHF vedel
// priradit chyby k policam.
const flattenFieldErrors = (data: unknown, prefix: string, out: Record<string, string>): void => {
  const joined = joinStringArray(data)
  if (joined !== null) {
    if (prefix) out[prefix] = joined
    return
  }

  if (isPlainObject(data)) {
    for (const [key, value] of Object.entries(data)) {
      if (!prefix && (key === 'detail' || key === 'non_field_errors')) continue
      flattenFieldErrors(value, prefix ? `${prefix}.${key}` : key, out)
    }
    return
  }

  if (Array.isArray(data)) {
    for (const [i, item] of data.entries()) {
      if (isPlainObject(item) && Object.keys(item).length > 0) {
        flattenFieldErrors(item, prefix ? `${prefix}.${i}` : String(i), out)
      }
    }
  }
}

export const parseError = (error: unknown): ParsedError => {
  const errors: Record<string, string> = {}
  const status = isAxiosError(error) ? error.response?.status : undefined

  if (isAxiosError(error) && isPlainObject(error.response?.data)) {
    const data = error.response.data
    flattenFieldErrors(data, '', errors)

    const detail = typeof data.detail === 'string' ? data.detail : ''
    const nonFieldJoined = joinStringArray(data.non_field_errors) ?? ''
    const topLevelMessage = detail || nonFieldJoined
    if (topLevelMessage) return {message: topLevelMessage, errors}
    if (Object.keys(errors).length > 0) return {message: '', errors}
  }

  const suffix = status ? ` (HTTP ${status})` : ''
  return {message: `Nastala neznáma chyba${suffix}`, errors}
}

/** Compose a user-facing toast string from a parsed error. Top-level message first (unbulleted,
 *  no path — top-level messages don't belong to any field), each field error on its own bulleted
 *  line prefixed with its dot-path so the user knows which field it refers to — important when
 *  the field is hidden, renamed, or otherwise not visibly bound to an inline error. */
export const composeToastMessage = ({message, errors}: ParsedError): string => {
  const bullets = Object.entries(errors).map(([path, m]) => `• ${path}: ${m}`)
  return [message, ...bullets].filter(Boolean).join('\n') || 'Nastala neznáma chyba'
}

export const toHttpError = (error: unknown): HttpError => {
  const parsed = parseError(error)
  const toast = composeToastMessage(parsed)
  const status = isAxiosError(error) ? (error.response?.status ?? 0) : 0
  // `root.serverError` je specialna cesta, ktoru `useNotifyIsFormInvalid` v react-admin cita pre toast
  // namiesto generickej `ra.message.invalid_form` hlasky. Takto nasa kompozovana sprava (top-level +
  // bullet per field) skonci v notifikacii aj ked RA inak nasu `message` pri form submite ignoruje.
  return new HttpError(toast, status, {errors: {...parsed.errors, root: {serverError: toast}}})
}
