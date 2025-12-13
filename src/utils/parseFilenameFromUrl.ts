export const parseFilenameFromUrl = (url: string) => {
  const filename = url.split('/').pop()
  if (!filename) return url

  try {
    return decodeURIComponent(filename)
  } catch {
    // If decoding fails, return the original filename
    return filename
  }
}
