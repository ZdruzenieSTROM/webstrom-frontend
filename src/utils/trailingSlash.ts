/**
 * BE Django server ocakava trailing slash (aj pred query params).
 *
 * @param pathname local URL without query params. e.g. `/cms/post`
 * @returns local URL with trailing slash. e.g. `/cms/post/`
 *  */
export const addTrailingSlash = (pathname: string) => {
  if (!pathname.endsWith('/')) return `${pathname}/`

  return pathname
}

export const removeTrailingSlash = (pathname: string) => {
  // pre root route `/` nemozeme odstranit slash (infinite redirect)
  if (pathname === '/') return pathname

  if (pathname.endsWith('/')) return pathname.slice(0, -1)

  return pathname
}
