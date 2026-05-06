import {ThemeProvider} from '@mui/material/styles'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, RenderOptions} from '@testing-library/react'
import {ReactElement} from 'react'
import {vi} from 'vitest'

import {apiAxios} from '@/api/apiAxios'
import {theme} from '@/theme/theme'
import {ProblemWithSolutions, SolutionAdministration} from '@/types/api/competition'
import {AlertContainer} from '@/utils/AlertContainer'

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {retry: false, staleTime: Infinity},
      mutations: {retry: false},
    },
  })

export const renderWithProviders = (ui: ReactElement, options?: RenderOptions) => {
  const queryClient = makeQueryClient()
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <AlertContainer.Provider>
          <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </AlertContainer.Provider>
      </QueryClientProvider>,
      options,
    ),
  }
}

export const makeSolution = (overrides: Partial<SolutionAdministration> = {}): SolutionAdministration => ({
  id: 1,
  score: null,
  vote: null,
  late_tag: null,
  is_online: true,
  solution: null,
  corrected_solution: null,
  semester_registration: {
    profile: {first_name: 'Test', last_name: 'User'},
  } as SolutionAdministration['semester_registration'],
  ...overrides,
})

export const makeProblem = (overrides: Partial<ProblemWithSolutions> = {}): ProblemWithSolutions => ({
  order: 1,
  text: 'Test problem',
  image: null,
  solution_pdf: null,
  series: {id: 1, order: 1, deadline: '2026-01-01', complete: false, frozen_results: null, semester: 10},
  solution_set: [],
  ...overrides,
})

export const makeSemester = () => ({year: 2026, season_code: 0})

/**
 * Wires the global apiAxios.get mock to return the given problem on the
 * problem-administration endpoint and the given semester on the semester endpoint.
 * Any other URL rejects.
 */
export const mockProblemFetch = (data: {problem: ProblemWithSolutions; semester?: ReturnType<typeof makeSemester>}) => {
  const semester = data.semester ?? makeSemester()
  vi.mocked(apiAxios.get).mockImplementation((url: string) => {
    if (url.includes('problem-administration')) return Promise.resolve({data: data.problem})
    if (url.includes('semester')) return Promise.resolve({data: semester})
    return Promise.reject(new Error(`Unexpected GET ${url}`))
  })
}
