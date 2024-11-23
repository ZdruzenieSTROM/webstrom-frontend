import {FC} from 'react'
import {
  BooleanField,
  Datagrid,
  FunctionField,
  List,
  NumberField,
  RaRecord,
  ReferenceField,
  TextField,
} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'

export const SemesterList: FC = () => {
  const season_code_strings = [
    {id: 0, name: 'Zimný'},
    {id: 1, name: 'Letný'},
    {id: 2, name: 'Iný'},
  ]

  return (
    <List>
      <Datagrid rowClick="show">
        <ReferenceField source="competition" reference="competition/competition" link={false} />
        <NumberField source="year" />
        <FunctionField
          source="season_code"
          render={(record) => {
            return `${season_code_strings[record.season_code].name ?? ''}`
          }}
        />
        <TextField source="school_year" />
        <DateTimeField source="start" />
        <DateTimeField source="end" />
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
}
