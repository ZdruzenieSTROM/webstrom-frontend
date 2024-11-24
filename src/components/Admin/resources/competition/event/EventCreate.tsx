import {Checkbox, FormControlLabel} from '@mui/material'
import {FC, useState} from 'react'
import {Labeled, NumberInput, ReferenceInput, required, SelectInput, SimpleForm, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'

export const EventCreate: FC = () => {
  // initial false, necakame, ze mame registration link uz ready
  const [includeRegLink, setIncludeRegLink] = useState(false)

  return (
    <MyCreate
      transform={(record) => {
        // bud musime pridat cely registration object, alebo poslat null. ideal je si to tu ohandlit explicitne,
        // nie je uplne jasne, ako inak presvedcit react admina, aby ako ten cely objekt poslat null
        if (!includeRegLink) record.registration_link = null
        return record
      }}
    >
      <SimpleForm>
        <NumberInput source="year" helperText="ročník súťaže, napr. 48" fullWidth validate={required()} />
        <TextInput source="school_year" helperText="napr. 2023/2024" fullWidth validate={required()} />
        <MyDateTimeInput source="start" fullWidth validate={required()} />
        <MyDateTimeInput source="end" fullWidth validate={required()} />
        <ReferenceInput source="competition" reference="competition/competition">
          <SelectInput fullWidth validate={required()} />
        </ReferenceInput>
        <TextInput source="location" fullWidth />
        <FormControlLabel
          control={<Checkbox checked={includeRegLink} onChange={(e) => setIncludeRegLink(e.target.checked)} />}
          label="content.labels.reg_link_add"
        />
        {includeRegLink && (
          <Labeled label="content.labels.reg_link">
            <>
              <NumberInput source="registration_link.id" fullWidth disabled />
              <TextInput source="registration_link.url" fullWidth validate={required()} />
              <MyDateTimeInput source="registration_link.start" fullWidth validate={required()} />
              <MyDateTimeInput source="registration_link.end" fullWidth validate={required()} />
              <TextInput source="registration_link.additional_info" fullWidth />
            </>
          </Labeled>
        )}
      </SimpleForm>
    </MyCreate>
  )
}
