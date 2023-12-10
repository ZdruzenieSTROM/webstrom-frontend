import {FC} from 'react'
import {Datagrid, DateField, FunctionField, List, RaRecord, TextField} from 'react-admin'

import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const PostList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="caption" />
      <TruncatedTextField source="short_text" maxTextWidth={50} />
      <TruncatedTextField source="details" maxTextWidth={50} />
      <DateField source="added_at" />
      <DateField source="visible_after" />
      <DateField source="visible_until" />
      <SitesArrayField source="sites" />
      <FunctionField<RaRecord>
        source="links"
        label="Link count"
        render={(record) => record && <span>{record['links'].length}</span>}
      />
    </Datagrid>
  </List>
)
