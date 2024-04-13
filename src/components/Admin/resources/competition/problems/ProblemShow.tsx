import {FC} from 'react'
import {FileField, ImageField, NumberField, ReferenceField, SimpleShowLayout} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const ProblemShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="series" reference="competition/series" link="show" />
      <NumberField source="order" />
      <TruncatedTextField source="text" maxTextWidth={100} expandable />
      <ImageField source="image" sx={{'& .RaImageField-image': {width: 400, height: 300}}} />
      <FileField source="solution_pdf" title="Vzorák" />
      <NumberField source="num_comments" />
    </SimpleShowLayout>
  </MyShow>
)
