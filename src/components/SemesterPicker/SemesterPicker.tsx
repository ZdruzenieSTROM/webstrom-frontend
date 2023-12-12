import {FC, useEffect} from 'react'

import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {useDataFromURL} from '@/utils/useDataFromURL'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Dropdown, DropdownOption} from './Dropdown'
import styles from './SemesterPicker.module.scss'

interface SeriesListItem {
  id: number
  order: number
  deadline: string
  complete: boolean
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

export const SemesterPicker: FC<{page: 'zadania' | 'vysledky' | 'admin/opravovanie'}> = ({page}) => {
  const {seminar} = useSeminarInfo()
  const {setPageTitle} = PageTitleContainer.useContainer()

  const {id: selectedItem, semesterList, displayWholeSemesterOnResults} = useDataFromURL()

  const semester = semesterList.find(({id}) => id === selectedItem.semesterId)
  const series = semester?.series_set.find(({id}) => id === selectedItem.seriesId)

  useEffect(() => {
    // setPageTitle using selectedItem variable
    let pageTitleToSet = ''
    if (semester) {
      const semesterTitle = `${semester?.year}. ročník - ${semester?.season_code === 0 ? 'zimný' : 'letný'} semester`
      if (page === 'admin/opravovanie') {
        pageTitleToSet = `Opravovanie - ${semester?.year}/${semester?.season_code === 0 ? 'zima' : 'leto'} (${
          semester?.school_year
        })`
      } else if (displayWholeSemesterOnResults) {
        pageTitleToSet = semesterTitle
      } else if (series) {
        pageTitleToSet = `${semesterTitle}${series?.order ? ` - ${series?.order}. séria` : ''}`
      }
    }
    setPageTitle(pageTitleToSet)
    // `semester` a `series` su nami vytiahnute objekty, tak mozu triggerovat effekt kazdy render. nemalo by vadit
  }, [displayWholeSemesterOnResults, semester, series, page, setPageTitle])

  const dropdownSemesterList = semesterList.map((semester) => {
    return {
      id: semester.id,
      text: `${semester.year}. ročník - ${semester.season_code === 0 ? 'zimný' : 'letný'} semester`,
      link: `/${seminar}/${page}/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}`,
      selected: semester.id === selectedItem.semesterId,
    }
  })

  let dropdownSeriesList: DropdownOption[] = []

  if (semester !== undefined) {
    dropdownSeriesList = semester.series_set.map((series) => {
      return {
        id: series.id,
        text: `${series.order}. séria`,
        link: `/${seminar}/${page}/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}/${series.order}`,
        selected: !displayWholeSemesterOnResults && series.id === selectedItem.seriesId,
      }
    })

    if (page === 'vysledky') {
      dropdownSeriesList.push({
        id: -1,
        text: 'obe série',
        link: `/${seminar}/${page}/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}`,
        selected: displayWholeSemesterOnResults,
      })
    }
  }

  return (
    <div className={styles.menu}>
      {page !== 'admin/opravovanie' && <Dropdown title={'Séria'} options={dropdownSeriesList} />}
      <Dropdown title={'Semester'} options={dropdownSemesterList} />
    </div>
  )
}
