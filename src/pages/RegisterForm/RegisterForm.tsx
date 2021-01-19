import './RegisterForm.css'

import {Button} from '@material-ui/core'
import React from 'react'
import {useForm} from 'react-hook-form'

import FormCheckbox from '../../components/FormItems/FormCheckbox/FromCheckbox'
import FormInput from '../../components/FormItems/FormInput/FormInput'
import FormSelect from '../../components/FormItems/FormSelect/FormSelect'

const RegisterForm: React.FC = () => {
  const {handleSubmit, control} = useForm()

  const grades = [
    {
      pk: 0,
      fields: {
        name: 'Prvý ročník ZŠ',
      },
    },
    {
      pk: 1,
      fields: {
        name: 'Druhý ročník ZŠ',
      },
    },
    {
      pk: 2,
      fields: {
        name: 'Tretí ročník ZŠ',
      },
    },
    {
      pk: 3,
      fields: {
        name: 'Štvrtý ročník ZŠ',
      },
    },
    {
      pk: 4,
      fields: {
        name: 'Piaty ročník ZŠ',
      },
    },
    {
      pk: 5,
      fields: {
        name: 'Šiesty ročník ZŠ | Príma',
      },
    },
    {
      pk: 6,
      fields: {
        name: 'Siedmy ročník ZŠ | Sekunda',
      },
    },
    {
      pk: 7,
      fields: {
        name: 'Ôsmy ročník ZŠ | Tercia',
      },
    },
    {
      pk: 8,
      fields: {
        name: 'Deviaty ročník ZŠ | Kvarta | 1. ročník 5-ročného gymnázia',
      },
    },
    {
      pk: 9,
      fields: {
        name: 'Prvý ročník SŠ | Kvinta | 2. ročník 5-ročného gymnázia',
      },
    },
    {
      pk: 10,
      fields: {
        name: 'Druhý ročník SŠ | Sexta | 3. ročník 5-ročného gymnázia',
      },
    },
    {
      pk: 11,
      fields: {
        name: 'Tretí ročník SŠ | Septima | 4. ročník 5-ročného gymnázia',
      },
    },
    {
      pk: 12,
      fields: {
        name: 'Štvrtý ročník SŠ | Oktáva | 5. ročník 5-ročného gymnázia',
      },
    },
    {
      pk: 13,
      fields: {
        name: 'Už nechodím do školy',
      },
    },
  ].map((grade) => ({id: grade.pk, label: grade.fields.name}))

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <div className="registerform">
      <h1>Registrácia</h1>

      <form>
        <FormInput control={control} name="email" label="Email" required />
        <FormInput control={control} name="password1" label="Heslo" type="password" required />
        <FormInput control={control} name="password2" label="Potvrdenie hesla" type="password" required />
        <FormInput control={control} name="first_name" label="Krstné meno" required />
        <FormInput control={control} name="last_name" label="Priezvisko" required />
        <FormInput control={control} name="nickname" label="Prezývka" />
        <FormInput control={control} name="school" label="Škola" required />
        <FormSelect control={control} name="year_of_graduation" label="Ročník" options={grades} required />
        <FormInput control={control} name="phone" label="Telefónne číslo" />
        <FormInput control={control} name="parent_phone" label="Telefónne číslo na rodiča" />
        <FormCheckbox control={control} name="gdpr" label="Súhlas so spracovaním osobných údajov" required />
      </form>

      <br />
      <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
        Registrovať
      </Button>
    </div>
  )
}

export default RegisterForm
