import {FC} from 'react'
import {Datagrid, FunctionField, List, NumberField, RaRecord, ReferenceField, TextField} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'

export const EventList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <ReferenceField source="competition" reference="competition/competition" link={false} />
      <NumberField source="year" />
      <NumberField source="season_code" />
      <TextField source="school_year" />
      <DateTimeField source="start" />
      <DateTimeField source="end" />
      <TextField source="location" />
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
