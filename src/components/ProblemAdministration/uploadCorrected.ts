import {isAxiosError} from 'axios'

import {UploadCorrectedErrorResponse, UploadCorrectedFileIssue, UploadCorrectedResponse} from '@/types/api/competition'

const isFileIssueArray = (value: unknown): value is UploadCorrectedFileIssue[] =>
  Array.isArray(value) &&
  value.every(
    (item: unknown) =>
      typeof item === 'object' &&
      item !== null &&
      'filename' in item &&
      typeof item.filename === 'string' &&
      'reason' in item &&
      typeof item.reason === 'string',
  )

const getFileIssues = (data: object, key: 'errors' | 'skipped'): UploadCorrectedFileIssue[] => {
  const value = (data as Record<string, unknown>)[key]
  return isFileIssueArray(value) ? value : []
}

export const getUploadSummary = ({uploaded, errors, skipped}: UploadCorrectedResponse) =>
  [
    `Nahraných opravených riešení: ${uploaded.length}.`,
    errors.length > 0 && `Neuložených pre chybu: ${errors.length}.`,
    skipped.length > 0 && `Preskočených súborov (nie sú PDF): ${skipped.length}.`,
  ]
    .filter(Boolean)
    .join('\n')

export const parseUploadCorrectedError = (error: Error | null): UploadCorrectedErrorResponse | null => {
  if (!error) return null
  const data = isAxiosError(error) ? (error.response?.data as unknown) : undefined
  if (typeof data !== 'object' || data === null) {
    return {detail: 'Nahranie ZIPu zlyhalo.', errors: [], skipped: []}
  }
  return {
    detail: 'detail' in data && typeof data.detail === 'string' ? data.detail : 'Nahranie ZIPu zlyhalo.',
    errors: getFileIssues(data, 'errors'),
    skipped: getFileIssues(data, 'skipped'),
  }
}
