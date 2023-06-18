import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {useMemo} from 'react'

import {SemesterList} from '@/components/SemesterPicker/SemesterPicker'
import {SeriesWithProblems} from '@/types/api/competition'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

export const useDataFromURL = () => {
  const {seminarId, seminar} = useSeminarInfo()
  const router = useRouter()
  const {data: semesterListData, isLoading: semesterListIsLoading} = useQuery({
    queryKey: ['competition', 'semester-list', {competition: seminarId}],
    queryFn: () => axios.get<SemesterList[]>(`/api/competition/semester-list?competition=${seminarId}`),
  })
  // memoized because the array fallback would create new object on each render, which would ruin seriesId memoization as semesterList is a dependency
  const semesterList = useMemo(() => semesterListData?.data || [], [semesterListData])

  // z tejto query sa vyuziva len `currentSeriesId` a len vtedy, ked nemame uplnu URL
  // - napr. prideme na `/zadania` cez menu, nie na `/zadania/44/leto/2`
  const {data: currentSeriesData, isLoading: currentSeriesIsLoading} = useQuery({
    queryKey: ['competition', 'series', 'current', seminarId],
    queryFn: () => axios.get<SeriesWithProblems>(`/api/competition/series/current/` + seminarId),
  })
  const currentSeriesId = currentSeriesData?.data.id ?? -1
  const currentSemesterId = currentSeriesData?.data.semester ?? -1

  // Set seriesId from url.
  // If series is not specified, set seriesId.semester to true and find semester id using year and semesterCode from the url.
  // If series is specified, set seriesId.semester to false and find series id using year, semesterCode, and series number from the url.
  const {semesterId, seriesId, displaySemester} = useMemo(() => {
    if (!semesterList.length) return {semesterId: -1, seriesId: -1, displaySemester: true}

    const {params} = router.query

    const getIdsFromUrl = (
      params: string | string[] | undefined,
    ): {semesterId: number; seriesId: number; displaySemester: boolean} => {
      if (params === undefined || params.length === 0 || params.length === 1) {
        return {semesterId: currentSemesterId, seriesId: currentSeriesId, displaySemester: true}
      }

      // todo: do we want to do something if only one parameter is provided?

      // get year from the first URL param
      const seriesYear = getNumber(params[0])

      // get season from the second URL param
      let seasonCode = -1
      if (params[1] === 'zima') seasonCode = 0
      if (params[1] === 'leto') seasonCode = 1

      const semester = semesterList.find(({year, season_code}) => year === seriesYear && season_code === seasonCode)

      if (semester) {
        if (params.length === 2) {
          if (semester.series_set.length > 0) {
            return {semesterId: semester.id, seriesId: semester.series_set[0].id, displaySemester: true}
          }
        }

        if (params.length >= 3) {
          // get series from the second URL param
          const seriesOrder = getNumber(params[2])
          const series = semester.series_set.find(({order}) => order === seriesOrder)

          if (series) return {semesterId: semester.id, seriesId: series.id, displaySemester: false}
        }
      }

      return {semesterId: currentSemesterId, seriesId: currentSeriesId, displaySemester: true}
    }

    return getIdsFromUrl(params)
  }, [router.query, semesterList, currentSeriesId, currentSemesterId])

  return {
    id: {seminarId, semesterId, seriesId},
    semesterList,
    loading: {currentSeriesIsLoading, semesterListIsLoading},
    seminar,
    displaySemester,
  }
}

const getNumber = (n: string) => {
  if (Number.isNaN(Number(n))) {
    return -1
  } else {
    return Number(n) ?? -1
  }
}
