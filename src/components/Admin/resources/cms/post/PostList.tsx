import {FC} from 'react'
import {Datagrid, FunctionField, List, RaRecord, TextField} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const PostList: FC = () => (
  <List>
    <Datagrid>
      <TextField source="caption" />
      <TruncatedTextField source="short_text" maxTextWidth={50} />
      <TruncatedTextField source="details" maxTextWidth={50} />
      <DateTimeField source="added_at" />
      <DateTimeField source="visible_after" />
      <DateTimeField source="visible_until" />
      <SitesArrayField source="sites" />
      <FunctionField<RaRecord> source="links" render={(record) => record && <span>{record['links'].length}</span>} />
    </Datagrid>
  </List>
)
