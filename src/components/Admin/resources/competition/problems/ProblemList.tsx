import {FC} from 'react'
import {
  BooleanField,
  Datagrid,
  FunctionField,
  ImageField,
  List,
  NumberField,
  RaRecord,
  ReferenceField,
} from 'react-admin'

import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const ProblemList: FC = () => (
  <List>
    <Datagrid>
      <ReferenceField source="series" reference="competition/series" link={false} />
      <NumberField source="order" />
      <TruncatedTextField source="text" maxTextWidth={50} />
      <ImageField source="image" sx={{'& .RaImageField-image': {width: 100, height: 75}}} />
      <FunctionField<RaRecord>
        label="content.labels.has_vzorak"
        render={(record) => record && <BooleanField record={{xxx: !!record['solution_pdf']}} source="xxx" />}
      />
      <NumberField source="num_comments" />
    </Datagrid>
  </List>
)
