module.exports = {
  env: {
    PUBLIC_URL: '',
  },
  experimental: {
    craCompat: true,
  },
  // Remove this to leverage Next.js' static image handling
  // read more here: https://nextjs.org/docs/api-reference/next/image
  images: {
    disableStaticImages: true,
  },
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
