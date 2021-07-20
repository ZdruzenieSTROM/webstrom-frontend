import React, {FC} from 'react'
import {
  ArrayField,
  Datagrid,
  DateField,
  EditButton,
  ListButton,
  NumberField,
  Show,
  ShowActionsProps,
  ShowProps,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
  TopToolbar,
} from 'react-admin'

const PostShowActions: FC<ShowActionsProps> = ({basePath, data}) => (
  <TopToolbar>
    <EditButton basePath={basePath} record={data} />
    <ListButton basePath={basePath} record={data} />
  </TopToolbar>
)

export const PostShow: FC<ShowProps> = (props) => (
  <Show {...props} actions={<PostShowActions />}>
    <TabbedShowLayout>
      <Tab label="general">
        <SimpleShowLayout>
          <NumberField source="id" />
          <TextField source="caption" />
          <TextField source="short_text" />
          <TextField source="details" />
          <DateField source="added_at" />
          <DateField source="show_after" />
          <DateField source="disable_after" />
          {/* <ArrayField source="sites" /> */}
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
