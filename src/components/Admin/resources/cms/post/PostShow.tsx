import {FC} from 'react'
import {ArrayField, Datagrid, Show, SimpleShowLayout, Tab, TabbedShowLayout, TextField} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {MyShowActions} from '@/components/Admin/custom/MyShowActions'
import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'

export const PostShow: FC = () => (
  <Show actions={<MyShowActions />}>
    <TabbedShowLayout>
      <Tab label="general">
        <SimpleShowLayout>
          <TextField source="caption" />
          <TextField source="short_text" />
          <TextField source="details" />
          <DateTimeField source="added_at" />
          <DateTimeField source="visible_after" />
          <DateTimeField source="visible_until" />
          <SitesArrayField source="sites" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="links">
        <SimpleShowLayout>
          <ArrayField source="links">
            <Datagrid>
              <TextField source="caption" />
              <TextField source="url" />
            </Datagrid>
          </ArrayField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
)
