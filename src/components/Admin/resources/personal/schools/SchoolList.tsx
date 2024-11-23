import {FC} from 'react'
import {Datagrid, List, TextField} from 'react-admin'

import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const SchoolList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <TruncatedTextField source="name" maxTextWidth={60} />
      <TextField source="street" />
      <TextField source="city" />
      <TextField source="abbreviation" />
    </Datagrid>
  </List>
)
