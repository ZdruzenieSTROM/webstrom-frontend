import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import {defineConfig, Plugin} from 'vitest/config'

// The app imports SVGs as React components (SVGR in the Next build). Vite would hand tests
// a URL string instead, which React cannot render.
const svgAsComponent = (): Plugin => ({
  name: 'svg-as-component',
  enforce: 'pre',
  load(id) {
    if (!id.endsWith('.svg')) return
    return "import {createElement} from 'react'\nexport default (props) => createElement('svg', props)"
  },
})

export default defineConfig({
  plugins: [svgAsComponent(), tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    clearMocks: true,
  },
})
