import {FC} from 'react'
import {NumberField, Show, SimpleShowLayout, TextField} from 'react-admin'

import {MyShowActions} from '@/components/Admin/custom/MyShowActions'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const FlatpageShow: FC = () => (
  <Show actions={<MyShowActions />}>
    <SimpleShowLayout>
      <NumberField source="id" />
      <TextField source="url" />
      <TextField source="title" />
      <TruncatedTextField source="content" maxTextWidth={200} expandable />
    </SimpleShowLayout>
  </Show>
)
