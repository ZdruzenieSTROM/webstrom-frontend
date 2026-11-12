import {screen, waitFor} from '@testing-library/react'
import {http, HttpResponse} from 'msw/http'
import {expect} from 'vitest'

import {Problems} from '@/components/Problems/Problems'
import {SeriesWithProblems} from '@/types/api/competition'

import {apiUrl} from './api'
import {makeSemester, makeSemesterWithProblems} from './fixtures'
import {renderApp} from './render'

/**
 * What the current series page of STROM loads besides the session: semester 20 with series 30.
 * `currentSeries` is called per request, so a flow's fake backend can answer from its current state.
 */
export const problemsPageHandlers = (currentSeries: () => SeriesWithProblems) => {
  const respondWithSeries = () => HttpResponse.json(currentSeries())

  return [
    http.get(apiUrl('/competition/semester-list/'), () => HttpResponse.json([makeSemester()])),
    http.get(apiUrl('/competition/series/current/0/'), respondWithSeries),
    http.get(apiUrl('/competition/series/30/'), respondWithSeries),
    http.get(apiUrl('/competition/semester/20/'), () => HttpResponse.json(makeSemesterWithProblems())),
  ]
}

export const renderProblemsPage = async () => {
  renderApp(<Problems />, {route: {pathname: '/strom/zadania/[[...params]]', query: {}}})

  await screen.findByRole('heading', {name: '1. ÚLOHA'})
  // The spinner covers both the data and the "is the visitor signed in" probe.
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
}
