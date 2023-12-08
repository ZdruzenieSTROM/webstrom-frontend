import {Checkbox, FormControlLabel} from '@mui/material'
import {FC, useState} from 'react'
import {DateTimeInput, Labeled, NumberInput, required, SimpleForm, TextInput} from 'react-admin'

import {CompetitionInput} from '@/components/Admin/custom/CompetitionInput'
import {MyEdit} from '@/components/Admin/custom/MyEdit'

export const EventEdit: FC = () => {
  // initial true, nech vidime vsetky fieldy, ktore ideme editovat
  const [includeRegLink, setIncludeRegLink] = useState(true)

  return (
    <MyEdit
      transform={(record) => {
        // bud musime pridat cely registration object, alebo poslat null. ideal je si to tu ohandlit explicitne,
        // nie je uplne jasne, ako inak presvedcit react admina, aby ako ten cely objekt poslat null
        if (!includeRegLink) record.registration_link = null
        // publication_set je nested field, sme dohodnuti, ze neposielame a publikacie handlujeme inak
        delete record.publication_set
        return record
      }}
    >
      <SimpleForm>
        {/* <NumberInput source="id" fullWidth disabled /> */}
        <NumberInput source="year" fullWidth validate={required()} />
        <TextInput source="school_year" helperText="napr. 2023/2024" fullWidth validate={required()} />
        <DateTimeInput source="start" fullWidth validate={required()} />
        <DateTimeInput source="end" fullWidth validate={required()} />
        <CompetitionInput source="competition" fullWidth validate={required()} />
        <FormControlLabel
          control={<Checkbox checked={includeRegLink} onChange={(e) => setIncludeRegLink(e.target.checked)} />}
          label="Upraviť registračný link"
        />
        {includeRegLink && (
          <Labeled label="Registration link">
            <>
              <NumberInput source="registration_link.id" fullWidth disabled />
              <TextInput source="registration_link.url" fullWidth validate={required()} />
              <DateTimeInput source="registration_link.start" fullWidth validate={required()} />
              <DateTimeInput source="registration_link.end" fullWidth validate={required()} />
              <TextInput source="registration_link.additional_info" fullWidth validate={required()} />
            </>
          </Labeled>
        )}
      </SimpleForm>
    </MyEdit>
  )
}
