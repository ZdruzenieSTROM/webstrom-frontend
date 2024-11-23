import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
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
        // TODO: neviem, preco to krici, treba overit, ci funguju obrazky pri ulohach
        // @ts-ignore
        protocol: process.env.NEXT_PUBLIC_BE_PROTOCOL,
        // @ts-ignore
        hostname: process.env.NEXT_PUBLIC_BE_HOSTNAME,
        port: process.env.NEXT_PUBLIC_BE_PORT,
        pathname: '/media/**',
      },
    ],
  },
  reactStrictMode: true,
  // https://react-svgr.com/docs/next/
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: {not: /url/}, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

// eslint-disable-next-line import/no-default-export
export default nextConfig
