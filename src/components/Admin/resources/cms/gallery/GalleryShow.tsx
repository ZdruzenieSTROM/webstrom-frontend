import {FC} from 'react'
import {Show, SimpleShowLayout, TextField} from 'react-admin'

import {MyShowActions} from '@/components/Admin/custom/MyShowActions'

export const GalleryShow: FC = () => (
  <Show actions={<MyShowActions />}>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="gallery_link" />
      <TextField source="event_name" />
    </SimpleShowLayout>
  </Show>
)
