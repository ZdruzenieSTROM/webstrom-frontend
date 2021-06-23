// eslint-disable-next-line node/no-extraneous-import
import {createBrowserHistory} from 'history'
import React, {FC} from 'react'
import {Admin as ReactAdmin, Resource} from 'react-admin'

import {dataProvider} from '../../admin/dataProvider'
import {authProvider} from '../../admin/tokenAuthProvider'
import {CompetitionList} from './Competition/CompetitionList'
import {PostCreate} from './Post/PostCreate'
import {PostEdit} from './Post/PostEdit'
import {PostList} from './Post/PostList'
import {PostShow} from './Post/PostShow'

// react admin interne pouziva react-router, takze treba takto spojit ich instancie, inak to hadze warningy a routovanie nefunguje uplne spravne.
// pri prechode na next.js to myslim budeme vediet vyhodit a pouzivat defaultnu hash historiu
const history = createBrowserHistory({basename: '/admin'})

export const Admin: FC = () => (
  <ReactAdmin authProvider={authProvider} dataProvider={dataProvider} history={history}>
    <Resource name="cms/post" list={PostList} edit={PostEdit} show={PostShow} create={PostCreate} />
    {/* TODO: create, edit, celkovo rozumne rozhranie pre sutaze/serie */}
    <Resource name="competition/series" list={CompetitionList} />
  </ReactAdmin>
)
