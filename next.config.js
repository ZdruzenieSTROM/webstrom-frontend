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
        destination: `${process.env.NEXT_PUBLIC_BE_PROTOCOL}://${process.env.NEXT_PUBLIC_BE_HOSTNAME}:${process.env.NEXT_PUBLIC_BE_PORT}/:path*/`,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_BE_PROTOCOL,
        hostname: process.env.NEXT_PUBLIC_BE_HOSTNAME,
        port: process.env.NEXT_PUBLIC_BE_PORT,
        pathname: '/media/**',
      },
    ],
  },
  reactStrictMode: true,
}
