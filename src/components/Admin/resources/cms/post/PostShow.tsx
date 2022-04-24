import {FC} from 'react'
import {
  ArrayField,
  Datagrid,
  DateField,
  NumberField,
  Show,
  ShowProps,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {MyShowActions} from '@/components/Admin/custom/MyShowActions'
import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'

export const PostShow: FC<ShowProps> = (props) => (
  <Show {...props} actions={<MyShowActions />}>
    <TabbedShowLayout>
      <Tab label="general">
        <SimpleShowLayout>
          <NumberField source="id" />
          <TextField source="caption" />
          <TextField source="short_text" />
          <TextField source="details" />
          <DateField source="added_at" />
          <DateField source="visible_after" />
          <DateField source="visible_until" />
          <SitesArrayField source="sites" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="links">
        <SimpleShowLayout>
          <ArrayField source="links">
            <Datagrid>
              <NumberField source="id" />
              <TextField source="caption" />
              <TextField source="url" />
            </Datagrid>
          </ArrayField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
)
