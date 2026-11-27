import {Checkbox, FormControlLabel} from '@mui/material'
import {FC, useState} from 'react'
import {NumberInput, ReferenceInput, required, SelectInput, TextInput, useTranslate} from 'react-admin'

import {MyCreateButton} from '@/components/Admin/custom/MyCreateButton'
import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MySimpleForm} from '@/components/Admin/custom/MySimpleForm'

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
      <MySimpleForm toolbar={<MyEditToolbar />}>
        <NumberInput source="year" helperText="content.helpers.event_year" validate={required()} />
        <TextInput source="school_year" helperText="content.helpers.school_year" validate={required()} />
        <MyDateTimeInput source="start" validate={required()} />
        <MyDateTimeInput source="end" validate={required()} />
        <ReferenceInput source="competition" reference="competition/competition" filter={{competition_type_exclude: 0}}>
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
              helperText="content.helpers.registration_url"
            />
            <MyDateTimeInput source="registration_link.start" validate={required()} />
            <MyDateTimeInput source="registration_link.end" validate={required()} />
            <TextInput source="registration_link.additional_info" />
          </>
        )}
        <MyCreateButton label="content.actions.create_publication" resource="competition/publication" />
      </MySimpleForm>
    </MyEdit>
  )
}
