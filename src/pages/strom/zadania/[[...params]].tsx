import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Problems} from '@/components/Problems/Problems'
import {SemesterPicker} from '@/components/SemesterPicker/SemesterPicker'
import {useDataFromURL} from '@/utils/useDataFromURL'

const Zadania: NextPage = () => {
  const {id, semesterList} = useDataFromURL()

  return (
    <PageLayout contentWidth={2}>
      <SemesterPicker
        semesterList={semesterList}
        selectedItem={{semesterId: id.semesterId, seriesId: id.seriesId}}
        page={'problems'}
      />
      <Problems />
    </PageLayout>
  )
}

export default Zadania
