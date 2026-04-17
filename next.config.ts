import {withSentryConfig} from '@sentry/nextjs'
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
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#advanced-middleware-flags
  skipTrailingSlashRedirect: true,
}

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'zdruzenie-strom',

  project: 'webstrom-frontend',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  webpack: {
    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
})
