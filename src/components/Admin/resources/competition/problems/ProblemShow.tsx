import {FC} from 'react'
import {ImageField, NumberField, RecordRepresentation, ReferenceField, Show, SimpleShowLayout} from 'react-admin'

import {MyShowActions} from '@/components/Admin/custom/MyShowActions'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const ProblemShow: FC = () => (
  <Show actions={<MyShowActions />} title={<RecordRepresentation />}>
    <SimpleShowLayout>
      <ReferenceField source="series" reference="competition/series" link="show" />
      <NumberField source="order" />
      <TruncatedTextField source="text" maxTextWidth={100} expandable />
      <ImageField source="image" sx={{'& .RaImageField-image': {width: 400, height: 300}}} />
      <NumberField source="num_comments" />
    </SimpleShowLayout>
  </Show>
)
