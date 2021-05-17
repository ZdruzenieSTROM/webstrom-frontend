import drfProvider from 'ra-data-django-rest-framework'
import React, {FC} from 'react'
import {Admin as ReactAdmin} from 'react-admin'
import {useHistory} from 'react-router-dom'

const dataProvider = drfProvider('/api')

export const Admin: FC = () => {
  // needed to get of console warning (react admin actually uses react-router as well, so we need to link the instances this way)
  const history = useHistory()
  return <ReactAdmin dataProvider={dataProvider} history={history} />
}
