import {FC} from 'react'
import {Admin as ReactAdmin, Resource} from 'react-admin'

import {dataProvider} from './dataProvider'
import {PostCreate} from './resources/cms/post/PostCreate'
import {PostEdit} from './resources/cms/post/PostEdit'
import {PostList} from './resources/cms/post/PostList'
import {PostShow} from './resources/cms/post/PostShow'
import {EventCreate} from './resources/competition/event/EventCreate'
import {EventEdit} from './resources/competition/event/EventEdit'
import {EventList} from './resources/competition/event/EventList'
import {EventShow} from './resources/competition/event/EventShow'
import {useAuthProvider} from './useAuthProvider'

export const Admin: FC = () => {
  const authProvider = useAuthProvider()

  return (
    <ReactAdmin authProvider={authProvider} dataProvider={dataProvider}>
      <Resource name="cms/post" list={PostList} edit={PostEdit} show={PostShow} create={PostCreate} />
      {/* TODO: create, edit, celkovo rozumne rozhranie pre sutaze/serie */}
      <Resource name="competition/series" list={CompetitionList} />
      <Resource name="competition/event" list={EventList} edit={EventEdit} show={EventShow} create={EventCreate} />
    </ReactAdmin>
  )
}
