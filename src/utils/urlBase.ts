export const composeUrlBase = (protocol: string, hostname: string, port: string) =>
  `${protocol}://${hostname}${port ? `:${port}` : ''}`

/** Server-side funkcia - tieto env vars frontend nevidi. */
export const getBackendServerUrl = () =>
  composeUrlBase(process.env.BE_PROTOCOL as string, process.env.BE_HOSTNAME as string, process.env.BE_PORT as string)
