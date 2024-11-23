import {FC} from 'react'
import {AutocompleteInput, email, ReferenceInput, required, SimpleForm, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'

export const SchoolEdit: FC = () => (
  <MyEdit>
    <SimpleForm>
      <TextInput
        fullWidth
        source="name"
        helperText="Oficiálny názov školy. Napr. Gymnázium Jura Hronca"
        validate={required()}
      />
      <TextInput fullWidth source="street" validate={required()} />
      <TextInput fullWidth source="city" validate={required()} />
      <TextInput fullWidth source="zip_code" helperText="PSČ školy" validate={required()} />
      <ReferenceInput source="district" reference="personal/districts">
        <AutocompleteInput fullWidth validate={required()} />
      </ReferenceInput>
      <TextInput
        fullWidth
        source="abbreviation"
        helperText="Skratka školy. Zadávajte v tvare napr.: SNov3BA (Druh školy, adresa, číslo, okres)"
        validate={required()}
      />
      <TextInput
        fullWidth
        source="email"
        helperText="Emailový kontakt na školu. Ak neexistuje všeobecný, tak napr. na riaditeľa/vyučujúceho"
        validate={email()}
      />
    </SimpleForm>
  </MyEdit>
)

