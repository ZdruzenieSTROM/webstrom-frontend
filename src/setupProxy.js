// eslint-disable-next-line node/no-unpublished-require
const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '^/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: {
        '/api': '/', // remove base path
      },
    }),
  )
}
