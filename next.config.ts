import type {NextConfig} from 'next'
// eslint-disable-next-line node/no-extraneous-import
import type {Configuration} from 'webpack'

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
  // musime zatial nechat webpack (nie turbopack) pre build, napr. kvoli tejto issue:
  // https://github.com/vercel/next.js/discussions/77721#discussioncomment-13468362
  // ked to bude fixed, mozeme znovu vratit `--turbopack` do `build` scriptu v package.json
  webpack(config: Configuration) {
    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
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

export default nextConfig
