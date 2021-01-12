import './RegisterForm.css'

import {Button} from '@material-ui/core'
import React from 'react'
import {FormProvider, useForm} from 'react-hook-form'

import FormInput from '../../components/FormItems/FormInput/FormInput'

const RegisterForm: React.FC = () => {
  const methods = useForm()
  const {handleSubmit} = methods

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <div className="registerform">
      <h1>Registrácia</h1>

      <FormProvider {...methods}>
        <form>
          <FormInput name="email" label="Email" />
          <FormInput name="password1" label="Heslo" />
          <FormInput name="password2" label="Potvrdenie hesla" />
          <FormInput name="first_name" label="Krstné meno" />
          <FormInput name="last_name" label="Priezvisko" />
          <FormInput name="nickname" label="Prezývka" />
          <FormInput name="school" label="Škola" />
          <FormInput name="year_of_graduation" label="Ročník" />
          <FormInput name="phone" label="Telefónne číslo" />
          <FormInput name="parent_phone" label="Telefónne číslo na rodiča" />
          <FormInput name="gdpr" label="Súhlas so spracovaním osobných údajov" />
        </form>
      </FormProvider>

      <br />
      <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
        Registrovať
      </Button>
    </div>
  )
}

export default RegisterForm
