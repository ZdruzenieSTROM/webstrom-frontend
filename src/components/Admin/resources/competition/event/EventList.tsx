import {FC} from 'react'
import {Datagrid, DateField, FunctionField, List, NumberField, RaRecord, ReferenceField, TextField} from 'react-admin'

export const EventList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <ReferenceField source="competition" reference="competition/event" />
      <NumberField source="year" />
      <NumberField source="season_code" />
      <TextField source="school_year" />
      <DateField source="start" />
      <DateField source="end" />
      <TextField source="additional_name" />
      <TextField source="registration_link.url" />
      <FunctionField<RaRecord>
        source="publication_set"
        label="Publication count"
        render={(record) => record && <span>{record['publication_set'].length}</span>}
      />
    </Datagrid>
  </List>
)
