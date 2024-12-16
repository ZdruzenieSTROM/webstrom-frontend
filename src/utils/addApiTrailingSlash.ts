/**
 * BE Django server ocakava trailing slash (aj pred query params).
 *
 * @param pathname local URL without query params. e.g. `/api/cms/post`
 * @returns local URL with trailing slash. e.g. `/api/cms/post/`
 *  */
export const addApiTrailingSlash = (pathname: string) => {
  if (!pathname.endsWith('/')) return `${pathname}/`

  return pathname
}
