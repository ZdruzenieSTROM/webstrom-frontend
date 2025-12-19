import {parseFilenameFromUrl} from '@/utils/parseFilenameFromUrl'

export const getExistingFile = (
  originalUrl: string | undefined,
  recordId: number | string,
  reformatUrlFromId?: (recordId: number) => string,
  subtitle?: string,
) => {
  let title = originalUrl && parseFilenameFromUrl(originalUrl)
  const src = reformatUrlFromId ? reformatUrlFromId(Number(recordId)) : originalUrl

  if (title && src) {
    if (subtitle) {
      title = `${title} (${subtitle})`
    }

    return {src, title}
  }

  return undefined
}
