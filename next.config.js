module.exports = {
  // docs: https://nextjs.org/docs/api-reference/next.config.js/redirects
  async redirects() {
    return [
      // redirect home stranky na strom podstranku
      {
        source: '/',
        destination: '/strom',
        permanent: true,
      },
    ]
  },
  // docs: https://nextjs.org/docs/api-reference/next.config.js/rewrites
  async rewrites() {
    return [
      // rewrite API requestov na django BE (podstatne aj koncove lomitko)
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*/',
      },
    ]
  },
}
