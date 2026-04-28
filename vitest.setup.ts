import '@testing-library/jest-dom/vitest'

import {cleanup} from '@testing-library/react'
import {afterEach, vi} from 'vitest'

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

// useHasPermissions wraps AuthContainer + a /mypermissions API call + router parsing.
// Mocking it avoids cascading provider/network setup; tests can override per-case via
// vi.mocked(useHasPermissions).mockReturnValue(...) to exercise permission-denied flows.
vi.mock('@/utils/useHasPermissions', () => ({
  useHasPermissions: () => ({hasPermissions: true, permissionsIsLoading: false, isSuperuser: false, isStaff: false}),
}))

// apiAxios is the network boundary; tests still configure responses per-case via
// vi.mocked(apiAxios.get).mockImplementation(...). This factory just installs the shells.
vi.mock('@/api/apiAxios', () => ({
  apiAxios: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

afterEach(() => {
  cleanup()
})
