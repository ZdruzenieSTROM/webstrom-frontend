import {FC} from 'react'
import {Datagrid, List, NumberField, ReferenceField, TextField} from 'react-admin'

import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const ProblemList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <ReferenceField source="series" reference="competition/series" link={false} />
      <NumberField source="order" />
      <TruncatedTextField source="text" maxTextWidth={50} />
      <TextField source="image" record={{image: 'TODO'}} />
      <NumberField source="num_comments" />
    </Datagrid>
  </List>
)
