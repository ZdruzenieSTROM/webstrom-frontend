import {FC} from 'react'
import {BooleanField, Datagrid, DateField, FunctionField, List, RaRecord, ReferenceField, TextField} from 'react-admin'

export const SeriesList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <ReferenceField source="semester" reference="competition/semester" link={false} />
      <DateField source="deadline" />
      <TextField source="order" />
      <BooleanField source="complete" />
      <FunctionField<RaRecord>
        label="Problem count"
        render={(record) => record && <span>{record['problems'].length}</span>}
      />
    </Datagrid>
  </List>
)
