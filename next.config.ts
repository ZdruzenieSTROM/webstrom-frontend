import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.BE_PROTOCOL as 'http' | 'https' | undefined,
        hostname: process.env.BE_HOSTNAME ?? 'localhost',
        port: process.env.BE_PORT,
        pathname: '/media/**',
      },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  reactStrictMode: true,
  // typecheck aj eslint pustame v CI pred buildom osobitne, nemusi ich pustat aj next
  typescript: {ignoreBuildErrors: true},
  eslint: {ignoreDuringBuilds: true},
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#advanced-middleware-flags
  skipTrailingSlashRedirect: true,
}

// eslint-disable-next-line import/no-default-export
export default nextConfig
