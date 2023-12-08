import {FC} from 'react'
import {BooleanField, Datagrid, DateField, FunctionField, List, NumberField, RaRecord, TextField} from 'react-admin'

import {CompetitionField} from '@/components/Admin/custom/CompetitionField'

export const EventList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <NumberField source="id" />
      <CompetitionField source="competition" />
      <NumberField source="year" />
      <NumberField source="season_code" />
      <TextField source="school_year" />
      <DateField source="start" />
      <DateField source="end" />
      <TextField source="additional_name" />

      <BooleanField source="can_participate" />
      <BooleanField source="is_registered" />

      <TextField source="registration_link.url" />

      <FunctionField<RaRecord>
        source="publication_set"
        label="Publication count"
        render={(record) => record && <span>{record['publication_set'].length}</span>}
      />
    </Datagrid>
  </List>
)
