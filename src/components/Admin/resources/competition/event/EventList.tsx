import {FC} from 'react'
import {Datagrid, FunctionField, List, NumberField, RaRecord, ReferenceField, TextField} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {SeasonCodeField} from '@/components/Admin/custom/SeasonCodeField'

export const EventList: FC = () => (
  <List>
    <Datagrid>
      <ReferenceField source="competition" reference="competition/competition" link={false} />
      <NumberField source="year" />
      <SeasonCodeField source="season_code" />
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
