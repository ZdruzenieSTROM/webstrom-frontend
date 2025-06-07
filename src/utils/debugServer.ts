export const debugServer: typeof console.log = (...args) => {
  if (process.env.DEBUG_SERVER === 'true') {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}
