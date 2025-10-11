import {useQuery} from '@tanstack/react-query'
import {useRouter} from 'next/router'
import {useMemo} from 'react'

import {apiOptions} from '@/api/api'
import {Semester, SeriesWithProblems} from '@/types/api/competition'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

const getIdsFromUrl = ({
  semesterList,
  currentSeriesData,
  params,
}: {
  semesterList: Semester[]
  currentSeriesData?: SeriesWithProblems
  params: string | string[] | undefined
}): {semesterId: number; seriesId: number; displayWholeSemesterOnResults: boolean} => {
  const currentSeriesId = currentSeriesData?.id ?? -1
  const currentSemesterId = currentSeriesData?.semester ?? -1

  const currentIds = {semesterId: currentSemesterId, seriesId: currentSeriesId, displayWholeSemesterOnResults: true}

  // sutaz bez semestrov, nemalo by sa stat
  if (semesterList.length === 0) return currentIds

  // ked nemame params (`/`), pouzijeme aktualny semester a seriu. na vysledkoch zobrazime cely semester
  if (params === undefined || params.length === 0) return currentIds

  // mame aspon 1 param (`/44/...`), tak vytiahneme a spracujeme rok
  const seriesYear = getNumber(params[0])
  const semestersForYear = semesterList.filter(({year}) => year === seriesYear)

  // ked mame len jeden param (`/44`)
  if (params.length === 1) {
    // pouzijeme prvy semester ziadaneho roku
    const semester = semestersForYear[0]
    if (!semester) return currentIds
    // pouzijeme prvu seriu semestra
    const series = semester.series_set[0]
    if (!series) return currentIds

    return {semesterId: semester.id, seriesId: series.id, displayWholeSemesterOnResults: false}
  }

  // mame aspon 2 params (`/44/leto/...`), tak vytiahneme a spracujeme sezonu
  let seasonCode: number | undefined
  if (params[1] === 'zima') seasonCode = 0
  if (params[1] === 'leto') seasonCode = 1
  if (seasonCode === undefined) return currentIds
  const semester = semestersForYear.find(({season_code}) => season_code === seasonCode)
  if (!semester) return currentIds

  // ked mame len 2 params (`/44/leto`), pouzijeme prvu seriu z tohto semestra
  if (params.length === 2) {
    const series = semester.series_set[0]
    if (!series) return currentIds

    // specialny pripad pre poradie - URL bez serie sa pouziva na zobrazenie celeho semestra
    return {semesterId: semester.id, seriesId: series.id, displayWholeSemesterOnResults: true}
  }

  // mame aspon 3 params (`/44/leto/2/...`), tak vytiahneme a spracujeme poradie serie
  const seriesOrder = getNumber(params[2])
  const series = semester.series_set.find(({order}) => order === seriesOrder)
  if (!series) return currentIds

  return {semesterId: semester.id, seriesId: series.id, displayWholeSemesterOnResults: false}
}

export const useDataFromURL = () => {
  const {seminarId, seminar} = useSeminarInfo()
  const router = useRouter()
  // ocakavane params su v podstate: `/YEAR/SEASON/SERIES_ORDER`
  const {params} = router.query

  const {data: semesterListData, isLoading: semesterListIsLoading} = useQuery(
    apiOptions.competition.semesterList(seminarId),
  )
  // memoized because the array fallback would create new object on each render, which would ruin seriesId memoization as semesterList is a dependency
  const semesterList = useMemo(() => semesterListData || [], [semesterListData])

  // aktualna seria. z tejto query sa vyuziva len `currentSeriesId` a len vtedy, ked nemame uplnu URL
  // - napr. prideme na `/zadania` cez menu, nie na `/zadania/44/leto/2`
  const {data: currentSeriesData, isLoading: currentSeriesIsLoading} = useQuery(
    apiOptions.competition.series.current(seminarId),
  )

  const {semesterId, seriesId, displayWholeSemesterOnResults} = useMemo(
    () => getIdsFromUrl({semesterList, currentSeriesData, params}),
    [semesterList, currentSeriesData, params],
  )

  return {
    id: {seminarId, semesterId, seriesId},
    semesterList,
    loading: {currentSeriesIsLoading, semesterListIsLoading},
    seminar,
    displayWholeSemesterOnResults,
  }
}

// mimics `useDataFromURL()` for SSR
export const getDataFromUrl = ({
  semesterList,
  currentSeriesData,
  params,
}: {
  semesterList: Semester[]
  currentSeriesData?: SeriesWithProblems
  params: string | string[] | undefined
}): {
  id: {semesterId: number; seriesId: number}
  displayWholeSemesterOnResults: boolean
} => {
  const {semesterId, seriesId, displayWholeSemesterOnResults} = getIdsFromUrl({
    semesterList,
    currentSeriesData,
    params,
  })

  return {
    id: {semesterId, seriesId},
    displayWholeSemesterOnResults,
  }
}

const getNumber = (n: string) => {
  const num = Number(n)
  return Number.isNaN(num) ? -1 : num
}
