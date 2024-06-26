import {FC} from 'react'
import {
  BooleanField,
  Datagrid,
  DateField,
  FunctionField,
  List,
  NumberField,
  RaRecord,
  ReferenceField,
  TextField,
} from 'react-admin'

export const SemesterList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <ReferenceField source="competition" reference="competition/competition" link={false} />
      <NumberField source="year" />
      <NumberField source="season_code" />
      <TextField source="school_year" />
      <DateField source="start" />
      <DateField source="end" />
      <BooleanField source="complete" />
      <TextField source="additional_name" />
      <NumberField source="registration_link" />
      <FunctionField<RaRecord>
        source="series_set"
        label="Series count"
        render={(record) => record && <span>{record['series_set'].length}</span>}
      />
      <FunctionField<RaRecord>
        source="publication_set"
        label="Publication count"
        render={(record) => record && <span>{record['publication_set'].length}</span>}
      />
      <FunctionField<RaRecord>
        source="late_tags"
        label="Late tags count"
        render={(record) => record && <span>{record['late_tags'].length}</span>}
      />
    </Datagrid>
  </List>
)
