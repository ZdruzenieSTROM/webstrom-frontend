import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, SimpleForm, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'

export const SchoolCreate: FC = () => (
  <MyCreate
    transform={(record) => {
      return {
        name: record.name,
        street: record.street,
        city: record.city,
        zip_code: record.zip_code,
        district: record.district,
        abbreviation: record.abbreviation,
        email: record.email,
      }
    }}
  >
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
        validate={(value: string) => {
          if (value && !/^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/iu.test(value)) return 'Zadaj platnú emailovú adresu'
        }}
      />
    </SimpleForm>
  </MyCreate>
)
