// config for SVGO as part of @svgr/webpack
// - https://github.com/svg/svgo/blob/main/README.md#configuration
// adds back the viewBox attribute to SVGs
// - problem acknowledged here: https://github.com/svg/svgo#svg-wont-scale-when-css-is-applied-on-it
// - loong discussion on the topic here: https://github.com/svg/svgo/issues/1128
// - tl;dr: using viewBox with width/height allows for scaling the SVGs
// nova verzia SVGO (v4) uz by default nepridava removeViewport plugin: https://github.com/svg/svgo/releases/tag/v4.0.0-rc.0
// ale @svgr/webpack na nu este neupgradol
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
