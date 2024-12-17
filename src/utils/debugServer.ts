export const debugServer: typeof console.log = (...args) => {
  if (process.env.DEBUG === 'true') {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}
