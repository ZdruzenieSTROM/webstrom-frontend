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
import {EventRegistrationCreate} from './resources/competition/event-registration/EventRegistrationCreate'
import {EventRegistrationEdit} from './resources/competition/event-registration/EventRegistrationEdit'
import {EventRegistrationList} from './resources/competition/event-registration/EventRegistrationList'
import {EventRegistrationShow} from './resources/competition/event-registration/EventRegistrationShow'
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
import {SolutionCreate} from './resources/competition/solution/SolutionCreate'
import {SolutionEdit} from './resources/competition/solution/SolutionEdit'
import {SolutionList} from './resources/competition/solution/SolutionList'
import {SolutionShow} from './resources/competition/solution/SolutionShow'
import {SchoolCreate} from './resources/personal/schools/SchoolCreate'
import {SchoolEdit} from './resources/personal/schools/SchoolEdit'
import {SchoolList} from './resources/personal/schools/SchoolList'
import {SchoolShow} from './resources/personal/schools/SchoolShow'
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
        recordRepresentation="name"
        list={CompetitionList}
        edit={CompetitionEdit}
        show={CompetitionShow}
        // nedovolujeme create na competition - velmi rare flow, ani nemame BE POST endpoint na to
      />
      <Resource
        name="competition/event"
        recordRepresentation="verbose_name"
        list={EventList}
        edit={EventEdit}
        show={EventShow}
        create={EventCreate}
      />
      <Resource
        name="competition/semester"
        recordRepresentation="verbose_name"
        list={SemesterList}
        edit={SemesterEdit}
        show={SemesterShow}
        create={SemesterCreate}
      />
      <Resource
        name="competition/series"
        recordRepresentation="verbose_name"
        list={SeriesList}
        edit={SeriesEdit}
        show={SeriesShow}
        create={SeriesCreate}
      />
      <Resource
        name="competition/problem"
        recordRepresentation="verbose_name"
        list={ProblemList}
        edit={ProblemEdit}
        show={ProblemShow}
        create={ProblemCreate}
      />
      <Resource
        name="competition/solution"
        recordRepresentation="verbose_name"
        list={SolutionList}
        edit={SolutionEdit}
        show={SolutionShow}
        create={SolutionCreate}
      />
      <Resource
        name="competition/event-registration"
        recordRepresentation="verbose_name"
        list={EventRegistrationList}
        edit={EventRegistrationEdit}
        show={EventRegistrationShow}
        create={EventRegistrationCreate}
      />
      <Resource
        name="personal/schools"
        recordRepresentation="verbose_name"
        list={SchoolList}
        show={SchoolShow}
        edit={SchoolEdit}
        create={SchoolCreate}
      />
      <Resource name="personal/profiles" recordRepresentation="verbose_name" />
      <Resource name="competition/late-tag" recordRepresentation="name" />
      <Resource
        name="personal/districts"
        recordRepresentation={(record) => {
          return `${record.name} ${record.abbreviation ? `(${record.abbreviation})` : ''}`
        }}
      />
    </ReactAdmin>
  )
}
