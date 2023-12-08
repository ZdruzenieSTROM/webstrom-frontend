import {FC} from 'react'
import {BooleanField, Datagrid, List, NumberField, TextField} from 'react-admin'

import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const FlatpageList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <NumberField source="id" />
      <TextField source="url" />
      <TextField source="title" />
      <TruncatedTextField source="content" maxTextWidth={30} />
      <BooleanField source="enable_comments" />
      <BooleanField source="registration_required" />
      <SitesArrayField source="sites" />
    </Datagrid>
  </List>
)
