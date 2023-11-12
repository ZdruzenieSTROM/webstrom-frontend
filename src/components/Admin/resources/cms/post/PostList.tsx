import {FC} from 'react'
import {Datagrid, DateField, List, NumberField, TextField} from 'react-admin'

export const PostList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <NumberField source="id" />
      <TextField source="caption" />
      <TextField source="short_text" />
      <TextField source="details" />
      <DateField source="added_at" />
      <DateField source="visible_after" />
      <DateField source="visible_until" />
      {/* <ArrayField source="links" /> */}
      {/* <ArrayField source="sites" /> */}
    </Datagrid>
  </List>
)
