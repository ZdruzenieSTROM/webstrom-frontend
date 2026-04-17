import {FC} from 'react'
import {Datagrid, List, TextField} from 'react-admin'

export const GalleryList: FC = () => (
  <List>
    <Datagrid>
      <TextField source="name" />
      <TextField source="gallery_link" />
      <TextField source="event_name" />
    </Datagrid>
  </List>
)
