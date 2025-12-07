import {Checkbox, FormControlLabel} from '@mui/material'
import {FC, useState} from 'react'
import {NumberInput, ReferenceInput, required, SelectInput, SimpleForm, TextInput, useTranslate} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'

export const EventCreate: FC = () => {
  const translate = useTranslate()
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
      <SimpleForm toolbar={<MyCreateToolbar />}>
        <NumberInput source="year" helperText="ročník súťaže, napr. 48" validate={required()} />
        <TextInput source="school_year" helperText="napr. 2023/2024" validate={required()} />
        <MyDateTimeInput source="start" validate={required()} />
        <MyDateTimeInput source="end" validate={required()} />
        <ReferenceInput source="competition" reference="competition/competition">
          <SelectInput validate={required()} />
        </ReferenceInput>
        <TextInput source="location" />
        <FormControlLabel
          control={<Checkbox checked={includeRegLink} onChange={(e) => setIncludeRegLink(e.target.checked)} />}
          // FormControlLabel nie je RA component, takze translate treba explicitne
          label={translate('content.labels.reg_link_add')}
        />
        {includeRegLink && (
          <>
            <TextInput
              source="registration_link.url"
              validate={required()}
              helperText="Zadávajte v tvare https://prihlasky.strom.sk/xxx"
            />
            <MyDateTimeInput source="registration_link.start" validate={required()} />
            <MyDateTimeInput source="registration_link.end" validate={required()} />
            <TextInput source="registration_link.additional_info" />
          </>
        )}
      </SimpleForm>
    </MyCreate>
  )
}
