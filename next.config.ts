import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  output: 'standalone',
  reactStrictMode: true,
  // typecheck aj eslint pustame v CI pred buildom osobitne, nemusi ich pustat aj next
  typescript: {ignoreBuildErrors: true},
  eslint: {
    ignoreDuringBuilds: true,
    // aby sme mohli pustat `next lint` miesto `eslint .` priamo - next napr. krajsie formatuje output
    // https://nextjs.org/docs/app/api-reference/config/eslint#linting-custom-directories-and-files
    dirs: ['.'],
  },
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#advanced-middleware-flags
  skipTrailingSlashRedirect: true,
}

// eslint-disable-next-line import/no-default-export
export default nextConfig
