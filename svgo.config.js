// config for SVGO as part of @svgr/webpack
// - https://github.com/svg/svgo/blob/main/README.md#configuration
// adds back the viewBox attribute to SVGs
// - problem acknowledged here: https://github.com/svg/svgo#svg-wont-scale-when-css-is-applied-on-it
// - loong discussion on the topic here: https://github.com/svg/svgo/issues/1128
// - tl;dr: using viewBox with width/height allows for scaling the SVGs
module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
  ],
}
