import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Results} from '@/components/Results/Results'
import {SemesterPicker} from '@/components/SemesterPicker/SemesterPicker'
import {useDataFromURL} from '@/utils/useDataFromURL'

const Vysledky: NextPage = () => {
  const {id, displayWholeSemesterOnResults, semesterList} = useDataFromURL()

  return (
    <PageLayout contentWidth={2}>
      <SemesterPicker
        semesterList={semesterList}
        selectedItem={{semesterId: id.semesterId, seriesId: id.seriesId}}
        page={'results'}
        displayWholeSemesterOption={displayWholeSemesterOnResults}
      />
      <Results />
    </PageLayout>
  )
}

export default Vysledky
