import '@testing-library/jest-dom/vitest'

import {cleanup} from '@testing-library/react'
import {afterAll, afterEach, beforeAll, vi} from 'vitest'

import {server, startServer, takeUnhandledRequests} from '@/test-utils/server'

// next/font loaders are build-time only; jsdom doesn't run them. Mock globally so any
// component touching the theme is renderable in tests without per-file boilerplate.
vi.mock('next/font/google', () => ({
  Poppins: () => ({className: 'poppins', style: {fontFamily: 'Poppins'}}),
}))

vi.mock('next/font/local', () => ({
  default: () => ({className: 'local', variable: '--font-local', style: {fontFamily: 'local'}}),
}))

// Replace next/router with next-router-mock so consumers (useRouter, useSeminarInfo, etc.)
// see a real-shaped router driven by mockRouter.setCurrentUrl(...) per test.
vi.mock('next/router', () => vi.importActual<typeof import('next-router-mock')>('next-router-mock'))

// The network is mocked at the HTTP boundary, so the real axios instance, its interceptors and the
// auth container run in tests. Each test registers the backend's answers with `server.use(...)`.
beforeAll(() => {
  startServer()
})

afterEach(() => {
  cleanup()
  server.resetHandlers()

  const unhandledRequests = takeUnhandledRequests()
  if (unhandledRequests.length > 0) {
    throw new Error(`The test made requests it did not mock:\n${unhandledRequests.join('\n')}`)
  }
})

afterAll(() => {
  server.close()
})
