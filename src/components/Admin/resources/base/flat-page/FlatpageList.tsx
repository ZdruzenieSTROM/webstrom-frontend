import {FC} from 'react'
import {Datagrid, List, NumberField, TextField} from 'react-admin'

import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const FlatpageList: FC = () => (
  <List>
    <Datagrid>
      <NumberField source="id" />
      <TextField source="url" />
      <TextField source="title" />
      <TruncatedTextField source="content" maxTextWidth={30} />
    </Datagrid>
  </List>
)
