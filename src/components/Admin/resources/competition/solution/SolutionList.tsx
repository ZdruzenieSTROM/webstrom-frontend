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

export const SolutionList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <ReferenceField source="problem" reference="competition/problem" link={false} />
      <ReferenceField source="semester_registration" reference="competition/event-registration" link={false} />
      <FunctionField<RaRecord>
        label="Má nahraté riešenie"
        render={(record) => record && <BooleanField record={{xxx: !!record['solution']}} source="xxx" />}
      />
    </Datagrid>
  </List>
)
