import {FC} from 'react'

import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Dropdown, DropdownOption} from './Dropdown'
import styles from './SemesterPicker.module.scss'

interface SeriesList {
  id: number
  order: number
  deadline: string
  complete: boolean
  frozen_results: string | null
  semester: number
}

export interface SemesterList {
  id: number
  year: number
  school_year: string
  season_code: number
  start: string
  end: string
  frozen_results: boolean
  competition: number
  late_tags: string[]
  series_set: SeriesList[]
}

export const SemesterPicker: FC<{semesterList: SemesterList[]; selectedSeriesId: number}> = ({
  semesterList,
  selectedSeriesId,
}) => {
  const {seminar} = useSeminarInfo()

  let selectedSemesterId = -1

  const dropdownSemesterList = semesterList.map((semester) => {
    return {
      id: semester.id,
      text: `${semester.year}. Ročník - ${semester.season_code === 0 ? 'zimný' : 'letný'} semester`,
      link: `/${seminar}/zadania/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}/`,
    }
  })

  let dropdownSeriesList: DropdownOption[] = []

  for (let i = 0; i < semesterList.length; i++) {
    for (let j = 0; j < semesterList[i].series_set.length; j++) {
      if (semesterList[i].series_set[j].id === selectedSeriesId) {
        selectedSemesterId = semesterList[i].id
        dropdownSeriesList = semesterList[i].series_set.map((series) => {
          return {
            id: series.id,
            text: `${series.order}. séria`,
            link: `/${seminar}/zadania/${semesterList[i].year}/${semesterList[i].season_code === 0 ? 'zima' : 'leto'}/${
              series.order
            }/`,
          }
        })
      }
    }
  }

  return (
    <div className={styles.menu}>
      <Dropdown title={'Séria'} selectedId={selectedSeriesId} options={dropdownSeriesList} />
      <Dropdown title={'Semester'} selectedId={selectedSemesterId} options={dropdownSemesterList} />
    </div>
  )
}
