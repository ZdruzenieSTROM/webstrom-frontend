import {FC} from 'react'
import {Datagrid, List, TextField} from 'react-admin'

import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const FlatpageList: FC = () => (
  <List>
    <Datagrid>
      <TextField source="url" />
      <TextField source="title" />
      <TruncatedTextField source="content" maxTextWidth={30} />
    </Datagrid>
  </List>
)
