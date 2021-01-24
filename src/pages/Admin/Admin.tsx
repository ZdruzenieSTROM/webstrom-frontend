import drfProvider from 'ra-data-django-rest-framework'
import React, {FC} from 'react'
import {Admin as ReactAdmin} from 'react-admin'
const dataProvider = drfProvider('/api')

export const Admin: FC = () => <ReactAdmin dataProvider={dataProvider} />
