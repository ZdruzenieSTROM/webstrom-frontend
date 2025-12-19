import {FC} from 'react'
import {ImageField, NumberField, ReferenceField, SimpleShowLayout} from 'react-admin'

import {MyShowFileField} from '@/components/Admin/custom/file-handling/MyShowFileField'
import {MyShow} from '@/components/Admin/custom/MyShow'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const ProblemShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="series" reference="competition/series" link="show" />
      <NumberField source="order" />
      <TruncatedTextField source="text" maxTextWidth={100} expandable />
      <ImageField source="image" sx={{'& .RaImageField-image': {width: 400, height: 300}}} />
      <MyShowFileField source="solution_pdf" />
      <NumberField source="num_comments" />
    </SimpleShowLayout>
  </MyShow>
)
