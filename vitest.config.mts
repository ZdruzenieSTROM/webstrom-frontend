import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import {configDefaults, defineConfig} from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    clearMocks: true,
    // Claude Code worktrees: other branches' checkouts, tested in their own worktree
    exclude: [...configDefaults.exclude, '.claude/**'],
    server: {deps: {inline: ['react-admin', 'ra-ui-materialui', 'react-dropzone']}},
  },
})
