import {Stack} from '@mui/material'
import {FC} from 'react'

import {getSemesterName} from '@/utils/getSemesterName'
import {getSemesterYear} from '@/utils/getSemesterYear'
import {getSeriesName} from '@/utils/getSeriesName'
import {useDataFromURL} from '@/utils/useDataFromURL'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Dropdown, DropdownOption} from './Dropdown'

export const SemesterPicker: FC<{page: 'zadania' | 'poradie' | 'admin/opravovanie'}> = ({page}) => {
  const {seminar} = useSeminarInfo()

  const {id: selectedItem, semesterList, displayWholeSemesterOnResults} = useDataFromURL()

  const semester = semesterList.find(({id}) => id === selectedItem.semesterId)
  const series = semester?.series_set.find(({id}) => id === selectedItem.seriesId)

  const dropdownSemesterList = semesterList.map((semester) => {
    return {
      key: semester.id,
      text: `${getSemesterYear(semester)} - ${getSemesterName(semester)}`,
      link: `/${seminar}/${page}/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}`,
      selected: semester.id === selectedItem.semesterId,
    }
  })

  let dropdownSeriesList: DropdownOption[] = []

  if (semester !== undefined) {
    dropdownSeriesList = semester.series_set.map((series) => {
      return {
        key: series.id,
        text: `${series.order}. séria`,
        link: `/${seminar}/${page}/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}/${series.order}`,
        selected: !displayWholeSemesterOnResults && series.id === selectedItem.seriesId,
      }
    })

    if (page === 'poradie') {
      dropdownSeriesList.push({
        key: 'all-series',
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
