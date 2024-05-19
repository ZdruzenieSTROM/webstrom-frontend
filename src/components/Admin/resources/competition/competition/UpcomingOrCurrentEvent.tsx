import {FC} from 'react'
import {
  FunctionField,
  Labeled,
  NumberField,
  RaRecord,
  SimpleShowLayout,
  TextField,
  useRecordContext,
  useRedirect,
} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'

export const UpcomingOrCurrentEvent: FC = () => {
  const record = useRecordContext()
  const redirect = useRedirect()

  return (
    <Labeled
      label="Prebiehajúca alebo najbližšia akcia"
      onClick={() => redirect('show', 'competition/event', record.upcoming_or_current_event.competition)}
      sx={{cursor: 'pointer'}}
    >
      <SimpleShowLayout record={record.upcoming_or_current_event}>
        <NumberField source="year" />
        <NumberField source="season_code" />
        <TextField source="school_year" />
        <DateTimeField source="start" />
        <DateTimeField source="end" />
        <TextField source="additional_name" />

        <TextField source="registration_link.url" />
        <DateTimeField source="registration_link.start" />
        <DateTimeField source="registration_link.end" />
        <TextField source="registration_link.additional_info" />

        <FunctionField<RaRecord>
          source="publication_set"
          label="Publication count"
          // optional access because of weird behavior of nested FunctionFields for null record
          render={(record) => record && <span>{record['publication_set']?.length}</span>}
        />
      </SimpleShowLayout>
    </Labeled>
  )
}
