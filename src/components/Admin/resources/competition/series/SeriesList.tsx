import {FC} from 'react'
import {BooleanField, Datagrid, FunctionField, List, RaRecord, ReferenceField, TextField} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'

export const SeriesList: FC = () => (
  <List>
    <Datagrid>
      <ReferenceField source="semester" reference="competition/semester" link={false} />
      <DateTimeField source="deadline" />
      <TextField source="order" />
      <BooleanField source="complete" />
      <FunctionField<RaRecord>
        label="Problem count"
        render={(record) => record && <span>{record['problems'].length}</span>}
      />
    </Datagrid>
  </List>
)
