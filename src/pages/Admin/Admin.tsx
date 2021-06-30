import {FC} from 'react'
import {Admin as ReactAdmin, Resource} from 'react-admin'

import {dataProvider} from '../../admin/dataProvider'
import {authProvider} from '../../admin/tokenAuthProvider'
import {CompetitionList} from './Competition/CompetitionList'
import {PostCreate} from './Post/PostCreate'
import {PostEdit} from './Post/PostEdit'
import {PostList} from './Post/PostList'
import {PostShow} from './Post/PostShow'

export const Admin: FC = () => (
  <ReactAdmin authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="cms/post" list={PostList} edit={PostEdit} show={PostShow} create={PostCreate} />
    {/* TODO: create, edit, celkovo rozumne rozhranie pre sutaze/serie */}
    <Resource name="competition/series" list={CompetitionList} />
  </ReactAdmin>
)
