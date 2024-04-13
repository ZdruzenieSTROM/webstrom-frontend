import {FC} from 'react'
import {Datagrid, ImageField, List, NumberField, ReferenceField} from 'react-admin'

import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const ProblemList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <ReferenceField source="series" reference="competition/series" link={false} />
      <NumberField source="order" />
      <TruncatedTextField source="text" maxTextWidth={50} />
      <ImageField source="image" sx={{'& .RaImageField-image': {width: 100, height: 75}}} />
      <NumberField source="num_comments" />
    </Datagrid>
  </List>
)
