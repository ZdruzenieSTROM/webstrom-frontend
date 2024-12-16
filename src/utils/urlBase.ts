export const composeUrlBase = (protocol: string, hostname: string, port: string, prefix: string) =>
  `${protocol}://${hostname}${port ? `:${port}` : ''}${prefix}`

export const getInternalBeServerUrl = () =>
  composeUrlBase(
    process.env.BE_PROTOCOL as string,
    process.env.BE_HOSTNAME as string,
    process.env.BE_PORT as string,
    process.env.BE_PREFIX as string,
  )
