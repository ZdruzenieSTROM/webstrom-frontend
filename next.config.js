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
}
