import {FC} from 'react'

import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Dropdown, DropdownOption} from './Dropdown'
import styles from './SemesterPicker.module.scss'

interface SeriesListItem {
  id: number
  order: number
  deadline: string
  complete: boolean
  frozen_results: string | null
  semester: number
}

export interface SemesterListItem {
  id: number
  year: number
  school_year: string
  season_code: number
  start: string
  end: string
  frozen_results: boolean
  competition: number
  late_tags: string[]
  series_set: SeriesListItem[]
}

export const SemesterPicker: FC<{
  semesterList: SemesterListItem[]
  selectedItem: {semesterId: number; seriesId: number}
  page: string
  displayWholeSemesterOption?: boolean
}> = ({semesterList, selectedItem, page, displayWholeSemesterOption = false}) => {
  const {seminar} = useSeminarInfo()
  const {setPageTitle} = PageTitleContainer.useContainer()

  // SemesterPicker menu sa zobrazuje na viacerých stránkach, podľa toho aká je hodnota premennej page.
  // Menu sa správa trochu odlišne v závyslosti od stránky na ktorej sa zobrazuje.
  let pageLink = ''
  switch (page) {
    case 'problems':
      pageLink = 'zadania'
      break
    case 'results':
      pageLink = 'vysledky'
      break
  }

  const semester = semesterList.find(({id}) => id === selectedItem.semesterId)
  const series = semester?.series_set.find(({id}) => id === selectedItem.seriesId)

  // setPageTitle using selectedItem variable
  if (semester !== undefined && displayWholeSemesterOption) {
    setPageTitle(`${semester?.year}. ročník - ${semester?.season_code === 0 ? 'zimný' : 'letný'} semester`)
  } else if (semester !== undefined && series !== undefined && !displayWholeSemesterOption) {
    setPageTitle(
      `${semester?.year}. ročník - ${semester?.season_code === 0 ? 'zimný' : 'letný'} semester${
        series?.order ? ` - ${series?.order}. séria` : ''
      }`,
    )
  } else {
    setPageTitle('')
  }

  const dropdownSemesterList = semesterList.map((semester) => {
    return {
      id: semester.id,
      text: `${semester.year}. Ročník - ${semester.season_code === 0 ? 'zimný' : 'letný'} semester`,
      link: `/${seminar}/${pageLink}/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}`,
      selected: semester.id === selectedItem.semesterId,
    }
  })

  let dropdownSeriesList: DropdownOption[] = []

  if (semester !== undefined) {
    dropdownSeriesList = semester.series_set.map((series) => {
      return {
        id: series.id,
        text: `${series.order}. séria`,
        link: `/${seminar}/${pageLink}/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}/${
          series.order
        }`,
        selected: !displayWholeSemesterOption && series.id === selectedItem.seriesId,
      }
    })

    if (page === 'results') {
      dropdownSeriesList.push({
        id: -1,
        text: 'obe série',
        link: `/${seminar}/${pageLink}/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}`,
        selected: displayWholeSemesterOption,
      })
    }
  }

  return (
    <div className={styles.menu}>
      <Dropdown title={'Séria'} options={dropdownSeriesList} />
      <Dropdown title={'Semester'} options={dropdownSemesterList} />
    </div>
  )
}
