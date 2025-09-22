import {Checkbox, FormControlLabel} from '@mui/material'
import {FC, useState} from 'react'
import {NumberInput, ReferenceInput, required, SelectInput, SimpleForm, TextInput, useTranslate} from 'react-admin'

import {MyCreateButton} from '@/components/Admin/custom/MyCreateButton'
import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
import {MyEdit} from '@/components/Admin/custom/MyEdit'

export const EventEdit: FC = () => {
  const translate = useTranslate()
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
        <MyCreateButton label="ra.action.publication.create" resource="competition/publication" />
      </SimpleForm>
    </MyEdit>
  )
}
