import {FC} from 'react'
import {Admin as ReactAdmin, Resource} from 'react-admin'

import {AdminLayout} from './AdminLayout'
import {dataProvider} from './dataProvider'
import {FlatpageCreate} from './resources/base/flat-page/FlatpageCreate'
import {FlatpageEdit} from './resources/base/flat-page/FlatpageEdit'
import {FlatpageList} from './resources/base/flat-page/FlatpageList'
import {FlatpageShow} from './resources/base/flat-page/FlatpageShow'
import {PostCreate} from './resources/cms/post/PostCreate'
import {PostEdit} from './resources/cms/post/PostEdit'
import {PostList} from './resources/cms/post/PostList'
import {PostShow} from './resources/cms/post/PostShow'
import {CompetitionEdit} from './resources/competition/competition/CompetitionEdit'
import {CompetitionList} from './resources/competition/competition/CompetitionList'
import {CompetitionShow} from './resources/competition/competition/CompetitionShow'
import {EventCreate} from './resources/competition/event/EventCreate'
import {EventEdit} from './resources/competition/event/EventEdit'
import {EventList} from './resources/competition/event/EventList'
import {EventShow} from './resources/competition/event/EventShow'
import {ProblemCreate} from './resources/competition/problems/ProblemCreate'
import {ProblemEdit} from './resources/competition/problems/ProblemEdit'
import {ProblemList} from './resources/competition/problems/ProblemList'
import {ProblemShow} from './resources/competition/problems/ProblemShow'
import {SemesterCreate} from './resources/competition/semester/SemesterCreate'
import {SemesterEdit} from './resources/competition/semester/SemesterEdit'
import {SemesterList} from './resources/competition/semester/SemesterList'
import {SemesterShow} from './resources/competition/semester/SemesterShow'
import {SeriesCreate} from './resources/competition/series/SeriesCreate'
import {SeriesEdit} from './resources/competition/series/SeriesEdit'
import {SeriesList} from './resources/competition/series/SeriesList'
import {SeriesShow} from './resources/competition/series/SeriesShow'
import {useAuthProvider} from './useAuthProvider'

export const Admin: FC = () => {
  const authProvider = useAuthProvider()

  return (
    <ReactAdmin authProvider={authProvider} dataProvider={dataProvider} layout={AdminLayout}>
      <Resource name="cms/post" list={PostList} edit={PostEdit} show={PostShow} create={PostCreate} />
      <Resource
        name="base/flat-page"
        list={FlatpageList}
        edit={FlatpageEdit}
        show={FlatpageShow}
        create={FlatpageCreate}
      />
      <Resource
        name="competition/competition"
        // helps with option names in ReferenceInput
        recordRepresentation="name"
        list={CompetitionList}
        edit={CompetitionEdit}
        show={CompetitionShow}
        // nedovolujeme create na competition - velmi rare flow, ani nemame BE POST endpoint na to
      />
      <Resource name="competition/event" list={EventList} edit={EventEdit} show={EventShow} create={EventCreate} />
      <Resource
        name="competition/semester"
        // helps with option names in ReferenceInput
        recordRepresentation={(semester) =>
          `competition:${semester.competition},year:${semester.year},season:${semester.season_code}`
        }
        list={SemesterList}
        edit={SemesterEdit}
        show={SemesterShow}
        create={SemesterCreate}
      />
      <Resource name="competition/series" list={SeriesList} edit={SeriesEdit} show={SeriesShow} create={SeriesCreate} />
      <Resource
        name="competition/problem"
        list={ProblemList}
        edit={ProblemEdit}
        show={ProblemShow}
        create={ProblemCreate}
      />
    </ReactAdmin>
  )
}
