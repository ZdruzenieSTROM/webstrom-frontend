import {FC} from 'react'
import {Datagrid, DateField, List, ListProps, NumberField, TextField} from 'react-admin'

export const PostList: FC<ListProps> = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <NumberField source="id" />
      <TextField source="caption" />
      <TextField source="short_text" />
      <TextField source="details" />
      <DateField source="added_at" />
      <DateField source="show_after" />
      <DateField source="disable_after" />
      {/* <ArrayField source="links" /> */}
      {/* <ArrayField source="sites" /> */}
    </Datagrid>
  </List>
)
