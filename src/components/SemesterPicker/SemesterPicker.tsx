import {Stack} from '@mui/material'
import {FC, useEffect} from 'react'

import {getSemesterName} from '@/utils/getSemesterName'
import {getSemesterYear} from '@/utils/getSemesterYear'
import {getSeriesName} from '@/utils/getSeriesName'
import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {useDataFromURL} from '@/utils/useDataFromURL'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Dropdown, DropdownOption} from './Dropdown'

export const SemesterPicker: FC<{page: 'zadania' | 'poradie' | 'admin/opravovanie'}> = ({page}) => {
  const {seminar} = useSeminarInfo()
  const {setPageTitle} = PageTitleContainer.useContainer()

  const {id: selectedItem, semesterList, displayWholeSemesterOnResults} = useDataFromURL()

  const semester = semesterList.find(({id}) => id === selectedItem.semesterId)
  const series = semester?.series_set.find(({id}) => id === selectedItem.seriesId)

  useEffect(() => {
    // setPageTitle using selectedItem variable
    if (semester) {
      const semesterTitle = `${getSemesterYear(semester)} - ${getSemesterName(semester)}`
      let pageTitleToSet = semesterTitle
      if (page === 'admin/opravovanie') {
        pageTitleToSet = `Opravovanie - ${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'} (${
          semester.school_year
        })`
        // ak je page poradie a zobrazujeme cely semester, tak sa nezobrazuje seria v nazve
        // pre seriu sa chceme stale pokusit zobrazit nazov serie
      } else if (!(page === 'poradie' && displayWholeSemesterOnResults) && series) {
        pageTitleToSet = `${semesterTitle}${series.order ? ` - ${getSeriesName(series)}` : ''}`
      }
      setPageTitle(pageTitleToSet)
    }
    // `semester` a `series` su nami vytiahnute objekty, tak mozu triggerovat effekt kazdy render. nemalo by vadit
  }, [displayWholeSemesterOnResults, semester, series, page, setPageTitle])

  const dropdownSemesterList = semesterList.map((semester) => {
    return {
      id: semester.id,
      text: `${getSemesterYear(semester)} - ${getSemesterName(semester)}`,
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

    if (page === 'poradie') {
      dropdownSeriesList.push({
        id: -1,
        text: 'obe série',
        link: `/${seminar}/${page}/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}`,
        selected: displayWholeSemesterOnResults,
      })
    }
  }

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        // wrap na velmi nizkych rozliseniach
        flexWrap: 'wrap',
        rowGap: 0.5,
        // pre pouzitie v TopGrid + pri wrapnuti
        justifyContent: 'end',
      }}
    >
      <Dropdown title={'Semester'} options={dropdownSemesterList} />
      {page !== 'admin/opravovanie' && <Dropdown title={'Séria'} options={dropdownSeriesList} />}
    </Stack>
  )
}
