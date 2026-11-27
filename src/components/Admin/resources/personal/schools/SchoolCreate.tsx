import {FC} from 'react'
import {AutocompleteInput, email, ReferenceInput, required, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MySimpleForm} from '@/components/Admin/custom/MySimpleForm'

export const SchoolCreate: FC = () => (
  <MyCreate>
    <MySimpleForm toolbar={<MyCreateToolbar />}>
      <TextInput source="name" helperText="Oficiálny názov školy. Napr. Gymnázium Jura Hronca" validate={required()} />
      <TextInput source="street" validate={required()} />
      <TextInput source="city" validate={required()} />
      <TextInput source="zip_code" helperText="PSČ školy" validate={required()} />
      <ReferenceInput source="district" reference="personal/districts">
        <AutocompleteInput validate={required()} />
      </ReferenceInput>
      <TextInput
        source="abbreviation"
        helperText="Skratka školy. Zadávaj v tvare napr.: SNov3BA (Druh školy, adresa, číslo, okres)"
        validate={required()}
      />
      <TextInput
        source="email"
        helperText="Emailový kontakt na školu. Ak neexistuje všeobecný, tak napr. na riaditeľa/vyučujúceho"
        validate={email()}
      />
    </MySimpleForm>
  </MyCreate>
)
